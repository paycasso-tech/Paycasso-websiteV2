import { auth } from "@/auth";
import { redirect } from "next/navigation";
import InteractiveSidebar from "@/components/dashboard/sidebar";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-black">
      <InteractiveSidebar />

      <div className="ml-[88px] p-8">
        <h1 className="text-3xl font-bold text-white mb-4">Settings</h1>
        <p className="text-gray-400">Settings page coming soon...</p>
      </div>
    </div>
  );
}
