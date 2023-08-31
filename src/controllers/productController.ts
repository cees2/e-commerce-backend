import { Product } from "../models/ProductModel";

export const createProduct = async (request, response) => {
  const { name, image, description, price } = request.body;

  const product = await Product.create({ name, image, description, price });

  return response.status(201).json({
    message: "Success",
    product,
  });
};

export const getAllProducts = (request, response) => {
  console.log("EXEC");
  response.status(200).send("DDD");
};
