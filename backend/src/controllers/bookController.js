import imagekit from "../services/imagekit.js";
import { bookModel } from "../models/bookModel.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { asyncErrorHandler } from "../middlewares/asyncErrorMiddleware.js";

// 1. ADD BOOK: Includes ISBN validation and cataloging
export const addBook = asyncErrorHandler(async (req, res, next) => {

    const { title, author, description, price, quantity, category, isbn } = req.body;

    // Validate required fields including the new ISBN
    if (!title || !author || !description || !price || !quantity || !category || !isbn) {
        return next(new ErrorHandler(400, 'All fields are required, including ISBN.'));
    }

    // Check if ISBN already exists to prevent duplicate manual entries
    const existingBook = await bookModel.findOne({ isbn });
    if (existingBook) {
        return next(new ErrorHandler(400, 'A book with this ISBN already exists in the registry.'));
    }

    if (!req.file) {
        return next(new ErrorHandler(400, 'Please upload a cover image.'));
    }

    // Upload to ImageKit
    const uploadResponse = await imagekit.upload({
        file: req.file.buffer, 
        fileName: `svpc_${Date.now()}_${req.file.originalname}`, 
        folder: "/svpc-library/books",
    });

    // Save to DB with ISBN
    const book = await bookModel.create({
        title, 
        author, 
        description, 
        price, 
        quantity, 
        category,
        isbn, // New field added
        image: {
            url: uploadResponse.url,
            fileId: uploadResponse.fileId 
        }
    });

    res.status(201).json({ 
        success: true, 
        message: 'Asset cataloged successfully', 
        book 
    });
});

// 2. EDIT BOOK: Updates asset details including ISBN

export const editBook = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    const { isbn } = req.body;

    let book = await bookModel.findById(id);
    if (!book) return next(new ErrorHandler(404, 'Asset not found'));

    // Check if the new ISBN belongs to another book (Unique check)
    if (isbn && isbn !== book.isbn) {
        const isbnCheck = await bookModel.findOne({ isbn });
        if (isbnCheck) {
            return next(new ErrorHandler(400, 'This ISBN is already assigned to another book.'));
        }
    }

    let imageData = book.image;

    // Handle Image Update
    if (req.file) {
        if (book.image?.fileId) {
            await imagekit.deleteFile(book.image.fileId).catch(err => 
                console.log("ImageKit Cleanup Warning:", err.message)
            );
        }

        const uploadRes = await imagekit.upload({
            file: req.file.buffer,
            fileName: `updated_${Date.now()}`,
            folder: "/svpc-library/books"
        });
        imageData = { url: uploadRes.url, fileId: uploadRes.fileId };
    }

    // Prepare update object (spreads req.body to include ISBN and other fields)
    const updateData = { ...req.body, image: imageData };

    book = await bookModel.findByIdAndUpdate(id, updateData, {
        returnDocument: 'after',
        runValidators: true, 
    });

    res.status(200).json({ 
        success: true, 
        message: 'Asset records synchronized', 
        book 
    });
});

// 3. DELETE BOOK: Purges the asset from DB and deletes the remote image
export const deleteBook = asyncErrorHandler(async (req, res, next) => {
    const book = await bookModel.findById(req.params.id);
    
    if (!book) return next(new ErrorHandler(404, 'Book not found'));

    if (book.image?.fileId) {
        await imagekit.deleteFile(book.image.fileId).catch(err => 
            console.log("Remote Deletion Error:", err.message)
        );
    }

    await book.deleteOne();
    
    res.status(200).json({ 
        success: true, 
        message: 'Asset purged from registry' 
    });
});

// 4. GET ALL BOOKS: Fetches the entire collection sorted by newest first
export const getAllBooks = asyncErrorHandler(async (req, res, next) => {
    const books = await bookModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, books });
});