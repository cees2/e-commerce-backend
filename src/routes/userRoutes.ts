import express from "express";
import { signup, login } from "../controllers/user/authController";
import { getUser } from "../controllers/user/userController";

export const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);

router.route("/:userId").get(getUser);
