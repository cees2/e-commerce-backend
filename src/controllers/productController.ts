import { Product } from "../models/ProductModel";

export const createProduct = async (request, response) => {
  const { name, image, description, price } = request.body;

  const product = await Product.create({ name, image, description, price });

  return response.status(201).json({
    message: "Success",
    product,
  });
};

export const getAllProducts = async (request, response) => {
  const products = await Product.find();

  return response.status(200).json({
    message: "Success",
    products: products.length,
    data: {
      products,
    },
  });
};
