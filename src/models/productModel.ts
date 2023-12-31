import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product must have name"],
    unique: true,
    trim: true,
    minLength: 2,
  },
  thumbnail_image: {
    type: String,
    default: "default_product.jpg",
  },
  images: {
    type: [String, Buffer],
    default: "default_product.jpg",
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
  albumId: {
    type: String,
    unique: true,
    trim: true,
  },
});

export const Product = mongoose.model("Product", productSchema);
