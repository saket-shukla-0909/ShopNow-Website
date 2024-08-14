import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import User from "../models/user.js";
import sendToken from "../utils/sendToken.js";
import { getResetPasswordTemplate } from "../utils/emailTemplate.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
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

// Logout user => /api/v1/registers
export const logoutUser = catchAsyncErrors(async (res, req, next)=>{
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });
    res.status(200).json({
        message: "Logged Out"
    })
})

// Forget Password => /api/v1/forgot

export const forgotPassword = catchAsyncErrors(async (res, req, next)=>{

    // Find user in the database
    const user = await User.findOne({email: req.body.email});
    if(!user){
        return next(new ErrorHandler('User not found with this email', 404));
    }

    // Get reset password token
    const resetToken = user.getResetPasswordToken()

    // Createv reset password url
    const resetUrl = `{process.env.FRONTEND_URL}/api/v/password/reset/${resetToken}`
    
    const message = getResetPasswordTemplate(user?.name, resetUrl)
    
    try{ 
        await sendEmail({
            email: user.email,
            subject: 'ShopNow Password Recovery',
            message,
        });
        res.status(200).json({
            message: `Email sent to: ${user.email}`,
        });
    }catch(error){
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined

        await user.save()
        return next(new ErrorHandler(error?.message, 500));
    }
    sendToken(user, 201, res)
});
// Reset Password => /api/v1/reset/ :token

export const resetPassword = catchAsyncErrors(async (res, req, next)=>{
    // Hash the URL Token
    this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex"); 

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt : Date.now()}
    })

    if(!user){
        return next(new ErrorHandler(
            "Password reset token is invalid or has been expired", 
            400
        )
    );
    }
    if(req.body.password  !== req.body.confirmPassword){
        return next(
            new ErrorHandler("Password does not match", 400));
    }

    // Set the new password
    user.password = req.body.password;

    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save();

    sendToken(user, 200, res);

})