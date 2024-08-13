import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import User from "../models/user.js";
import sendToken from "../utils/sendToken.js";

// Register user => /api/v1/registers
export const registerUser = catchAsyncErrors(async (res, req, next)=>{
    const {name, email, password} = req.body;

    const user =  await User.create({
        name, email, password
    });

    sendToken(user, 201, res)
});

// Login user => /api/v1/registers

export const loginUser = catchAsyncErrors(async (res, req, next)=>{
    const {email, password} = req.body;

    if(!email || !password){
        return next(new ErrorHandler('Please enter email & password'))
    }

    // Find user in the database
    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler('Invalid email or password', 401));
    }

    // Check if password is correct
    const isPasswordMatched = await user.comparePassword(password)
    
    if(!isPasswordMatched){
        return next(new ErrorHandler('Invalid email or password', 401));
    }

    sendToken(user, 201, res)
});

// Login user => /api/v1/registers
export const logoutUser = catchAsyncErrors(async (res, req, next)=>{
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });
    res.status(200).json({
        message: "Logged Out"
    })
})