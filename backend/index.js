import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/UserRoute.js";
import authRouter from "./routes/AuthRoute.js";
import cookieParser from "cookie-parser";
import listingRouter from "./routes/ListingRoute.js";

dotenv.config();

mongoose
    .connect(process.env.MONGO)
    .then(() => {
        console.log('Database Connected');
    })
    .catch((err) => {
        console.log(err);
    });

const app = express();

app.use(express.json());

app.use(cookieParser());

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error'

    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});