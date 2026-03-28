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
    
    const userId = req.user?._id;

    if (!userId) {
        return next(new ErrorHandler(401, "User not authenticated. Please login again."));
    }

    try {
        // ID Format validation
        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return next(new ErrorHandler(400, "Invalid Book ID format."));
        }

        const user = await userModel.findById(userId);

        // Check Admin approval
        if (user.adminApproved !== "approved") {
            return next(new ErrorHandler(403, "Account not approved by Admin. Request denied."));
        }

        // 2. Duplicate Check: Yahan 'student' field use karein (Schema ke mutabiq)
        const existingRequest = await issueRequestModel.findOne({
            student: userId, 
            book: bookId,
            status: { $in: ['pending', 'approved'] }
        });

        if (existingRequest) {
            return next(new ErrorHandler(400, "A request for this book is already active."));
        }

        // 3. CREATE: Yahan 'student' key hi use karni hai
        let issueRequest = await issueRequestModel.create({
            student: userId, // <--- YE SABSE IMPORTANT HAI
            book: bookId,
            status: 'pending',
            requestDate: new Date(),
        });

        // 4. POPULATE: Response ke liye data fetch karein
        issueRequest = await issueRequestModel.findById(issueRequest._id)
            .populate("book", "title author") 
            .populate("student", "name email"); // <--- Yahan bhi 'student'

        res.status(201).json({
            success: true,
            message: "Issue request submitted to Admin.",
            issueRequest
        });

    } catch (error) {
        console.error("System Error (recordIssueBooks):", error);
        next(error);
    }
});

export const getMyBookRequests = async (req, res) => {
    try {
        const studentId = req.user._id;

        // Fetch requests for the logged-in student and populate book details
        const requests = await issueRequestModel.find({ user: studentId })
            .populate({
                path: 'book',
                select: 'title author description price image category isbn dueDate issueDate' 
            })
            .sort({ createdAt: -1 });

        // Map through requests to calculate real-time fine
        const updatedRequests = requests.map(request => {
            let currentFine = 0;
            
            // Calculate fine if the book is approved/issued and not yet returned
            if (request.status === 'approved' && request.dueDate) {
                currentFine = calculateFine({
                    dueDate: request.dueDate,
                    returnDate: new Date(), // Fine calculated up to current date
                    finePerDay: 5,         // Default fine rate
                    maxFine: 1000          // Maximum fine cap
                });
            }
            
            return { ...request._doc, currentFine };
        });

        res.status(200).json({
            success: true,
            count: updatedRequests.length,
            requests: updatedRequests
        });

    } catch (error) {
        console.error("System Error (getMyBookRequests):", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch book requests.",
            error: error.message
        });
    }
};

export const getPendingRequests = asyncErrorHandler(async (req, res, next) => {
   
    const requests = await issueRequestModel.find({ status: 'pending' })
        .populate('student', 'name email branch year semester rollNumber')
        .populate('book', 'title price image')
        .sort({ createdAt: 1 });

    res.status(200).json({
        success: true,
        requests
    });
});


export const approveBookRequest = asyncErrorHandler(async (req, res, next) => {
    const { requestId } = req.params;

    // 1. Fetch pending request - POPULATE 'student'
    const request = await issueRequestModel.findById(requestId).populate('book student');

    if (!request) {
        return next(new ErrorHandler(404, "Request not found in Registry."));
    }

    if (request.status !== 'pending') {
        return next(new ErrorHandler(400, "Request already processed."));
    }

    const studentData = request.student; 
    const bookData = request.book;

    if (!studentData) {
        return next(new ErrorHandler(404, "Student profile missing in this request."));
    }


    // 2. Atomic Borrow Limit Check (Max 6 books)
    const updatedUser = await userModel.findOneAndUpdate(
        { _id: studentData._id, activeBorrowCount: { $lt: 6 } }, 
        { $inc: { activeBorrowCount: 1 } },
        { returnDocument: 'after' } 
    );

    if (!updatedUser) {
        return next(new ErrorHandler(400, "User has reached the maximum borrow limit (6 books)."));
    }

    // 3. Atomic Inventory Check
    const book = await bookModel.findOneAndUpdate(
        { _id: bookData._id, quantity: { $gt: 0 } },
        { $inc: { quantity: -1 } },
        { returnDocument: 'after' } 
    );

    if (!book) {
        // Rollback User active count if book is unavailable
        await userModel.findByIdAndUpdate(studentData._id, { $inc: { activeBorrowCount: -1 } });
        return next(new ErrorHandler(400, "Asset is currently out of stock."));
    }

    // 4. Create Final Issue Record
    const finalIssue = await issueModel.create({
        user: studentData._id, // Issue model uses 'user', that's fine
        book: book._id,
        name: studentData.name,
        email: studentData.email,
        branch: studentData.branch,
        price: book.price,
        issueDate: new Date(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), 
        status: 'approved'
    });

    // 5. Update Request Status
    request.status = 'approved';
    await request.save();

    // 6. Update User's Profile Array
    await userModel.findByIdAndUpdate(
        studentData._id,
        {
            $push: {
                issueBooks: {
                    bookId: book._id,
                    issueId: finalIssue._id,
                    bookTitle: book.title,
                    issueDate: finalIssue.issueDate,
                    dueDate: finalIssue.dueDate,
                    returned: false
                }
            }
        }
    );

    res.status(200).json({
        success: true,
        message: "Book successfully issued and catalog updated.",
        issueDetail: finalIssue 
    });
});

export const rejectBookRequest = asyncErrorHandler(async (req, res, next) => {
    const { requestId } = req.params;

    const request = await issueRequestModel.findById(requestId);
    if (!request || request.status !== 'pending') {
        return next(new ErrorHandler(404, "Pending request not found."));
    }

    request.status = 'rejected';
    await request.save();

    res.status(200).json({
        success: true,
        message: "Request rejected."
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
        return next(new ErrorHandler(400, "Invalid Issue ID format."));
    }

    // 1. Fetch the Issue record
    const issueRecord = await issueModel.findById(issueId);

    // Check if record exists and is in the correct state
    if (!issueRecord || (issueRecord.status !== "return_requested" && issueRecord.status !== "approved")) {
        return next(new ErrorHandler(404, "Active or Pending return request not found."));
    }

    const today = new Date();

    // 2. Calculate Fine (Using your utility)
    const fineAmount = calculateFine({
        dueDate: issueRecord.dueDate,
        returnDate: today,
        finePerDay: 5,
        graceDays: 1,
        maxFine: 500,
        chargePartialDay: true
    });

    // 3. Update Issue Record Status
    issueRecord.returnDate = today;
    issueRecord.fine = fineAmount;
    issueRecord.status = "returned"; 
    await issueRecord.save();

    // 4. ATOMIC: Inventory Increase (+1 Book)
    await bookModel.findByIdAndUpdate(
        issueRecord.book,
        { $inc: { quantity: 1 } }
    );

    // 5. ATOMIC: Decrement User's Borrow Count
    await userModel.findOneAndUpdate(
        { _id: issueRecord.user, activeBorrowCount: { $gt: 0 } },
        { $inc: { activeBorrowCount: -1 } }
    );

    // 6. FIXED: Update the specific book in User's 'issueBooks' array
    // Bug Fix: Match by issueId instead of bookId to be 100% precise
    await userModel.updateOne(
        { 
            _id: issueRecord.user, 
            "issueBooks.issueId": issueRecord._id // Precise match using Issue ID
        },
        { 
            $set: { 
                "issueBooks.$.returned": true,
                "issueBooks.$.returnDate": today 
            } 
        }
    );

    res.status(200).json({
        success: true,
        message: `Asset received. Total fine processed: ₹${fineAmount}`,
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

