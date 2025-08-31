"use client";

import { signUpAction } from "@/app/(main)/actions";
import { FormMessage, Message } from "@/components/dashboard/form-message";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Signup({ searchParams }: { searchParams: Promise<Message> }) {
  const [message, setMessage] = useState<Message>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    searchParams.then(setMessage);
  }, [searchParams]);

  const handleSignUp = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const result = await signUpAction(formData);
      
      // If the action returns an error, it will be handled by the form
      if (result && typeof result === 'object' && 'error' in result) {
        // Error is already handled by the form
        return;
      }
      
      // If successful, redirect to the specified location
      if (result && typeof result === 'object' && 'success' in result && 'redirectTo' in result) {
        const redirectResult = result as { success: boolean; redirectTo: string };
        router.push(redirectResult.redirectTo);
      }
    } catch (error) {
      console.error("Sign up error:", error);
      // Handle any unexpected errors
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <form className="flex-1 flex flex-col min-w-64">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-amber-600">
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Already have an account?{" "}
          <Link
            className="text-blue-600 hover:text-blue-500 transition-colors font-medium"
            href="/sign-in"
          >
            Sign in
          </Link>
        </p>

        <div className="flex flex-col gap-4 mt-8">
          <div className="space-y-2">
            <Label htmlFor="full-name">Full Name</Label>
            <Input
              id="full-name"
              name="full-name"
              placeholder="Please enter your full name"
              minLength={3}
              maxLength={255}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="Create a password"
              minLength={6}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company-name">Company Name (optional)</Label>
            <Input
              id="company-name"
              name="company-name"
              placeholder="Enter your company name"
              minLength={3}
              maxLength={255}
            />
          </div>

          <FormMessage message={message} />

          <SubmitButton
            className="w-full"
            formAction={handleSignUp}
            pendingText="Creating account..."
            disabled={isLoading}
          >
            Sign up
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
