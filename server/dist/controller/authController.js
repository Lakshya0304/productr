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
exports.verifyOtp = exports.requestOtp = exports.createUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModal_1 = require("../modals/userModal");
const otpModal_1 = require("../modals/otpModal");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, phoneNumber, password } = req.body;
        if (!username || !email || !phoneNumber || !password) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }
        const existingUser = yield userModal_1.User.findOne({
            $or: [{ email }, { phoneNumber }],
        });
        if (existingUser) {
            return res.status(409).json({
                message: "User already exists with given email/username/phone number",
            });
        }
        const user = yield userModal_1.User.create({
            username,
            email,
            phoneNumber,
            password,
        });
        const userResponse = {
            id: user._id,
            username: user.username,
            email: user.email,
            phoneNumber: user.phoneNumber,
            password: user.password,
        };
        return res.status(201).json({
            message: "User created successfully",
            user: userResponse,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error",
        });
    }
});
exports.createUser = createUser;
const requestOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, phoneNumber } = req.body;
        console.log("🚀 ~ requestOtp ~ email:", email);
        const user = yield userModal_1.User.findOne({
            $or: [{ email },
                { phoneNumber }
            ],
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        yield otpModal_1.Otp.create({
            userId: user._id,
            otp,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
        });
        console.log("OTP:", otp);
        return res.json({ message: "OTP sent successfully" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
});
exports.requestOtp = requestOtp;
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp } = req.body;
        console.log("🚀 ~ verifyOtp ~ otp:", otp);
        console.log("🚀 ~ verifyOtp ~ email:", email);
        const user = yield userModal_1.User.findOne({
            $or: [{ email }],
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const otpRecord = yield otpModal_1.Otp.findOne({
            userId: user._id,
            otp,
            expiresAt: { $gt: new Date() },
        });
        if (!otpRecord) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }
        yield otpModal_1.Otp.deleteMany({ userId: user._id });
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        return res.json({
            message: "Login successful",
            token,
            redirect: "/",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
});
exports.verifyOtp = verifyOtp;
