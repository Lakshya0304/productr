"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controller/authController");
const auth = express_1.default.Router();
auth.post("/signup", authController_1.createUser);
auth.post("/login", authController_1.requestOtp);
auth.post("/verify-otp", authController_1.verifyOtp);
exports.default = auth;
