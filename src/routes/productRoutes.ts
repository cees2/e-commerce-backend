import express from "express";
import {
  getAllProducts,
  createProduct,
} from "../controllers/productController";

export const router = express.Router();

router.route("/").get(getAllProducts).post(createProduct);
