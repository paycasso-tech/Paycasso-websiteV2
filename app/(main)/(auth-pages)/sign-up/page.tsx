import { signUpAction } from "@/app/(main)/actions";
import { FormMessage, Message } from "@/components/dashboard/form-message";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

// Make the page function async
export default async function Signup({ searchParams }: { searchParams: Promise<Message> }) {
  const resolvedSearchParams = await searchParams;

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

          <FormMessage message={resolvedSearchParams} />

          <SubmitButton
            className="w-full"
            formAction={async (formData) => {
              await signUpAction(formData);
            }}
            pendingText="Creating account..."
          >
            Sign up
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
