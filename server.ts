import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: `./config.env` });

export const app = express();

const DB = process.env.DATABASE?.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

const port = process.env.PORT || 3001;

mongoose.connect(DB).then(() => {
  console.log(`Successfully connected to DB`);
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
