import { userModel } from "../models/userModel.js";
import { asyncErrorHandler } from "./asyncErrorMiddleware.js";
import jwt from 'jsonwebtoken';


export const authMiddleware = asyncErrorHandler(async(req, res, next) => {

    const {token}=req.cookies;
    if (!token){
        return res.status(401).json({
            success: false,
            message: 'Unauthorized. Please login first.'
        })
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await userModel.findById(decoded.id)
    next();




})