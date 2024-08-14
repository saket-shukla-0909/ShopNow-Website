



export default (err, req, res, next)=>{
    let error = {
        statusCode: err?.statusCode || 500,
        message: err?.message  || "Internal Server Found",   
    };

//  Handle Invalid Mongoose ID Error
    if(err.name === 'CastError'){
        const message = `Resource not found. Invalid: ${err?.path}`
        err = new ErrorHandler(message , 404);
    }
    
//  Handle Validation Error
    if(err.name === 'ValidationError'){
        const message = Object.values(err.errors).map((value.message))
        err = new ErrorHandler(message , 400);
    }

//  Handle Mongoose Duplicate Key Error
    if(err.name === '11000'){
        const message = `Duplicate: ${Object.keys(err.keyValue)} entered.`
        err = new ErrorHandler(message , 400);
    }

// Handle Wrong JWT Error
    if(err.name === 'TokenExpiredError'){
        const message = `JSON Web Token is expired. Try Again!!!`;
        err = new ErrorHandler(message , 400);
    }

//  Handle expired JWT  Error
    if(err.name === 'CastError'){
        const message = `Resource not found. Invalid: ${err?.path}`
        err = new ErrorHandler(message , 404);
    }
    if(process.env.NODE_ENV === 'DEVELOPMENT'){
        res.status(error.statusCode).json({
            message: error.message,
            error: err,
            stack: err?.stack,
        })
    }
    if(process.env.NODE_ENV === 'PRODUCTION'){
        res.status(error.statusCode).json({
            message: error.message,
        })
    }
    
};
