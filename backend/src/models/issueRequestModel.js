import mongoose from "mongoose";


const issueRequestSchema = new mongoose.Schema({
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book', required: true
    },

    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', required: true
    },

    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    requestDate: { type: Date, default: Date.now } // Yeh aapki queue priority hai
}, { timestamps: true });

export   const issueRequestModel = mongoose.model('IssueRequest', issueRequestSchema);