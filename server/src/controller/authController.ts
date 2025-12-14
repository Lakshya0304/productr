import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../modals/userModal";
import { Otp } from "../modals/otpModal";


export const createUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { username, email, phoneNumber, password } = req.body;

    if (!username || !email || !phoneNumber || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email },{ phoneNumber }],
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists with given email/username/phone number",
      });
    }

    const user = await User.create({
      username,
      email,
      phoneNumber,
      password ,
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
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};


export const requestOtp = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const {email, phoneNumber} = req.body;
    console.log("🚀 ~ requestOtp ~ email:", email)
    
    const user = await User.findOne({
        $or: [{ email } 
        , { phoneNumber }
    ],
    }); 


    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp: string = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.create({
      userId: user._id,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    });

    console.log("OTP:", otp);

    return res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const verifyOtp = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, otp } = req.body;
    console.log("🚀 ~ verifyOtp ~ otp:", otp)
    console.log("🚀 ~ verifyOtp ~ email:", email)

    const user = await User.findOne({
      $or: [{ email}],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otpRecord = await Otp.findOne({
      userId: user._id,
      otp,
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await Otp.deleteMany({ userId: user._id });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login successful",
      token,
      redirect: "/",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
