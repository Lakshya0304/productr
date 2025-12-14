import express from "express";
import { createUser, requestOtp, verifyOtp } from "../controller/authController";

const auth = express.Router();

auth.post("/signup" , createUser);
auth.post("/login", requestOtp); 
auth.post("/verify-otp", verifyOtp); 

export default auth;
