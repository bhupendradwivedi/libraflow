import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please enter book title"],
        trim: true,
    },
   
    isbn: {
        type: String,
        required: [true, "Please enter book ISBN"],
        unique: true,
        trim: true,
        uppercase: true, 
    },
    author: {
        type: String,
        required: [true, "Please enter book author"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Please enter book description"],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, "Please enter book price"],
    },
    quantity: {
        type: Number,
        required: [true, "Please enter book quantity"],
    },
    category: {
        type: String,
        required: [true, "Please select book category"],
        enum: ["Computer Science", "Mechanical", "Civil", "Electrical", "General"],
    },
    image: {
        url: {
            type: String,
            required: [true, "Book cover image is required"]
        },
        fileId: {
            type: String,
            required: [true, "ImageKit fileId is required"]
        }
    },
    availibility: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
})

export const bookModel = mongoose.model('Book', bookSchema);