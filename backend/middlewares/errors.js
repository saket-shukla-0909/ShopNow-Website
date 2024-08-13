



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
