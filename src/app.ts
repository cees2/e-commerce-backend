import express from "express";
import morgan from "morgan";
import { router as categoryRouter } from "./routes/categoryRoutes";
import { router as productRouter } from "./routes/categoryRoutes";
import { app } from "../server";

app.use(express.json());

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use("/ajax/categories", categoryRouter);
app.use("/ajax/products", productRouter);
