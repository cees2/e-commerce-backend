import express from "express";
import {
  getAllProducts,
  createProduct,
} from "../controllers/productController";
import { protect } from "../controllers/user/authController";

export const router = express.Router();

router.route("/").get(getAllProducts).post(protect, createProduct);
