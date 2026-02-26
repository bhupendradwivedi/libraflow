import { asyncErrorHandler } from "../middlewares/asyncErrorMiddleware.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { bookModel } from "../models/bookModel.js";
import { issueModel } from "../models/issueModel.js";
import { userModel } from "../models/userModel.js";
import mongoose from "mongoose";
import { issueRequestModel } from '../models/issueRequestModel.js';
import { calculateFine } from "../utils/calculateFine.js";

export const recordIssueBooks = asyncErrorHandler(async (req, res, next) => {
    const bookId = req.params.id;
    const userId = req.user._id;

    // 1. Basic Validation
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
        return next(new ErrorHandler(400, "Invalid Book ID."));
    }

    // 2. Check if already requested (Pending) or already has the book
    const existingRequest = await issueModel.findOne({
        user: userId,
        book: bookId,
        status: { $in: ['pending', 'approved'] }, // Check if pending or already issued
        returned: false
    });

    if (existingRequest) {
        return next(new ErrorHandler(400, "Aapne pehle hi is book ki request bheji hai ya yeh aapke paas hai."));
    }

    // 3. Create ONLY a Request (No quantity reduction yet)
    const issueRequest = await issueModel.create({
        user: userId,
        book: bookId,
        status: 'pending', // Default status
        requestDate: new Date(),
    });

    res.status(201).json({
        success: true,
        message: "Book issue request admin ko bhej di gayi hai.",
        issueRequest
    });
});
export const getPendingRequests = asyncErrorHandler(async (req, res, next) => {
    // .sort({ createdAt: 1 }) isse jo pehle aaya wo upar dikhega (Queue Logic)
    const requests = await issueModel.find({ status: 'pending' })
        .populate('user', 'name email branch')
        .populate('book', 'title price')
        .sort({ createdAt: 1 });

    res.status(200).json({
        success: true,
        requests
    });
});

export const approveBookRequest = asyncErrorHandler(async (req, res, next) => {
    const { requestId } = req.params;

    // 1. Request check karein aur details populate karein (Book details snapshot ke liye zaroori hai)
    const request = await issueModel.findById(requestId).populate('book');

    if (!request || request.status !== 'pending') {
        return next(new ErrorHandler(404, "Valid pending request nahi mili ya pehle hi process ho chuki hai."));
    }

    // 2. User fetch karein details ke liye
    const user = await userModel.findById(request.user);
    if (!user) {
        return next(new ErrorHandler(404, "Student data nahi mila."));
    }

    // 3. ATOMIC Borrow Limit Check + Increment
    const updatedUser = await userModel.findOneAndUpdate(
        {
            _id: user._id,
            activeBorrowCount: { $lt: 6 }
        },
        { $inc: { activeBorrowCount: 1 } },
        { returnDocument: 'after' }
    );

    if (!updatedUser) {
        return next(new ErrorHandler(400, "User ki borrow limit poori ho chuki hai (Max 6 books)."));
    }

    // 4. ATOMIC Book Quantity Reduce (Snapshot data ke liye book object use karenge)
    const book = await bookModel.findOneAndUpdate(
        { _id: request.book._id, quantity: { $gt: 0 } },
        { $inc: { quantity: -1 } },
        { returnDocument: 'after' }
    );

    if (!book) {
        // Rollback User Borrow Count
        await userModel.findByIdAndUpdate(user._id, { $inc: { activeBorrowCount: -1 } });
        return next(new ErrorHandler(400, "Book out of stock hai."));
    }

    // 5. Update Issue Record (Snapshot Data & Status)
    request.status = 'approved';
    request.name = user.name;
    
    request.issueDate = new Date();
    request.dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    await request.save();

    // 6. Push into User's issueBooks array (Aapka snapshot logic)
    await userModel.findByIdAndUpdate(
        user._id,
        {
            $push: {
                issueBooks: {
                    bookId: request._id,
                    bookTitle: book.title,
                    issueDate: request.issueDate,
                    dueDate: request.dueDate,
                    returned: false
                }
            }
        }
    );

    // 7. Success Response
    res.status(200).json({
        success: true,
        message: "Book successfully approve aur issue ho gayi hai!",
        request
    });
});
export const rejectBookRequest = asyncErrorHandler(async (req, res, next) => {
    const { requestId } = req.params;

    const request = await issueModel.findById(requestId);
    if (!request || request.status !== 'pending') {
        return next(new ErrorHandler(404, "Pending request nahi mili."));
    }

    request.status = 'rejected';
    await request.save();

    res.status(200).json({
        success: true,
        message: "Request reject kar di gayi hai."
    });
});
export const requestReturnBook = asyncErrorHandler(async (req, res, next) => {
    const issueId = req.params.id;

    const issueRecord = await issueModel.findById(issueId);

    if (!issueRecord || issueRecord.status !== 'approved') {
        return next(new ErrorHandler(400, "Yeh book return nahi ki ja sakti."));
    }

    // Status badal kar admin ki queue mein bhej diya
    issueRecord.status = 'return_requested';
    await issueRecord.save();

    res.status(200).json({
        success: true,
        message: "Return request admin ko bhej di gayi hai. Book library mein jama karein."
    });
});
export const approveReturnRequest = asyncErrorHandler(async (req, res, next) => {
    const issueId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(issueId)) {
        return next(new ErrorHandler(400, "Invalid Issue ID."));
    }

    const issueRecord = await issueModel.findById(issueId);

    if (!issueRecord || issueRecord.status !== "return_requested") {
        return next(new ErrorHandler(404, "Pending return request nahi mili."));
    }

    const today = new Date();

    // 1. Calculate Fine (Aapka original logic)
    const fineAmount = calculateFine({
        dueDate: issueRecord.dueDate,
        returnDate: today,
        finePerDay: 5,
        graceDays: 1,
        maxFine: 500,
        chargePartialDay: true
    });

    // 2. Update Issue Record
    issueRecord.returnDate = today;
    issueRecord.fine = fineAmount;
    issueRecord.status = "returned"; // Zaroori update

    await issueRecord.save();

    // 3. ATOMIC Increase book quantity
    await bookModel.findByIdAndUpdate(
        issueRecord.book,
        { $inc: { quantity: 1 } }
    );

    // 4. Safe decrement borrow count
    await userModel.findOneAndUpdate(
        { _id: issueRecord.user, activeBorrowCount: { $gt: 0 } },
        { $inc: { activeBorrowCount: -1 } }
    );

    // 5. Update embedded issueBooks (Aapka original logic)
    await userModel.updateOne(
        {
            _id: issueRecord.user,
            "issueBooks.bookId": issueRecord._id
        },
        {
            $set: {
                "issueBooks.$.returned": true
            }
        }
    );

    res.status(200).json({
        success: true,
        message: "Book received and return approved.",
        fine: fineAmount
    });
});
























































export const returnIssuedBook = asyncErrorHandler(async (req, res, next) => {

    const issueId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(issueId)) {
        return next(new ErrorHandler(400, "Invalid Issue ID."));
    }

    const issueRecord = await issueModel.findById(issueId);

    if (!issueRecord) {
        return next(new ErrorHandler(404, "Issue record not found."));
    }

    //  Authorization Check
    if (
        req.user.role !== "admin" &&
        issueRecord.user.toString() !== req.user._id.toString()
    ) {
        return next(new ErrorHandler(403, "Not authorized to return this book."));
    }

    if (issueRecord.returnDate) {
        return next(new ErrorHandler(400, "Book already returned."));
    }

    const today = new Date();


    //  Calculate Fine using separate utility function (CALL)
    const fineAmount = calculateFin({
        dueDate: issueRecord.dueDate,
        returnDate: today,
        finePerDay: 5,      // configurable
        graceDays: 1,        // 1 day grace
        maxFine: 500,        // maximum fine cap
        chargePartialDay: true
    });

    // Update Issue Record
    issueRecord.returnDate = today;
    issueRecord.fine = fineAmount;

    await issueRecord.save();
    //  Increase book quantity
    await bookModel.findByIdAndUpdate(
        issueRecord.book,
        { $inc: { quantity: 1 } }
    );

    //  Safe decrement borrow count
    await userModel.findOneAndUpdate(
        { _id: issueRecord.user, activeBorrowCount: { $gt: 0 } },
        { $inc: { activeBorrowCount: -1 } }
    );

    //  Update embedded issueBooks
    await userModel.updateOne(
        {
            _id: issueRecord.user,
            "issueBooks.bookId": issueRecord._id
        },
        {
            $set: {
                "issueBooks.$.returned": true
            }
        }
    );

    res.status(200).json({
        success: true,
        message: "Book returned successfully.",
        fine: fineAmount
    });

});



export const createIssueRequest = asyncErrorHandler(async (req, res, next) => {
    try {
        const { bookId } = req.body;
        const studentId = req.user._id; // Yeh Auth middleware se aata hai

        // Check if already requested
        const existingRequest = await issueRequestModel.findOne({
            book: bookId,
            student: studentId,
            status: 'pending'
        });

        if (existingRequest) {
            return res.status(400).json({ message: "Aapne pehle hi is book ke liye request bheji hui hai!" });
        }

        const newRequest = new issueRequestModel({
            book: bookId,
            student: studentId
        });

        await newRequest.save();
        res.status(201).json({ message: "Request successfully admin ko bhej di gayi hai." });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }

})


export const issuedBooks = asyncErrorHandler(async (req, res, next) => {

})


export const getIssuedBooksByAdmin = asyncErrorHandler(async (req, res, next) => { })

