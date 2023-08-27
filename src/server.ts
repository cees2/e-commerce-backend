import express from "express";
import dotenv from "dotenv";

dotenv.config({ path: `${__dirname}../config.env` });
export const app = express();

const port = process.env.PORT || 3000;

console.log(process.env.NODE_ENV);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
