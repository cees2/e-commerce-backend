import express from "express";
import {
  getAllCategories,
  createCategory,
} from "../controllers/categoryController";

export const router = express.Router();

router.route("/").get(getAllCategories).post(createCategory);
