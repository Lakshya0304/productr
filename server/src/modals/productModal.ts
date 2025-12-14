import mongoose from "mongoose";
import { required } from "zod/mini";

const productSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  name: {
    type: String,
    required: true,
    trim: true,
  },

  type: {
    type: String,
    required: true,
    enum: ["food", "electronics", "clothing", "beauty products", "others"],
  },

  stock: {
    type: Number,
    required: true,
    min: 0,
  },

  mrp: {
    type: Number,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  brand: {
    type: String,
    required: true,
    trim: true,
  },

  exchange: {
    type: String,
    enum: ["yes", "no"],
    required: true,
  },

  image: {
    type: String,
    required: true,
  },

  isPublished: {
    type: Boolean,
    default: false, 
  },
});

export const Product = mongoose.model("Product", productSchema);
