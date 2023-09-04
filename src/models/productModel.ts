import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product must have name"],
    unique: true,
    trim: true,
    minLength: 2,
  },
  image: {
    type: String,
    required: [true, "Product must have image"],
  },
  description: {
    type: String,
    required: [true, "Product must have description"],
  },
  price: {
    type: Number,
    required: [true, "Product must have price"],
    min: 0,
  },
});

export const Product = mongoose.model("Product", productSchema);
