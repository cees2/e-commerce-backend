import express from "express";
import {
  signup,
  login,
  protect,
  getMe,
} from "../controllers/user/authController";
import { getUser } from "../controllers/user/userController";

export const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/me").get(protect, getMe, getUser);

router.use(protect);
router.route("/:userId").get(getUser);
// .delete(restrictTo("admin"), deleteUser);
