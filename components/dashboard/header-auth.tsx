import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/app/(main)/actions";
import { auth } from "@/auth";

export default async function AuthButton() {
  const session = await auth();
  const user = session?.user;

  return user ? (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-700">
        Hey, {user.name || user.email || "Guest"}!
      </span>
      <form action={signOutAction}>
        <Button
          type="submit"
          variant="outline"
          size="sm"
          className="text-black hover:bg-gray-100 border-gray-300"
        >
          Sign out
        </Button>
      </form>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button
        asChild
        size="sm"
        variant="outline"
        className="text-black border-gray-300"
      >
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant="default">
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
