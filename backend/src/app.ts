import express, { NextFunction, Request, Response } from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./user/userRoutes";

const app = express();
app.use(express.json());
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "Welcome to The Books API/v1",
  });
});

app.use("/api/users", userRouter);

//Global Error Handler
app.use(globalErrorHandler);

export default app;
