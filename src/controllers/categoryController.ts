import { Category } from "../models/categoryModel";

export const getAllCategories = async (request, response) => {
  try {
    const categories = await Category.find();

    response.status(200).json({
      status: "success",
      data: {
        categories,
      },
    });
  } catch (err) {
    console.log(err);
  }

  response.status(200).send("DSS");
};

export const createCategory = async (request, response) => {
  try {
    const newCategory = await Category.create(request.body);

    response.status(201).json({
      status: "success",
      data: {
        category: newCategory,
      },
    });
  } catch (err) {
    console.log(err);
  }
};
