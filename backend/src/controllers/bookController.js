import { asyncErrorHandler } from "../middlewares/asyncErrorMiddleware.js";
import  ErrorHandler  from "../middlewares/errorMiddleware.js";
import { bookModel } from "../models/bookModel.js";
;

export const addBook = asyncErrorHandler(async (req, res, next) => {
    
    const { title, author, description, price, quantity } = req.body || {};

    if (!title || !author || !description || !price || !quantity) {
        return next(new ErrorHandler(400, 'All fields are required. '));
    }
    const book = await bookModel.create({
        title,
        author,
        description,
        price,
        quantity
    })
    res.status(201).json({
        success: true,
        message: 'Book added successfully',
        book
    })

})

export const getAllBooks = asyncErrorHandler(async (req, res, next) => {
    const books = await bookModel.find();
    res.status(200).json({
        success: true,
        books
    })
})


export const deleteBook = asyncErrorHandler(async (req, res, next) => {

    const bookId = req.params.id;
    const book = await bookModel.findById(bookId);
    if (!book) { 
        return next(new ErrorHandler(404, 'Book not found. '));
    }
    await book.deleteOne();
    res.status(200).json({
        success: true,
        message: 'Book deleted successfully. '
    })

});


