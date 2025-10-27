import { auth } from "@/auth";
import { redirect } from "next/navigation";
import InteractiveSidebar from "@/components/dashboard/sidebar";

export default async function SupportPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-black">
      <InteractiveSidebar />

      <div className="ml-[88px] p-8">
        <h1 className="text-3xl font-bold text-white mb-4">Support</h1>
        <p className="text-gray-400">Support center coming soon...</p>
      </div>
    </div>
  );
}
