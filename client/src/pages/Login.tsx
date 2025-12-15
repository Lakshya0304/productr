"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import pic1 from "@/assets/pic1.svg";
import { BACKEND_URL } from "@/config";

const Login = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identifier) {
      alert("Please enter email or phone number");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${BACKEND_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            identifier.includes("@")
              ? { email: identifier }
              : { phoneNumber: identifier }
          ),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        setLoading(false);
        return;
      }

      navigate("/otp", {
        state: { identifier },
      });
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
      <div className="hidden md:flex w-1/2 items-center justify-center">
        <img
          src={pic1}
          alt="Signup Illustration"
          className="max-w-md drop-shadow-xl"
        />
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <Card className="w-full max-w-md border-none shadow-none">
          <CardContent className="p-8 space-y-6">
            <h2 className="text-2xl font-semibold text-center">
              Login to your Productr Account
            </h2>

            <form className="space-y-4" onSubmit={handleLogin}>
              <div className="space-y-1">
                <Label>Email or Phone number</Label>
                <Input
                  placeholder="Acme@gmail.com or 9876543210"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-700 hover:bg-indigo-800"
              >
                {loading ? "Sending OTP..." : "Login"}
              </Button>
            </form>

            <div className="mt-10 border border-dashed rounded-md p-4 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have a Productr Account
              </p>
              <a
                href="/signup"
                className="text-sm font-medium text-indigo-700 hover:underline"
              >
                SignUp Here
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
