import express from "express";

export const router = express.Router();

router.get("/", (request, response) => {
  response.status(200).send("DDD");
});
