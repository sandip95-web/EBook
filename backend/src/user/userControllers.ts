import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import bcrypt from "bcryptjs";
import userModel from "./userModel";

import { config } from "../config/config";
import { sign } from "jsonwebtoken";

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

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await userModel.create({
    name,
    email,
    password: hashedPassword,
  });
  const token = sign({ sub: newUser._id }, config.secret as string, {
    expiresIn: config.expire,
  });

  res.status(201).json({
    accessToken: token,
  });
};

export { registerUser };
