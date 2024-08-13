// import { jwt } from "jsonwebtoken";
import pkg from 'jsonwebtoken';
const { jwt } = pkg;
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "./catchAsyncErrors.js";
import User from '../models/user.js';



// Checks if user is authenticated or not
export const isAuthenticatedUser = catchAsyncErrors(async (res, req, next)=>{
    const { token } = req.cookies;
    if(!token){
        return next(new ErrorHandler("Login first to access this resource", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.user = await User.findById(decoded.id)
    next();
})

// Authorize user roles
export const authorizeRoles = (...roles)=>{
    return (req, res, next)=>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`Role (${req.user.role}) is not allowed to acces this resource`, 403));
        }
        next();
    };
};