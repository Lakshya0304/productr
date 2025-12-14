import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
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

export const User = mongoose.model("User", userSchema);
