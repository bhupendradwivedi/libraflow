import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // Snapshot fields: Inhe required se hata kar default null kiya hai
    // kyunki request ke time ye details admin approve hone par fill hongi.
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
        default: null, // Request ke time null rahega
    },

    dueDate: {
        type: Date,
        default: null, // Approval ke time calculate hoga
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
        // Yahan 'pending' aur 'rejected' add kiya hai
        enum: ["pending", "approved", "rejected", "return_requested", "returned"],
        default: "pending" // Pehla status hamesha pending hoga
    }

}, { timestamps: true });

// Queue aur unique requests ke liye indexes sahi hain
issueSchema.index({ status: 1, createdAt: 1 });
issueSchema.index({ user: 1, book: 1, status: 1 });

export const issueModel = mongoose.model("Issue", issueSchema);