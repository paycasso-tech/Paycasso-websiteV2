"use client"
import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { useRouter } from "next/navigation";

export default function WalletBalanceCard() {
  const [wallet, setWallet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        
        if (!currentUser) {
          router.push("/sign-in");
          return;
        }

        setUser(currentUser);

        // Get user profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("auth_user_id", currentUser.id)
          .single();

        if (profile) {
          // Get wallet data
          const { data: walletData } = await supabase
            .schema("public")
            .from("wallets")
            .select()
            .eq("profile_id", profile.id)
            .single();

          setWallet(walletData);
          console.log("Wallet data fetched successfully:", walletData); 
        }
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase, router]);

  if (loading) {
    return (
      <div className="bg-primary rounded-3xl p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-white/20 rounded mb-2"></div>
          <div className="h-8 bg-white/20 rounded mb-2"></div>
          <div className="h-6 bg-white/20 rounded w-16"></div>
        </div>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="bg-primary rounded-3xl p-6">
        <h3 className="text-white text-medium font-bold mb-2">
          No wallet found
        </h3>
        <p className="text-white/70 text-sm">Please contact support to set up your wallet.</p>
      </div>
    );
  }

  return (
    <div className="bg-primary rounded-3xl p-6">
      <h3 className="text-white text-medium font-bold mb-2">
        Total Balance
      </h3>
      <div className="text-2xl font-medium mb-2">{wallet.balance} {wallet.currency}</div>
      <div className="bg-blue-600 text-xs px-2 py-1 rounded-full inline-block text-white">
        BlockChain: {wallet.blockchain}
      </div>
    </div>
  );
}
