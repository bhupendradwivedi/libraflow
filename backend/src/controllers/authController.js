import ErrorHandler from "../middlewares/errorMiddleware.js";
import { userModel } from "../models/userModel.js";
import { asyncErrorHandler } from "../middlewares/asyncErrorMiddleware.js";
import { sendVerificationCode } from "../utils/sendVerificationCode.js";
import bcrypt from 'bcryptjs';
import { sendToken } from "../utils/sendToken.js";
import jwt from 'jsonwebtoken';
import crypto from 'crypto';



export const registerUser = asyncErrorHandler(async (req, res, next) => {
    const { name, email, password, branch, rollNumber, year, semester } = req.body;

    // 1. Validate mandatory fields
    if (!name || !email || !password || !branch || !rollNumber || !year || !semester) {
        return next(new ErrorHandler(400, "Please provide all required registration details."));
    }

    // 2. Check if a VERIFIED user already exists with this email
    const existingVerifiedUser = await userModel.findOne({ email, accountVerified: true });
    if (existingVerifiedUser) {
        return next(new ErrorHandler(400, "This email is already registered and verified. Please login."));
    }

    // 3. Securely hash the password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 4. Initialize User Instance to generate OTP logic
    // Note: We use a temp instance to access schema methods
    const tempUser = new userModel();
    const verificationCode = tempUser.generateVerificationCode(); 
    const otpExpiry = tempUser.verificationCodeExpires;

     
    await userModel.findOneAndUpdate(
        { email, accountVerified: false }, 
        { 
            name, 
            password: hashedPassword, 
            branch, 
            rollNumber, 
            year, 
            semester,
            verificationCode,
            verificationCodeExpires: otpExpiry,
            createdAt: Date.now() 
        },
        { 
            upsert: true,     
            returnDocument: 'after',     
            runValidators: false 
        }
    );

    try {
        await sendVerificationCode(verificationCode, email);
        
        return res.status(200).json({
            success: true,
            message: `A 6-digit OTP has been sent to ${email}. Valid for 15 minutes.`
        });
    } catch (error) {
        console.error("Mail Dispatch Error:", error);
        return next(new ErrorHandler(500, "Failed to send OTP email. Please try again later."));
    }
});
export const verifyOTP = asyncErrorHandler(async (req, res, next) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return next(new ErrorHandler(400, "Email and OTP are required."));
    }

    // 1. User ko dhundna (Jo abhi tak verify nahi hua hai)
    const user = await userModel.findOne({ 
        email, 
        accountVerified: false 
    }).sort({ createdAt: -1 });

    if (!user) {
        return next(new ErrorHandler(404, "User not found or already verified."));
    }

    // 2. Check Expiry (Aapka logic sahi hai, bas thoda clean kiya hai)
    if (new Date() > new Date(user.verificationCodeExpires)) {
        return next(new ErrorHandler(400, "OTP has expired. Please resend."));
    }

    // 3. OTP Match check
    if (String(user.verificationCode) !== String(otp)) {
        return next(new ErrorHandler(400, "Invalid OTP."));
    }

    await userModel.deleteMany({ 
        email, 
        _id: { $ne: user._id }, 
        accountVerified: false 
    });

    // 5. User ko verify mark karein
    user.accountVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    
    await user.save({ validateBeforeSave: false });

    
    sendToken(user, 200, "Account Verified and Registered Successfully", res);
});
// 3. Login User
export const loginUser = asyncErrorHandler(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) return next(new ErrorHandler(400, 'Email and password are required.'));

    const user = await userModel.findOne({ email, accountVerified: true }).select('+password');
    if (!user) return next(new ErrorHandler(404, 'User not found. Please register first.'));

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) return next(new ErrorHandler(400, 'Invalid Email or Password.'));

    
    sendToken(user, 200, 'Login successful',res );
});
/// refreshAccessToken controller
export const refreshAccessToken = asyncErrorHandler(async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return next(new ErrorHandler(401, "Session expired."));
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await userModel.findById(decoded.id);

        if (!user) return next(new ErrorHandler(404, "User not found."));

        const accessToken = user.generateAuthToken();

        res.status(200).json({
            success: true,
            accessToken,
            user, 
        });
    } catch (error) {
        return next(new ErrorHandler(401, "Invalid Token."));
    }
});

// 5. Logout 
export const logoutUser = asyncErrorHandler(async (req, res, next) => {
    res.status(200)
        .cookie('refreshToken', null, {
            expires: new Date(Date.now()),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
        })
        .json({
            success: true,
            message: 'Logout successful',
        });
});

export const resendOTP = asyncErrorHandler(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(new ErrorHandler(400, "Email is required."));
    }

    const user = await userModel.findOne({
        email,
        accountVerified: false,
    });

    if (!user) {
        return next(new ErrorHandler(404, "User not found or already verified."));
    }

    // Optional: Rate limiting (example: 1 minute gap)
    const now = Date.now();
    const lastSent = new Date(user.verificationCodeExpires).getTime() - (10 * 60 * 1000);

    if (now - lastSent < 60 * 1000) {
        return next(new ErrorHandler(429, "Please wait before requesting a new OTP."));
    }

    //  Generate new OTP
    const newOTP = Math.floor(100000 + Math.random() * 900000).toString();

    user.verificationCode = newOTP;
    user.verificationCodeExpires = Date.now() + 10 * 60 * 1000; // 10 min

    await user.save({ validateBeforeSave: false });

    //  Send email (your existing mail function)
    try {
        await sendVerificationCode(newOTP, user.email);

        res.status(200).json({
            success: true,
            message: "New OTP sent successfully."
        });

    } catch (error) {
        return next(new ErrorHandler(500, "Failed to send OTP email."));
    }

})
    export const getUser = asyncErrorHandler(async (req, res, next) => {
        const user = req.user;
        res.status(200).json({
            success: true,
            user,
        })

    })

    export const forgotPassword = asyncErrorHandler(async (req, res, next) => {

        const email = req.body?.email;

        if (!email) {
            return next(new ErrorHandler(400, "Email is required."));
        }

        const user = await userModel.findOne({
            email,
            accountVerified: true
        });

        if (!user) {
            return next(new ErrorHandler(404, "User not found."));
        }

        const resetPasswordToken = user.generateResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetPasswordToken}`;

        const message = generateForgetPasswordEmailTemplate(resetPasswordUrl);

        try {
            await sendEmail({
                email: user.email,
                subject: "Password Reset Request (SVPC Library)",
                message
            });

            res.status(200).json({
                success: true,
                message: `Email sent to ${user.email} successfully.`
            });

        } catch (error) {

            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            await user.save({ validateBeforeSave: false });

            return next(new ErrorHandler(500, "Failed to send email."));
        }

    });

    export const resetPassword = asyncErrorHandler(async (req, res, next) => {
        const { token } = req.params;

        const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');


        //// find user with the hashed token and check if token is not expired
        const user = await userModel.findOne({
            resetPasswordToken,
            resetPasswordExpires: { $gt: Date.now() },
        });
        if (!user) {
            return next(new ErrorHandler(400, 'Invalid or expired password reset token. '));

        }
        if (req.body.password !== req.body.confirmPassword) {
            return next(new ErrorHandler(400, 'Password and confirm password do not match. '));

        }
        if (req.body.password.length < 6 ||
            req.body.password.length > 16 ||
            req.body.confirmPassword.length < 6 ||
            req.body.confirmPassword.length > 16) {
            return next(new ErrorHandler(400, 'Password must be between 6 and 16 characters. '));
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save({ validateBeforeSave: false });
        sendToken(user, 200, 'Password reset successful', res);

    })

    export const updatePassword = asyncErrorHandler(async (req, res, next) => {

        const user = await userModel.findById(req.user._id).select('+password');

        const { currentPassword, newPassword, confirmNewPassword } = req.body;

        if (!currentPassword || !newPassword || !confirmNewPassword) {
            return next(new ErrorHandler(400, 'All fields are required. '));
        }
        const isCurrentPasswordMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordMatch) {
            return next(new ErrorHandler(400, 'Current password is incorrect. '));
        }
        if (newPassword !== confirmNewPassword) {
            return next(new ErrorHandler(400, 'New password and confirm new password do not match. '));
        }
        if (newPassword.length < 6 || newPassword.length > 16 || confirmNewPassword.length < 6 || confirmNewPassword.length > 16) {
            return next(new ErrorHandler(400, 'New password must be between 6 and 16 characters. '));
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save({ validateBeforeSave: true });
        sendToken(user, 200, 'Password updated successfully', res);
    })
