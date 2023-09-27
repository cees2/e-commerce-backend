import express from "express";
import morgan from "morgan";
import { router as productRouter } from "./routes/productRoutes";
import { router as userRouter } from "./routes/userRoutes";
import { app } from "../server";
import { AppError } from "./utils/AppError";
import { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./controllers/globalErrorHandler";

app.use(cors());
app.use(cookieParser());
app.use(express.json());

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use("/ajax/products", productRouter);
app.use("/ajax/users", userRouter);

app.all("*", (request: Request, response: Response, next: NextFunction) => {
  next(new AppError(`Cannot find ${request.originalUrl} on this server`, 404));
});

// @ts-ignore
app.use(globalErrorHandler);
