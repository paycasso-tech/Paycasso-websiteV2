"use client"
import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { useRouter } from "next/navigation";

export default function WalletBalanceCard() {
  const [wallet, setWallet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        
        if (!currentUser) {
          router.push("/sign-in");
          return;
        }

        setUser(currentUser);
        console.log("current User info", currentUser);

        // Get user's wallet from database (just the basic info needed for Circle API calls)
        let walletData = null;
        
        try {
          // Try to get wallet info from database by joining with profiles
          const { data: walletFromDB, error: walletError } = await supabase
            .from("wallets")
            .select(`
              id, 
              circle_wallet_id, 
              blockchain, 
              wallet_address,
              profiles!inner(auth_user_id)
            `)
            .eq("profiles.auth_user_id", currentUser.id)
            .single();

          if (walletError) {
            console.warn("Wallet fetch warning:", walletError);
            if (walletError.code === 'PGRST116') {
              setError("No wallet found for this user. Please contact support to set up your wallet.");
              return;
            } else {
              console.error("Wallet fetch error:", walletError);
              setError("Failed to fetch wallet information");
              return;
            }
          }

          if (walletFromDB) {
            walletData = walletFromDB;
            console.log("Wallet info fetched from database:", walletData);
          }
        } catch (dbException) {
          console.error("Database fetch exception:", dbException);
          setError("Failed to fetch wallet information from database");
          return;
        }

        // If we have wallet data, fetch real-time balance from Circle
        if (walletData?.circle_wallet_id) {
          try {
            const balanceResponse = await fetch('/api/wallet/balance', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                walletId: walletData.circle_wallet_id
              })
            });

            if (!balanceResponse.ok) {
              throw new Error(`Balance API error: ${balanceResponse.status}`);
            }

            const balanceData = await balanceResponse.json();
            
            if (balanceData.error) {
              throw new Error(balanceData.error);
            }

            // Combine database wallet info with real-time balance from Circle
            const completeWalletData = {
              ...walletData,
              balance: balanceData.balance || "0",
              // Add blockchain info if not present
              blockchain: walletData.blockchain || "Ethereum",
              currency: "USDC" // Circle wallets use USDC
            };

            setWallet(completeWalletData);
            console.log("Complete wallet data with Circle balance:", completeWalletData);
          } catch (circleApiError) {
            console.error("Circle API error:", circleApiError);
            // Fallback to database data if Circle API fails
            const fallbackWalletData = {
              ...walletData,
              balance: "0", // Default balance if Circle API fails
              blockchain: walletData.blockchain || "Ethereum",
              currency: "USDC"
            };
            setWallet(fallbackWalletData);
            console.log("Using fallback wallet data:", fallbackWalletData);
          }
        } else {
          setError("Invalid wallet configuration. Please contact support.");
        }

      } catch (error) {
        console.error("Error fetching wallet data:", error);
        setError("Failed to fetch user data. Please try again later.");
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

  if (error) {
    return (
      <div className="bg-primary rounded-3xl p-6">
        <h3 className="text-white text-medium font-bold mb-2">
          Wallet Error
        </h3>
        <p className="text-white/70 text-sm mb-4">{error}</p>
        <p className="text-white/50 text-xs">Please contact support if this issue persists.</p>
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
