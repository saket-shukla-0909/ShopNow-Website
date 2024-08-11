import express from "express";
const app = express();
import  dotenv  from "dotenv";
import { connectDatabase } from "./config/dbConnect.js";
dotenv.config({ path: "backend/config/config.env"});

// Connecting to Database
    connectDatabase();

// Import all routes
import productRoutes from './routes/products.js';
app.use("/api/v1", productRoutes);

app.listen(process.env.PORT, ()=>{
    console.log(`Server has started at PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
});