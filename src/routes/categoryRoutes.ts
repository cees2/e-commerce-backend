import express from "express";
import { getAllCategories } from "../controllers/categoryController";

export const router = express.Router();

router.route("/").get(getAllCategories);
