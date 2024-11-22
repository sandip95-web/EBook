import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import bcrypt from 'bcryptjs'
import userModel from "./userModel";

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }

  const user = await userModel.findOne({ email });
  if (user) {
    const error = createHttpError(400, "User with that email already exist.");
    return next(error);
  }
  
  const hashedPassword=await bcrypt.hash(password,10);
  res.status(200).json({
    success: true,
    message: "User Created",
  });
};

export { registerUser };
