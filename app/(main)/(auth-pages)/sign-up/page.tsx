"use client";

import { signUpAction } from "@/app/(main)/actions";
import { FormMessage, Message } from "@/components/dashboard/form-message";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Mail, Check } from "lucide-react";
import { AnimatedBentoGrid } from "@/components/auth/animated-bento-grid";
import { OTPInput } from "@/components/auth/otp-input";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

type SignUpStep = "details" | "verify-otp";

export default function Signup({
  searchParams,
}: {
  searchParams: Promise<Message>;
}) {
  const [message, setMessage] = useState<Message>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<SignUpStep>("details");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const router = useRouter();

  useEffect(() => {
    searchParams.then(setMessage);
  }, [searchParams]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleSignUp = async (formData: FormData) => {
    setIsLoading(true);
    setMessage({});

    try {
      const emailValue = formData.get("email") as string;
      const password = formData.get("password") as string;
      const name = formData.get("full-name") as string;

      const response = await fetch(`${BACKEND_URL}/api/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailValue, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({ error: data.error || "Registration failed" });
        setIsLoading(false);
        return;
      }

      // Success - move to OTP verification step
      setEmail(emailValue);
      setStep("verify-otp");
      setResendTimer(60); // Start 60 second timer
      setMessage({ success: "Verification code sent to your email!" });
    } catch (error) {
      console.error("Sign up error:", error);
      setMessage({ error: "An error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setMessage({ error: "Please enter a valid 6-digit code" });
      return;
    }

    setIsLoading(true);
    setMessage({});

    try {
      const response = await fetch(`${BACKEND_URL}/api/user/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({ error: data.error || "Invalid verification code" });
        setIsLoading(false);
        return;
      }

      // Success - redirect to sign-in
      setMessage({ success: "Email verified successfully! Redirecting..." });
      setTimeout(() => {
        router.push("/sign-in?verified=true");
      }, 1500);
    } catch (error) {
      console.error("Verify OTP error:", error);
      setMessage({ error: "Verification failed. Please try again." });
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    setMessage({});

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/user/resend-verification-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage({ error: data.error || "Failed to resend code" });
        setIsLoading(false);
        return;
      }

      setMessage({ success: "New verification code sent!" });
      setResendTimer(60);
      setOtp("");
    } catch (error) {
      console.error("Resend OTP error:", error);
      setMessage({ error: "Failed to resend code" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen grid lg:grid-cols-2 overflow-hidden">
      {/* LEFT SIDE - Animated Bento Grid */}
      <div className="hidden lg:block relative">
        <AnimatedBentoGrid />
      </div>

      {/* RIGHT SIDE - Form */}
      <div className="flex flex-col h-screen bg-background overflow-y-auto">
        {/* Logo Header */}
        <div className="flex-shrink-0 p-6 md:p-8">
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

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center px-6 md:px-8 py-6">
          <div className="w-full max-w-sm space-y-6">
            {step === "details" ? (
              <>
                {/* Step 1: User Details */}
                <div className="flex flex-col gap-2 text-center">
                  <h1 className="text-2xl font-bold">Create an account</h1>
                  <p className="text-sm text-muted-foreground">
                    Enter your details to get started
                  </p>
                </div>

                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    handleSignUp(formData);
                  }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="full-name">Full Name</Label>
                    <Input
                      id="full-name"
                      name="full-name"
                      placeholder="John Doe"
                      required
                      disabled={isLoading}
                    />
                  </div>

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

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Min. 6 characters"
                        minLength={6}
                        required
                        disabled={isLoading}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {message && Object.keys(message).length > 0 && (
                    <div
                      className={`rounded-lg p-3 text-sm ${
                        message.error
                          ? "bg-destructive/15 text-destructive"
                          : "bg-green-500/15 text-green-600"
                      }`}
                    >
                      <FormMessage message={message} />
                    </div>
                  )}

                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? "Creating account..." : "Continue"}
                  </Button>

                  <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                      href="/sign-in"
                      className="underline underline-offset-4 hover:text-primary"
                    >
                      Sign in
                    </Link>
                  </div>
                </form>
              </>
            ) : (
              <>
                {/* Step 2: OTP Verification */}
                <div className="flex flex-col gap-2 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Mail className="h-8 w-8 text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold">Verify your email</h1>
                  <p className="text-sm text-muted-foreground">
                    We sent a 6-digit code to <strong>{email}</strong>
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-center block">
                      Enter verification code
                    </Label>
                    <OTPInput
                      value={otp}
                      onChange={setOtp}
                      disabled={isLoading}
                    />
                  </div>

                  {message && Object.keys(message).length > 0 && (
                    <div
                      className={`rounded-lg p-3 text-sm ${
                        message.error
                          ? "bg-destructive/15 text-destructive"
                          : "bg-green-500/15 text-green-600"
                      }`}
                    >
                      <FormMessage message={message} />
                    </div>
                  )}

                  <Button
                    onClick={handleVerifyOTP}
                    disabled={isLoading || otp.length !== 6}
                    className="w-full"
                  >
                    {isLoading ? "Verifying..." : "Verify Email"}
                  </Button>

                  <div className="text-center text-sm">
                    {resendTimer > 0 ? (
                      <p className="text-muted-foreground">
                        Resend code in {resendTimer}s
                      </p>
                    ) : (
                      <button
                        onClick={handleResendOTP}
                        disabled={isLoading}
                        className="text-primary hover:underline"
                      >
                        Resend verification code
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => setStep("details")}
                    className="w-full text-sm text-muted-foreground hover:text-foreground"
                  >
                    ← Back to signup
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
