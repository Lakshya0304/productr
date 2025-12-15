"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishProduct = exports.updateProduct = exports.deleteProduct = exports.getMyProducts = exports.createProduct = exports.upload = void 0;
const productModal_1 = require("../modals/productModal");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/Images");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path_1.default.extname(file.originalname);
        cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    },
});
exports.upload = (0, multer_1.default)({ storage: storage });
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        console.log("req.file:", req.file);
        console.log("req.body:", req.body);
        console.log("Inside createProduct");
        const { name, type, stock, mrp, price, brand, exchange } = req.body;
        const image = (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename;
        const product = yield productModal_1.Product.create({
            userId: req.user.id,
            name,
            type,
            stock,
            mrp,
            price,
            brand,
            exchange,
            image,
        });
        console.log("CREATED PRODUCT:", product);
        res.status(201).json({
            message: "Product created successfully",
            product,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.createProduct = createProduct;
const getMyProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield productModal_1.Product.find({
            userId: req.user.id,
        });
        res.json({
            count: products.length,
            products,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getMyProducts = getMyProducts;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield productModal_1.Product.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id,
        });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json({ message: "Product deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deleteProduct = deleteProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const product = yield productModal_1.Product.findOneAndUpdate({ _id: id, userId: req.user.id }, { $set: updateData }, { new: true });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json({ message: "Product updated successfully", product });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.updateProduct = updateProduct;
const publishProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield productModal_1.Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        product.isPublished = !product.isPublished;
        yield product.save();
        res.status(200).json({
            message: product.isPublished
                ? "Product published"
                : "Product unpublished",
            product,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
exports.publishProduct = publishProduct;
