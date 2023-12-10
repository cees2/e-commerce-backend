import express from "express";
import {
  getAllProducts,
  getProduct,
  createProduct,
  resizeProductPhotos,
  uploadImages,
} from "../controllers/product/productController";
import { protect } from "../controllers/user/authController";
import { assignImagesToRequests } from "../controllers/product/productController";

export const router = express.Router();

router
  .route("/")
  .get(getAllProducts)
  .post(
    protect,
    assignImagesToRequests,
    resizeProductPhotos,
    uploadImages,
    createProduct
  );

router.route("/:productId").get(getProduct);
