import express, { NextFunction, Request, Response } from 'express';
import globalErrorHandler from './middlewares/globalErrorHandler';
import createHttpError from 'http-errors';


const app=express();

app.get("/",(req:Request,res:Response,next:NextFunction)=>{
  
  res.status(200).json({
    success:true,
    message:"Welcome to The Books API/v1"
  })
})

//Global Error Handler
app.use(globalErrorHandler);

export default app;