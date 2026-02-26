import dotenv from  'dotenv'
dotenv.config()
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import {errorMiddleware} from "./middlewares/errorMiddleware.js"
import authRouter from './routes/authRoutes.js';
import bookRouter from './routes/bookRoutes.js';
import issueRouter from './routes/issueRoutes.js';


const app = express();



app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "https://libraflow-one.vercel.app",
  credentials: true
}));

connectDB();

//  auth middleware for routes ///////////////
app.use('/api/auth', authRouter);

// book middleware for routes ///////////////
app.use('/api/books', bookRouter);
// borrow middleware for routes ///////////////
app.use('/api/issues', issueRouter);



// error middleware for handling errors //////////
app.use(errorMiddleware);


export default app;



