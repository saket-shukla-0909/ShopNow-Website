import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Order from "../models/order.js";
import ErrorHandler from "../utils/errorHandler.js";
import Product from "../models/products.js";
import order from "../models/order.js";

//  Create new Order => /api/v1/orders/new
export const newOrder = catchAsyncErrors( async(req, res, next)=>{
    const { orderItems, shippingInfo, itemsPrice, taxAmount, shippingAmount, totalAmount, paymentMethod, paymentInfo} = req.body
    const order = await order.create({orderItems, shippingInfo, itemsPrice, taxAmount, shippingAmount, totalAmount, paymentMethod, paymentInfo, user: req.user._id, });

    res.status(200).json({order});
})

// Get order details => /api/v1/orders/:id
export const getOrderDetails = catchAsyncErrors( async(req, res, next)=>{
    const order = await Order.findById(req.params._id).populate("user", "name email");

    if(!order){
        return next(new ErrorHandler('No Order found with this ID', 404));
    }

    res.status(200).json({order,});
});


// Get Current user orders => /api/v1/me/orders
export const myOrders = catchAsyncErrors( async(req, res, next)=>{
    const order = await Order.find({ user: req.params._id });

    if(!order){
        return next(new ErrorHandler('No Order found with this ID', 400));
    }

    res.status(200).json({orders,});
});


// Get all orders - ADMIN => api/v1/admin/orders
    export const allOrders = catchAsyncErrors( async(req, res , next)=>{
        const orders = await Order.find({user: req.user._id});
        res.status(200).json({orders, });    
    })


// Get Update orders - ADMIN => api/v1/admin/orders
    export const updateOrder = catchAsyncErrors( async(req, res , next)=>{
        const orders = await Order.findById ({user: req.user._id});
        res.status(200).json({orders, });    

        if(!order){
            return next(new ErrorHandler("No order found with this ID", 404));
        }
        if(order?.orderStatus === "Delivered"){
            return next(new ErrorHandler("You have already delivered this order", 404))
        }
        
        // Update products stock
        order?.orderItems?.forEach( async(item)=>{
            const product = await Product.findById(item?.product?.toString())
            if(!product){
                return next(new ErrorHandler("No Product found with this ID", 404))
            }
            product.stock = product.stock - item.quantity;
            await product.save({ validateBeforeSave: false });
        })
        order.orderStatus = req.body.status;
        order.deliveredAt = Date.now();
         res.status(200).json({orders, });
    });

// Delete order  => /api/v1/orders/:id
    export const deleteOrder = catchAsyncErrors( async(req, res, next)=>{
        const order = await Order.findById(req.params._id)

        if(!order){
            return next(new ErrorHandler('No Order found with this ID', 404));
        }

        await order.deleteOne()
        res.status(200).json({success: true,});
    });

