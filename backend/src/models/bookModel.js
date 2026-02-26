import mongoose from "mongoose";


const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please enter book title"],
        trim: true,
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
    availibility: {
        type: Boolean,
        default: true,
    },

}, {
    timestamps: true,
})
 
export const bookModel = mongoose.model('Book', bookSchema);




