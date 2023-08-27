import { Category } from "../models/categoryModel";

export const getAllCategories = (request, response) => {
  console.log("execcccc");
  response.status(200).send("DSS");
};

export const createCategory = async (request, response) => {
  const { body } = request;
  console.log("Create category1");

  const testCategory = new Category({
    name: "Test",
  });

  const doc = await testCategory.save();

  response.status(200).send(doc);
};
