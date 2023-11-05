import express from "express";
import {
  getAllProducts,
  getProduct,
  createProduct,
  resizeProductPhotos,
} from "../controllers/productController";
import { protect } from "../controllers/user/authController";
import { uploadProductPhoto } from "../controllers/productController";

export const router = express.Router();

router
  .route("/")
  .get(getAllProducts)
  .post(protect, uploadProductPhoto, resizeProductPhotos, createProduct);

router.route("/:productId").get(getProduct);
