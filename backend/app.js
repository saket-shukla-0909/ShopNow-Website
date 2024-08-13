import express from "express";
import cookieParser from "cookie-parser";
const app = express();
import  dotenv  from "dotenv";
import { connectDatabase } from "./config/dbConnect.js";
import errorMiddleware from "./middlewares/errors.js";

// Handle Uncaught exception
process.on('uncaughtException', (err)=>{
    console.log(`Error: ${err}`);
    console.log('Shutting down due to uncaught exception');
    process.exit(1);
})
dotenv.config({ path: "backend/config/config.env"});

// Connecting to Database
    connectDatabase();
    app.use(express.json());
    app.use(cookieParser())

// Import all routes
import productRoutes from './routes/products.js';
import authRoutes from './routes/auth.js';
app.use("/api/v1", productRoutes);
app.use("/api/v1", authRoutes);

// Using Middleware
app.use(errorMiddleware);

const server = app.listen(process.env.PORT, ()=>{
    console.log(`Server has started at PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
});


// Handle unhandled Promise rejections
process.on('unhandledRejection', (err)=>{
    console.log(`Error: ${err}`);
    console.log("Shutting down server due to Unhandled Promise Rejection");
    server.close(()=>{
        process.exit(1);
    })
})