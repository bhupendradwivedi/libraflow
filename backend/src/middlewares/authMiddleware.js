import { userModel } from "../models/userModel.js";
import { asyncErrorHandler } from "./asyncErrorMiddleware.js";
import jwt from 'jsonwebtoken';
import ErrorHandler from "./errorMiddleware.js"; // ErrorHandler import zaroori hai

export const authMiddleware = asyncErrorHandler(async (req, res, next) => {
    let token;

    // header check first
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    } 
    // if not founnd tenn cookies
    else if (req.cookies.token) {
        token = req.cookies.token;
    }

    // if notfount anywhere 
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'User not authenticated. Please login first.'
        });
    }

    try {
        // Token verify 
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
    
        req.user = await userModel.findById(decoded.id);

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not found.'
            });
        }

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token.'
        });
    }
});