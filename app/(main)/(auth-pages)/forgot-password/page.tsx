"use client";

import { forgotPasswordAction } from "@/app/(main)/actions";
import { FormMessage, Message } from "@/components/dashboard/form-message";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ForgotPassword({
  searchParams,
}: {
  searchParams: Promise<Message>;
}) {
  const [message, setMessage] = useState<Message>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    searchParams.then(setMessage);
  }, [searchParams]);

  const handleForgotPassword = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const result = await forgotPasswordAction(formData);
      
      // The action will handle redirects and errors internally
      // We just need to handle the loading state
      if (result && typeof result === 'object' && 'error' in result) {
        // Error is already handled by the form
        return;
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      // Handle any unexpected errors
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form className="flex-1 flex flex-col w-full gap-2 text-foreground [&>input]:mb-6 min-w-64 max-w-64 mx-auto">
        <div>
          <h1 className="text-2xl font-medium">Reset Password</h1>
          <p className="text-sm text-secondary-foreground">
            Already have an account?{" "}
            <Link className="text-primary underline" href="/sign-in">
              Sign in
            </Link>
          </p>
        </div>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="you@example.com" required />
          <SubmitButton
            formAction={handleForgotPassword}
            disabled={isLoading}
          >
            Reset Password
          </SubmitButton>
          <FormMessage message={message} />
        </div>
      </form>
    </>
  );
}
