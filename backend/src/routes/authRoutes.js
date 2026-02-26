import express from 'express';
import {
    forgotPassword,
    getUser, loginUser,
    logoutUser,
    registerUser,
    resetPassword,
    updatePassword,
    verifyOTP,
    resendOTP
} from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';




const router = express.Router();

/// auth routes//////////////////////////

router.post('/register', registerUser);
router.post('/verify-otp', verifyOTP);
router.post("/resend-otp", resendOTP);
//////

router.post('/login', loginUser);
router.post('/logout', authMiddleware, logoutUser);
router.get('/me', authMiddleware, getUser);
router.post('/forgot/password', forgotPassword);
router.put('/reset/password/:token', resetPassword)
router.put('/password/update',authMiddleware, updatePassword)



export default router;