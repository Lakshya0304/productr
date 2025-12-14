"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        match: [/^[6-9]\d{9}$/, "Please enter a valid 10-digit phone number"],
    },
    password: {
        type: String,
        required: [true, "Password should be 8 characters long"],
        minlength: 8,
    },
});
exports.User = mongoose_1.default.model("User", userSchema);
