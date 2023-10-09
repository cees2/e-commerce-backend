import { Product } from "../models/productModel";
import { AppError } from "../utils/AppError";
import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { Express } from "express";
import sharp from "sharp"

const multerStorage = multer.diskStorage({
  destination: (request, file, cb) => {
    cb(null, "public/img/products");
  },
  filename: (request, file, cb) => {
    const extension = file.mimetype.split("/")[1];
    cb(null, `product-${request.user.id}-${Date.now()}.${extension}`);
  },
});

const multerFilter = (
  request: Request,
  file: Express.Multer.File,
  cb: (error: any, info: boolean) => void
) => {
  if (file.mimetype.startsWith("image")) cb(null, true);
  else {
    const error = new AppError(
      "File is not an image. Please select correct file and upload again",
      400
    );
    cb(error, false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const resizeProductPhoto = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (!request.file) return next();

  sharp()
};

export const uploadProductPhoto = upload.single("image");

export const createProduct = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { name, description, price } = request.body;

    const product = await Product.create({
      name,
      image: request.file?.filename,
      description,
      price,
    });

    if (!product) return next(new AppError("Could not create product", 409));

    return response.status(201).json({
      message: "Success",
      data: {
        product,
      },
    });
  } catch (err: any) {
    next(new AppError(err?.message, 500));
  }
};

export const getProduct = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { productId } = request.params;

    const product = await Product.findOne({ id: productId });

    if (!product)
      return next(new AppError("Could not find product with given id", 404));

    return response.status(200).json({
      message: "Success",
      data: {
        product,
      },
    });
  } catch (err: any) {
    next(new AppError(err.message, 500));
  }
};

export const getAllProducts = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const products = await Product.find();

    return response.status(200).json({
      message: "Success",
      products: products.length,
      data: {
        products,
      },
    });
  } catch (err: any) {
    next(new AppError(err.message, 500));
  }
};
