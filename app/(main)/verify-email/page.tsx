"use client";

import { verifyEmailAction, resendOTPAction } from "@/app/(main)/actions";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/dashboard/submit-button";

function VerifyEmailContent() {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const result = await verifyEmailAction(email, otp);

    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({
        type: "success",
        text: "Email verified successfully! Redirecting...",
      });
      setTimeout(() => router.push("/sign-in"), 2000);
    }

    setIsLoading(false);
  };

  const handleResend = async () => {
    setIsLoading(true);
    setMessage(null);

    const result = await resendOTPAction(email);

    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({ type: "success", text: "New verification code sent!" });
      setCountdown(60);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F0F1E] via-[#0A0A14] to-[#0F0F1E] p-4">
      <div className="w-full max-w-md">
        <div className="backdrop-blur-3xl rounded-3xl border border-cyan-400/15 bg-gradient-to-br from-slate-900/40 to-slate-950/40 p-8 shadow-2xl">
          <h1 className="text-3xl font-black text-white mb-2">
            Verify Your Email
          </h1>
          <p className="text-gray-400 mb-6">
            We've sent a 6-digit code to <strong>{email}</strong>
          </p>

          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-gray-300">
                Verification Code
              </Label>
              <Input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="Enter 6-digit code"
                maxLength={6}
                required
                className="h-14 text-center text-2xl tracking-widest bg-slate-900/40 border-cyan-400/20 text-white"
              />
            </div>

            {message && (
              <div
                className={`p-4 rounded-xl border ${
                  message.type === "error"
                    ? "bg-red-950/30 border-red-500/30 text-red-400"
                    : "bg-green-950/30 border-green-500/30 text-green-400"
                }`}
              >
                {message.text}
              </div>
            )}

            <SubmitButton
              className="w-full h-14 bg-gradient-to-r from-cyan-500/30 to-cyan-600/20 border-cyan-400/50 text-cyan-300"
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? "Verifying..." : "Verify Email"}
            </SubmitButton>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={handleResend}
              disabled={countdown > 0 || isLoading}
              className="text-cyan-400 hover:text-cyan-300 disabled:text-gray-600 disabled:cursor-not-allowed"
            >
              {countdown > 0
                ? `Resend code in ${countdown}s`
                : "Resend verification code"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
