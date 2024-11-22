import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

const registerUser=async(req:Request,res:Response,next:NextFunction)=>{
  const {name,email,password}=req.body;

  if(!name || !email || !password){
    const error=createHttpError(400,"All fields are required");
    return next(error)
  }
  res.status(200).json({
    success:true,
    message:"User Created"
  })
}

export {registerUser}