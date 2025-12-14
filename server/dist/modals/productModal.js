"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
});
exports.Product = mongoose_1.default.model("Product", productSchema);
