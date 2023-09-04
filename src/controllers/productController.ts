import { Product } from "../models/productModel";
import { AppError } from "../utls/AppError";

export const createProduct = async (request, response, next) => {
  try {
    const { name, image, description, price } = request.body;

    const product = await Product.create({ name, image, description, price });

    if (!product) return next(new AppError("Could not create product", 409));

    return response.status(201).json({
      message: "Success",
      data: {
        product,
      },
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

export const getProduct = async (request, response, next) => {
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
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

export const getAllProducts = async (request, response, next) => {
  try {
    const products = await Product.find();

    return response.status(200).json({
      message: "Success",
      products: products.length,
      data: {
        products,
      },
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};
