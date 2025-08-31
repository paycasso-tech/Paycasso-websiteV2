import { signInAction } from "@/app/(main)/actions";
import { FormMessage, Message } from "@/components/dashboard/form-message";
import { GoogleLoginButton } from "@/components/dashboard/google-login-button";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Login({ searchParams }: { searchParams: Promise<Message> }) {
  const resolvedSearchParams = await searchParams;

  return (
    <div className="flex flex-col gap-6">
      <form className="flex-1 flex flex-col min-w-64">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-amber-600">
          Sign in
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Don't have an account?{" "}
          <Link
            className="text-blue-600 hover:text-blue-500 transition-colors font-medium" 
            href="/sign-up"
          >
            Sign up
          </Link>
        </p>

        <div className="flex flex-col gap-4 mt-8">
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
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Password</Label>
              <Link
                className="text-xs text-blue-600 hover:text-blue-500 transition-colors"
                href="/forgot-password"
              >
                Forgot Password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="Your password"
              required
            />
          </div>

          <FormMessage message={resolvedSearchParams} />

          <SubmitButton
            className="w-full"
            pendingText="Signing In..."
            formAction={async (formData) => {
              await signInAction(formData);
            }}
          >
            Sign in
          </SubmitButton>
        </div>
      </form>

      <div className="relative">
        {/* <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div> */}
        <div className="relative flex justify-center text-xs uppercase">
          <span className=" px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <GoogleLoginButton nextUrl="/dashboard" />
    </div>
  );
}