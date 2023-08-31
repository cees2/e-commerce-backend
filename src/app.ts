import express from "express";
import morgan from "morgan";
import { router as productRouter } from "./routes/productRoutes";
import { app } from "../server";

app.use(express.json());

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use("/ajax/products", productRouter);
