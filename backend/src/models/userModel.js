import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import crypto from 'crypto';
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false
    },
    activeBorrowCount: {
        type: Number,
        default: 0
    },

    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    branch: {
        type: String,
        required: [true, 'Branch is required']
    },
    
    accountVerified: {
        type: Boolean,
        default: false
    },

    adminApproved: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },

    issueBooks: [
        {
            bookId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Issue'
            },

            returned: {
                type: Boolean,
                default: false
            },

            bookTitle: String,

            borrowedDate: {
                type: Date,
                default: Date.now
            },
            dueDate: Date

        }],

    verificationCode: Number,
    verificationCodeExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date


}, { timestamps: true });

userSchema.methods.generateVerificationCode = function () {

    const generateVerificationCode = Math.floor(100000 + Math.random() * 900000);
    this.verificationCode = generateVerificationCode;
    this.verificationCodeExpires = Date.now() + 10 * 60 * 1000;
    return generateVerificationCode;


}
userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
}
userSchema.methods.generateResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    this.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
    return resetToken;

}

export const userModel = mongoose.model('User', userSchema);