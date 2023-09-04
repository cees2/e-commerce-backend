import express from "express";
import { signup } from "../controllers/user/authController";

export const router = express.Router();

router.route("/signup").post(signup);
