"use client";

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import pic1 from "@/assets/pic1.svg";
import { BACKEND_URL } from "@/config";

const Otp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const identifier = location.state?.identifier;

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);

  if (!identifier) {
    navigate("/login");
    return null;
  }

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify = async () => {
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      alert("Please enter 6-digit OTP");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${BACKEND_URL}/auth/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            identifier.includes("@")
              ? { email: identifier, otp: otpValue }
              : { phoneNumber: identifier, otp: otpValue }
          ),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Invalid OTP");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);

      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Section */}
      <div className="hidden md:flex w-1/2 items-center justify-center relative rounded-r-3xl">
        <div className="absolute top-6 left-6 font-bold text-indigo-700 text-xl">
          Productr<span className="text-orange-500">.</span>
        </div>

        <div className="relative">
          <img
            src={pic1}
            alt="OTP Illustration"
            className="max-w-sm drop-shadow-2xl rounded-3xl"
          />
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white font-medium text-sm">
            Uplist your product to market
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <Card className="w-full max-w-md border-none shadow-none">
          <CardContent className="p-8 space-y-6">
            <h2 className="text-2xl font-semibold text-center text-indigo-900">
              Verify OTP
            </h2>

            {/* OTP Inputs */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground text-center">
                Enter the 6-digit OTP
              </p>

              <div className="flex justify-center gap-3">
                {otp.map((digit, i) => (
                  <Input
                    key={i}
                    id={`otp-${i}`}
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, i)}
                    className="w-12 h-12 text-center text-lg font-semibold"
                  />
                ))}
              </div>
            </div>

            <Button
              onClick={handleVerify}
              disabled={loading}
              className="w-full bg-indigo-700 hover:bg-indigo-800"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Didn’t receive OTP?
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Otp;
