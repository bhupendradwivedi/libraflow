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
import adminRouter  from './routes/adminRoutes.js'


const app = express();



app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


import cors from 'cors';

const allowedOrigins = [
  'http://localhost:5173',               
  'https://libraflow-one.vercel.app'     
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // Cookies aur Auth headers ke liye zaroori hai
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

connectDB();

//  auth middleware for routes ///////////////
app.use('/api/auth', authRouter);

// book middleware for routes ///////////////
app.use('/api/books', bookRouter);
// borrow middleware for routes ///////////////
app.use('/api/issues', issueRouter);
///
app.use('/api/provide',adminRouter)



// error middleware for handling errors //////////
app.use(errorMiddleware);


export default app;



