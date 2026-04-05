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
  semester: {
        type: Number,
        required: [true, "Please enter your current semester"],
        enum: [1, 2, 3, 4, 5, 6], 
        default: 1
    },

    branch: {
        type: String,
        required: [true, "Please enter your branch"],
        uppercase: true, 
        trim: true
    },

    year: {
        type: Number,
        required: [true, "Please enter your current year"],
        min: [1, "Year cannot be less than 1"],
        max: [3, "Year cannot be more than 3"]
    },

    rollNumber: {
    type: String,
    required: [true, 'Roll Number is required'],
    unique: true,
    trim: true
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
// access token

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    
        expiresIn: process.env.JWT_EXPIRE || '15m', 
    });
};

//  Refresh Token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '7d', 
    });
};

// 3. OTP Generation (Same as before)
userSchema.methods.generateVerificationCode = function () {
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    this.verificationCode = verificationCode;
    this.verificationCodeExpires = Date.now() + 10 * 60 * 1000;
    return verificationCode;
};

// 4. Password Reset Token (Same as before)
userSchema.methods.generateResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    this.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
    return resetToken;
};

export const userModel = mongoose.model('User', userSchema);