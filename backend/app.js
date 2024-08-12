import express from "express";
const app = express();
import  dotenv  from "dotenv";
import { connectDatabase } from "./config/dbConnect.js";
import errorMiddleware from "./middlewares/errors.js";

dotenv.config({ path: "backend/config/config.env"});

// Connecting to Database
    connectDatabase();
    app.use(express.json());
// Import all routes
import productRoutes from './routes/products.js';
app.use("/api/v1", productRoutes);

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