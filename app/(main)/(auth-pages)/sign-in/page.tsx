"use client";

import { signInAction } from "@/app/(main)/actions";
import { FormMessage, Message } from "@/components/dashboard/form-message";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import router from "next/router";

export default function Login({
  searchParams,
}: {
  searchParams: Promise<Message>;
}) {
  const [message, setMessage] = useState<Message>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    searchParams.then(setMessage);
  }, [searchParams]);

  const handleSignIn = async (formData: FormData) => {
    setIsLoading(true);
    setMessage({});

    try {
      const emailValue = formData.get("email") as string;
      const password = formData.get("password") as string;

      const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "";

      if (!BACKEND_API_URL) {
        setMessage({ error: "Backend API URL is not configured." });
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${BACKEND_API_URL}/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailValue, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Check if email is not verified
        if (response.status === 403 && !data.emailVerified) {
          setMessage({
            error: "Email not verified. Redirecting to verification...",
          });

          // Redirect to signup page with email pre-filled for verification
          setTimeout(() => {
            router.push(
              `/sign-up?email=${encodeURIComponent(emailValue)}&verify=true`
            );
          }, 2000);
          return;
        }

        setMessage({ error: data.error || "Login failed" });
        setIsLoading(false);
        return;
      }

      // Success - save token and redirect
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userEmail", data.email);

      setMessage({ success: "Login successful! Redirecting..." });

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    } catch (error) {
      console.error("Sign in error:", error);
      setMessage({ error: "An error occurred. Please try again." });
      setIsLoading(false);
    }
  };


  return (
    <div className="w-full min-h-screen grid lg:grid-cols-2">
      {/* LEFT SIDE - Image (50% on desktop, hidden on mobile) */}
      <div className="relative hidden lg:block bg-muted min-h-screen">
        <img
          src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=3432&auto=format&fit=crop"
          alt="Paycasso Platform"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: "brightness(0.4)" }}
        />
        {/* Overlay Text */}
        <div className="absolute inset-0 flex items-end p-12 lg:p-16">
          <div className="max-w-lg">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Welcome to
              <br />
              Paycasso
            </h1>
            <p className="text-lg text-gray-300">
              Seamlessly enhance the future through our sphere technology.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Form (50% on desktop, 100% on mobile) */}
      <div className="flex flex-col min-h-screen bg-background">
        {/* Logo Header */}
        <div className="p-6 md:p-8 lg:p-10">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-lg"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            Paycasso
          </Link>
        </div>

        {/* Centered Form Container */}
        <div className="flex-1 flex items-center justify-center px-6 md:px-8 py-8 lg:py-12">
          <div className="w-full max-w-sm space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-2 text-center">
              <h1 className="text-2xl font-bold tracking-tight">
                Login to your account
              </h1>
              <p className="text-balance text-sm text-muted-foreground">
                Enter your email below to login to your account
              </p>
            </div>

            <form className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm underline-offset-4 hover:underline text-muted-foreground"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    disabled={isLoading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {message && Object.keys(message).length > 0 && (
                <div className="rounded-lg bg-destructive/15 p-3 text-sm text-destructive">
                  <FormMessage message={message} />
                </div>
              )}

              {/* Login Button */}
              <SubmitButton
                formAction={handleSignIn}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Signing in..." : "Login"}
              </SubmitButton>

              {/* Divider */}
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>

              {/* Web3 Login Buttons with Real Logos */}
              <div className="space-y-3">
                {/* MetaMask Button */}
                <Button
                  variant="outline"
                  type="button"
                  disabled={isLoading}
                  className="w-full"
                  onClick={() => {
                    alert("MetaMask login coming soon!");
                  }}
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
                    alt="MetaMask"
                    className="h-5 w-5 mr-2"
                  />
                  Login with MetaMask
                </Button>

                {/* Coinbase Wallet Button */}
                <Button
                  variant="outline"
                  type="button"
                  disabled={isLoading}
                  className="w-full"
                  onClick={() => {
                    alert("Coinbase Wallet login coming soon!");
                  }}
                >
                  <img
                    src="https://avatars.githubusercontent.com/u/18060234?s=200&v=4"
                    alt="Coinbase"
                    className="h-5 w-5 mr-2 rounded-sm"
                  />
                  Login with Coinbase
                </Button>
              </div>

              {/* Sign Up Link */}
              <div className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                  href="/sign-up"
                  className="underline underline-offset-4 hover:text-primary transition-colors"
                >
                  Sign up
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
