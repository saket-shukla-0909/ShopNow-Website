import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import User from "../models/user.js";


export const registerUser = catchAsyncErrors(async (res, req, next)=>{
    const {name, email, password} = req.body;

    const user =  await User.create({
        name, email, password
    });

    res.status(201).json({success: true, });
});