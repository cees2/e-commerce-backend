import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

process.on("unchaughtException", (err: Record<string, unknown>) => {
  console.log("Uncaught exception");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: `./config.env` });

export const app = express();

const DB = process.env.DATABASE?.replace(
  "<password>",
  process.env.DATABASE_PASSWORD as string
);

const port = process.env.PORT || 3001;

mongoose.connect(DB || "").then(() => {
  console.log(`Successfully connected to DB`);
});

const server = app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

process.on("unhandledRejection", (err: Record<string, unknown>) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
