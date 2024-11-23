import express, { NextFunction, Request, Response } from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./user/userRoutes";
import bookRouter from "./book/bookRoute";
import cors from 'cors'
import { config } from "./config/config";
const app = express();
app.use(cors({
  origin:config.domain
}))
app.use(express.json());
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "Welcome to The Books API/v1",
  });
});

app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);

//Global Error Handler
app.use(globalErrorHandler);

export default app;
