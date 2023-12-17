import { Product } from "../../models/productModel";
import { AppError } from "../../utils/AppError";
import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { Express } from "express";
import sharp from "sharp";
import fsPromises from "fs/promises";
import path from "path";
import {
  createGoogleApiAlbum,
  createMultimedia,
  getMultimediaToken,
} from "./api/api";

const multerStorage = multer.memoryStorage();

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

export const resizeProductPhotos = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { files } = request as Record<string, any>;
    if (files.images?.length === 0) return next();

    const productThumbnailImageFilename = `product-${
      request.user.id
    }-${Date.now()}-thumbnail.jpeg`;

    await sharp(files?.images[0].buffer)
      .resize(1200, 800)
      .toFormat("jpeg")
      .jpeg({ quality: 90 });

    request.body.thumbnailPicture = productThumbnailImageFilename;

    request.body.images = [];

    const imagePromises = files?.images.map(
      async (file: Record<string, any>, index: number) => {
        const filename = `product-${request.user.id}-${Date.now()}-${
          index + 1
        }.jpeg`;

        try {
          await sharp(file.buffer)
            .resize(1200, 800)
            .toFormat("jpeg")
            .jpeg({ quality: 90 });

          request.body.images.push(filename);
        } catch (err: any) {
          next(new AppError("Server internal error", 500));
        }
      }
    );

    await Promise.all(imagePromises);
  } catch (err: any) {
    next(new AppError(err.message || "Server internal error", 500));
  }

  next();
};

export const assignImagesToRequests = upload.fields([
  {
    name: "images",
    maxCount: 7,
  },
]);

export const createProduct = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { name, description, price } = request.body;

    const product = await Product.create({
      name,
      images: request.body.images,
      thumbnail_image: request.body.thumbnailPicture,
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

export const uploadImages = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { name } = request.body;
  const { files } = request as Record<string, any>;

  try {
    const createdNewAlbum = await createGoogleApiAlbum(name);
    const {
      data: { id: albumId },
    } = createdNewAlbum;
    const { data: multimediaToken } = await getMultimediaToken(files.images);
    const a = await createMultimedia(multimediaToken, albumId);
    console.log("A", a.data.newMediaItemResults);
  } catch (err: any) {
    console.log("pelen error:", err.response.data.error);
    next(new AppError(err.message, 500));
  }

  next();
};

export const getProduct = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { productId } = request.params;

    const product = await Product.findById(productId);

    if (!product)
      return next(new AppError("Could not find product with given id", 404));

    const pathname = path.resolve(__dirname, "../../public/img/products");

    const productImagesPromises = product.images.map((imageName) => {
      return fsPromises.readFile(`${pathname}/${imageName}`);
    });

    const productImages = await Promise.all(productImagesPromises);

    const responseBody = {
      data: { ...product },
      file: {
        mimeType: "image/jpeg",
        data: productImages,
      },
    };

    response.setHeader("Content-Type", "image/jpeg");

    return response.status(200).end({
      message: "Success",
      data: responseBody,
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
