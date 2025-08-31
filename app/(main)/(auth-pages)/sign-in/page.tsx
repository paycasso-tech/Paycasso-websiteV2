"use client";

import { signInAction } from "@/app/(main)/actions";
import { FormMessage, Message } from "@/components/dashboard/form-message";
import { GoogleLoginButton } from "@/components/dashboard/google-login-button";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Login({ searchParams }: { searchParams: Promise<Message> }) {
  const [message, setMessage] = useState<Message>({});
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [fieldValues, setFieldValues] = useState({ email: '', password: '' });
  const router = useRouter();

  useEffect(() => {
    searchParams.then(setMessage);
  }, [searchParams]);

  const handleSignIn = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const result = await signInAction(formData);
      
      // If the action returns an error, it will be handled by the form
      // If it's successful, the action will handle the redirect internally
      if (result && 'error' in result) {
        // Error is already handled by the form
        return;
      }
      
      // If successful, redirect to the specified location
      if (result && typeof result === 'object' && 'success' in result && 'redirectTo' in result) {
        const redirectResult = result as { success: boolean; redirectTo: string };
        router.push(redirectResult.redirectTo);
      }
    } catch (error) {
      console.error("Sign in error:", error);
      // Handle any unexpected errors
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFieldValues(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm mx-auto">
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6 shadow-xl">
        <form className="flex-1 flex flex-col">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-white mb-2">
              Sign in
            </h1>
            <p className="text-sm text-gray-400">
              Don't have an account?{" "}
              <Link
                className="text-blue-400 hover:text-blue-300 transition-colors font-medium underline-offset-4 hover:underline" 
                href="/sign-up"
              >
                Sign up
              </Link>
            </p>
          </div>

          <div className="flex flex-col gap-5">
            {/* Email Field */}
            <div className="space-y-2">
              <Label 
                htmlFor="email" 
                className="text-sm font-medium text-gray-200"
              >
                Email
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={fieldValues.email}
                  className={`
                    w-full h-11 px-3 bg-gray-800/50 border rounded-md transition-all duration-200
                    ${focusedField === 'email' 
                      ? 'border-blue-500 shadow-sm shadow-blue-500/20' 
                      : 'border-gray-600 hover:border-gray-500'
                    }
                    text-white placeholder:text-gray-500 focus:outline-none focus:ring-0
                  `}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label 
                  htmlFor="password"
                  className="text-sm font-medium text-gray-200"
                >
                  Password
                </Label>
                <Link
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors hover:underline underline-offset-4"
                  href="/forgot-password"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Your password"
                  required
                  value={fieldValues.password}
                  className={`
                    w-full h-11 px-3 bg-gray-800/50 border rounded-md transition-all duration-200
                    ${focusedField === 'password' 
                      ? 'border-blue-500 shadow-sm shadow-blue-500/20' 
                      : 'border-gray-600 hover:border-gray-500'
                    }
                    text-white placeholder:text-gray-500 focus:outline-none focus:ring-0
                  `}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                />
              </div>
            </div>

            <FormMessage message={message} />

            <SubmitButton
              className={`
                w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md 
                transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/25
                disabled:opacity-50 disabled:cursor-not-allowed
                ${isLoading ? 'opacity-75' : ''}
              `}
              pendingText="Signing In..."
              formAction={handleSignIn}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </SubmitButton>
          </div>
        </form>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-700" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-gray-900 px-3 text-gray-400 font-medium">
            Or continue with
          </span>
        </div>
      </div>

      {/* Google Login Button */}
      <GoogleLoginButton nextUrl="/dashboard" />
    </div>
  );
}