import { NextFunction, Request, Response } from "express";

const registerUser=async(req:Request,res:Response,next:NextFunction)=>{

  res.status(200).json({
    success:true,
    message:"User Created"
  })
}

export {registerUser}