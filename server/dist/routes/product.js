"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../middleware");
const productController_1 = require("../controller/productController");
const product = express_1.default.Router();
product.post("/create-product", middleware_1.protect, productController_1.upload.single("image"), productController_1.createProduct);
product.get("/", middleware_1.protect, productController_1.getMyProducts);
product.delete("/:id", middleware_1.protect, productController_1.deleteProduct);
product.patch("/:id/publish", productController_1.publishProduct);
product.put("/:id/edit", middleware_1.protect, productController_1.upload.single("image"), productController_1.updateProduct);
exports.default = product;
