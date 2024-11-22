import express from 'express';
import { registerUser } from './userControllers';

const userRouter=express.Router();

userRouter.post('/register',registerUser)


export default userRouter;