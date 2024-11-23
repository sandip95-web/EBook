import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import bcrypt from "bcryptjs";
import userModel from "./userModel";

import { config } from "../config/config";
import { sign } from "jsonwebtoken";
import { User } from "./userTypes";

const generateToken = async (user: User, res: Response, next: NextFunction) => {
  try {
    const token = sign({ sub: user._id }, config.secret as string, {
      expiresIn: config.expire,
    });
    res.status(201).json({
      accessToken: token,
    });
  } catch (error) {
    return next(createHttpError(500, "Error while signing token"));
  }
};

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
  generateToken(newUser, res, next);
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const checkUserExist = await userModel.findOne({ email });
    if (!checkUserExist) {
      return next(createHttpError(400, "User with that email doesn't exist."));
    }
    const checkPasssword = await bcrypt.compare(
      password,
      checkUserExist.password
    );
    if (!checkPasssword) {
      return next(createHttpError(400, "Email or Password is incorrect."));
    }
    generateToken(checkUserExist, res, next);
  } catch (error) {
    return next(createHttpError(500, "Error while getting user."));
  }
};

export { registerUser,loginUser };
