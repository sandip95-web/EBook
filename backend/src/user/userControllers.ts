import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import bcrypt from "bcryptjs";
import userModel from "./userModel";

import { config } from "../config/config";
import { sign } from "jsonwebtoken";
import { User } from "./userTypes";

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

  try {
    const user = await userModel.findOne({ email });
    if (user) {
      const error = createHttpError(400, "User with that email already exist.");
      return next(error);
    }
  } catch (error) {
    return next(createHttpError(500, "Error while getting User."));
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  let newUser: User;
  try {
    newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });
  } catch (error) {
    return next(createHttpError(500, "Error while creating user."));
  }
  try {
    const token = sign({ sub: newUser._id }, config.secret as string, {
      expiresIn: config.expire,
    });
    res.status(201).json({
      accessToken: token,
    });
  } catch (error) {
    return next(createHttpError(500, "Error while signing token"));
  }
};

export { registerUser };
