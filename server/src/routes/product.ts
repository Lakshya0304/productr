import express from "express";
import { protect } from "../middleware";
import { createProduct, deleteProduct, getAllProducts, getMyProducts, getPublishedProducts, publishProduct, updateProduct, upload } from "../controller/productController";


const product = express.Router();


product.post("/create-product", protect, upload.single("image"), createProduct);
product.get("/all", getAllProducts);
product.get("/published", getPublishedProducts);
product.get("/", protect, getMyProducts);
product.delete("/:id", protect, deleteProduct);
product.patch("/:id/publish", protect, publishProduct);
product.put("/:id/edit", protect, upload.single("image"), updateProduct);

export default product;
