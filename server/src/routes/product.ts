import express from "express";
import { protect } from "../middleware";
import { createProduct, deleteProduct, getMyProducts, publishProduct, updateProduct, upload } from "../controller/productController";


const product = express.Router();


product.post("/create-product", protect, upload.single("image"), createProduct);
product.get("/", protect, getMyProducts);
product.delete("/:id", protect, deleteProduct);
product.patch("/:id/publish", publishProduct);
product.put("/:id/edit", updateProduct);

export default product;
