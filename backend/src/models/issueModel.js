import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    
    name: { type: String },
    email: { type: String },
    branch: { type: String },

    price: { type: Number },

    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true,
    },

    issueDate: {
        type: Date,
        default: null, 
    },

    dueDate: {
        type: Date,
        default: null, 
    },

    returnDate: {
        type: Date,
        default: null,
    },

    fine: {
        type: Number,
        default: 0,
    },

    status: {
        type: String,
       
        enum: ["pending", "approved", "rejected", "return_requested", "returned"],
        default: "pending" 
    }

}, { timestamps: true });


issueSchema.index({ status: 1, createdAt: 1 });
issueSchema.index({ user: 1, book: 1, status: 1 });

export const issueModel = mongoose.model("Issue", issueSchema);