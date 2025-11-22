// "use client"
// import { useEffect, useState } from "react";
// import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
// import { useRouter } from "next/navigation";

// export default function WalletBalanceCard() {
//   interface WalletData {
//     id: string;
//     circle_wallet_id: string;
//     blockchain: string;
//     wallet_address: string;
//     balance: string;
//     currency: string;
//   }
  
//   const [wallet, setWallet] = useState<WalletData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState<unknown>(null);
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();
//   const supabase = createSupabaseBrowserClient();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setError(null);
//         const { data: { user: currentUser } } = await supabase.auth.getUser();
        
//         if (!currentUser) {
//           router.push("/sign-in");
//           return;
//         }

//         setUser(currentUser);
//         console.log("current User info", currentUser);

//         // Get user's wallet from database (just the basic info needed for Circle API calls)
//         let walletData = null;
        
//         try {
//           // Try to get wallet info from database by joining with profiles
//           const { data: walletFromDB, error: walletError } = await supabase
//             .from("wallets")
//             .select(`
//               id, 
//               circle_wallet_id, 
//               blockchain, 
//               wallet_address,
//               profiles!inner(auth_user_id)
//             `)
//             .eq("profiles.auth_user_id", currentUser.id)
//             .single();

//           if (walletError) {
//             console.warn("Wallet fetch warning:", walletError);
//             if (walletError.code === 'PGRST116') {
//               setError("No wallet found for this user. Please contact support to set up your wallet.");
//               return;
//             } else {
//               console.error("Wallet fetch error:", walletError);
//               setError("Failed to fetch wallet information");
//               return;
//             }
//           }

//           if (walletFromDB) {
//             walletData = walletFromDB;
//             console.log("Wallet info fetched from database:", walletData);
//           }
//         } catch (dbException) {
//           console.error("Database fetch exception:", dbException);
//           setError("Failed to fetch wallet information from database");
//           return;
//         }

//         // If we have wallet data, fetch real-time balance from Circle
//         if (walletData?.circle_wallet_id) {
//           try {
//             const balanceResponse = await fetch('/api/wallet/balance', {
//               method: 'POST',
//               headers: {
//                 'Content-Type': 'application/json',
//               },
//               body: JSON.stringify({
//                 walletId: walletData.circle_wallet_id
//               })
//             });

//             if (!balanceResponse.ok) {
//               throw new Error(`Balance API error: ${balanceResponse.status}`);
//             }

//             const balanceData = await balanceResponse.json();
            
//             if (balanceData.error) {
//               throw new Error(balanceData.error);
//             }

//             // Combine database wallet info with real-time balance from Circle
//             const completeWalletData = {
//               ...walletData,
//               balance: balanceData.balance || "0",
//               // Add blockchain info if not present
//               blockchain: walletData.blockchain || "Ethereum",
//               currency: "USDC" // Circle wallets use USDC
//             };

//             setWallet(completeWalletData);
//             console.log("Complete wallet data with Circle balance:", completeWalletData);
//           } catch (circleApiError) {
//             console.error("Circle API error:", circleApiError);
//             // Fallback to database data if Circle API fails
//             const fallbackWalletData = {
//               ...walletData,
//               balance: "0", // Default balance if Circle API fails
//               blockchain: walletData.blockchain || "Ethereum",
//               currency: "USDC"
//             };
//             setWallet(fallbackWalletData);
//             console.log("Using fallback wallet data:", fallbackWalletData);
//           }
//         } else {
//           setError("Invalid wallet configuration. Please contact support.");
//         }

//       } catch (error) {
//         console.error("Error fetching wallet data:", error);
//         setError("Failed to fetch user data. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [supabase, router]);

//   if (loading) {
//     return (
//       <div className="bg-primary rounded-3xl p-6">
//         <div className="animate-pulse">
//           <div className="h-4 bg-white/20 rounded mb-2"></div>
//           <div className="h-8 bg-white/20 rounded mb-2"></div>
//           <div className="h-6 bg-white/20 rounded w-16"></div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-primary rounded-3xl p-6">
//         <h3 className="text-white text-medium font-bold mb-2">
//           Wallet Error
//         </h3>
//         <p className="text-white/70 text-sm mb-4">{error}</p>
//         <p className="text-white/50 text-xs">Please contact support if this issue persists.</p>
//       </div>
//     );
//   }

//   if (!wallet) {
//     return (
//       <div className="bg-primary rounded-3xl p-6">
//         <h3 className="text-white text-medium font-bold mb-2">
//           No wallet found
//         </h3>
//         <p className="text-white/70 text-sm">Please contact support to set up your wallet.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-primary rounded-3xl p-6">
//       <h3 className="text-white text-medium font-bold mb-2">
//         Total Balance
//       </h3>
//       <div className="text-2xl font-medium mb-2">{wallet.balance} {wallet.currency}</div>
//       <div className="bg-blue-600 text-xs px-2 py-1 rounded-full inline-block text-white">
//         BlockChain: {wallet.blockchain}
//       </div>
//     </div>
//   );
// }


// "use client";
// import { useEffect, useState } from "react";
// import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
// import { useRouter } from "next/navigation";

// export default function WalletBalanceCard() {
//   interface WalletData {
//     id: string;
//     circle_wallet_id: string;
//     blockchain: string;
//     wallet_address: string;
//     balance: string;
//     currency: string;
//   }

//   const [wallet, setWallet] = useState<WalletData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState<unknown>(null);
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();
//   const supabase = createSupabaseBrowserClient();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setError(null);
//         const {
//           data: { user: currentUser },
//         } = await supabase.auth.getUser();

//         if (!currentUser) {
//           router.push("/sign-in");
//           return;
//         }

//         setUser(currentUser);
//         console.log("current User info", currentUser);

//         // Get user's wallet from database (just the basic info needed for Circle API calls)
//         let walletData = null;

//         try {
//           // Try to get wallet info from database by joining with profiles
//           const { data: walletFromDB, error: walletError } = await supabase
//             .from("wallets")
//             .select(
//               `
//               id, 
//               circle_wallet_id, 
//               blockchain, 
//               wallet_address,
//               profiles!inner(auth_user_id)
//             `
//             )
//             .eq("profiles.auth_user_id", currentUser.id)
//             .single();

//           if (walletError) {
//             console.warn("Wallet fetch warning:", walletError);
//             if (walletError.code === "PGRST116") {
//               setError(
//                 "No wallet found for this user. Please contact support to set up your wallet."
//               );
//               return;
//             } else {
//               console.error("Wallet fetch error:", walletError);
//               setError("Failed to fetch wallet information");
//               return;
//             }
//           }

//           if (walletFromDB) {
//             walletData = walletFromDB;
//             console.log("Wallet info fetched from database:", walletData);
//           }
//         } catch (dbException) {
//           console.error("Database fetch exception:", dbException);
//           setError("Failed to fetch wallet information from database");
//           return;
//         }

//         // If we have wallet data, fetch real-time balance from Circle
//         if (walletData?.circle_wallet_id) {
//           try {
//             const balanceResponse = await fetch("/api/wallet/balance", {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify({
//                 walletId: walletData.circle_wallet_id,
//               }),
//             });

//             if (!balanceResponse.ok) {
//               throw new Error(`Balance API error: ${balanceResponse.status}`);
//             }

//             const balanceData = await balanceResponse.json();

//             if (balanceData.error) {
//               throw new Error(balanceData.error);
//             }

//             // Combine database wallet info with real-time balance from Circle
//             const completeWalletData = {
//               ...walletData,
//               balance: balanceData.balance || "0",
//               // Add blockchain info if not present
//               blockchain: walletData.blockchain || "Ethereum",
//               currency: "USDC", // Circle wallets use USDC
//             };

//             setWallet(completeWalletData);
//             console.log(
//               "Complete wallet data with Circle balance:",
//               completeWalletData
//             );
//           } catch (circleApiError) {
//             console.error("Circle API error:", circleApiError);
//             // Fallback to database data if Circle API fails
//             const fallbackWalletData = {
//               ...walletData,
//               balance: "0", // Default balance if Circle API fails
//               blockchain: walletData.blockchain || "Ethereum",
//               currency: "USDC",
//             };
//             setWallet(fallbackWalletData);
//             console.log("Using fallback wallet data:", fallbackWalletData);
//           }
//         } else {
//           setError("Invalid wallet configuration. Please contact support.");
//         }
//       } catch (error) {
//         console.error("Error fetching wallet data:", error);
//         setError("Failed to fetch user data. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [supabase, router]);

//   if (loading) {
//     return (
//       <div className="bg-white/[0.03] backdrop-blur-xl backdrop-saturate-150 border border-white/20 rounded-4xl p-6 shadow-lg shadow-black/10">
//         <div className="animate-pulse">
//           <div className="h-4 bg-gray-700 rounded mb-2"></div>
//           <div className="h-8 bg-gray-700 rounded mb-2"></div>
//           <div className="h-6 bg-gray-700 rounded w-16"></div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-white/[0.03] backdrop-blur-xl backdrop-saturate-150 border border-white/20 rounded-4xl p-6 shadow-lg shadow-black/10">
//         <h3 className="text-white text-medium font-bold mb-2">Wallet Error</h3>
//         <p className="text-gray-400 text-sm mb-4">{error}</p>
//         <p className="text-gray-500 text-xs">
//           Please contact support if this issue persists.
//         </p>
//       </div>
//     );
//   }

//   if (!wallet) {
//     return (
//       <div className="bg-white/[0.03] backdrop-blur-xl backdrop-saturate-150 border border-white/20 rounded-4xl p-6 shadow-lg shadow-black/10">
//         <h3 className="text-white text-medium font-bold mb-2">
//           No wallet found
//         </h3>
//         <p className="text-gray-400 text-sm">
//           Please contact support to set up your wallet.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="relative bg-white/[0.03] backdrop-blur-xl backdrop-saturate-150 border border-white/20 rounded-4xl p-6 h-[180px] shadow-lg shadow-black/10 overflow-hidden">
//       {/* Multi-layer glass overlay - SAME AS BUTTON */}
//       <div className="absolute inset-0 pointer-events-none">
//         <div className="absolute top-0 left-0 right-0 h-[50%] bg-gradient-to-b from-white/10 to-transparent"></div>
//         <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-transparent"></div>
//         <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-black/5 to-transparent"></div>
//       </div>
//       {/* Inner glow shadow */}
//       <div className="absolute inset-0 rounded-4xl shadow-inner shadow-black/5"></div>

//       <div className="relative z-10">
//         <div className="space-y-1 mb-3">
//           <h3 className="text-sm font-medium text-gray-400">Total Balance</h3>
//           <div className="text-2xl font-bold text-white">
//             {wallet.balance} {wallet.currency}
//           </div>
//         </div>
//         <div className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full inline-block">
//           +6.3%
//         </div>
//       </div>
//     </div>
//   );
// }


// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// interface WalletData {
//   id: string;
//   circle_wallet_id: string;
//   blockchain: string;
//   wallet_address: string;
//   balance: string;
//   currency: string;
// }

// export default function WalletBalanceCard() {
//   const [wallet, setWallet] = useState<WalletData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setError(null);

//         // Check if user is authenticated via NextAuth
//         const sessionResponse = await fetch("/api/auth/session");
//         const session = await sessionResponse.json();

//         if (!session?.user) {
//           router.push("/sign-in");
//           return;
//         }

//         console.log("Current user info:", session.user);

//         // Get user's wallet from PostgreSQL database
//         const walletResponse = await fetch("/api/user/wallet");
//         const walletData = await walletResponse.json();

//         if (walletData.error) {
//           if (walletData.error === "No wallet found") {
//             setError(
//               "No wallet found for this user. Please contact support to set up your wallet."
//             );
//           } else {
//             setError("Failed to fetch wallet information");
//           }
//           return;
//         }

//         console.log("Wallet info fetched:", walletData.wallet);

//         // Fetch real-time balance from Circle if wallet exists
//         if (walletData.wallet?.circle_wallet_id) {
//           try {
//             const balanceResponse = await fetch("/api/wallet/balance", {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify({
//                 walletId: walletData.wallet.circle_wallet_id,
//               }),
//             });

//             if (!balanceResponse.ok) {
//               throw new Error(`Balance API error: ${balanceResponse.status}`);
//             }

//             const balanceData = await balanceResponse.json();

//             if (balanceData.error) {
//               throw new Error(balanceData.error);
//             }

//             // Combine database wallet info with real-time balance
//             const completeWalletData = {
//               ...walletData.wallet,
//               balance: balanceData.balance || "0",
//               blockchain: walletData.wallet.blockchain || "Ethereum",
//               currency: "USDC",
//             };

//             setWallet(completeWalletData);
//             console.log(
//               "Complete wallet data with Circle balance:",
//               completeWalletData
//             );
//           } catch (circleApiError) {
//             console.error("Circle API error:", circleApiError);
//             // Fallback to database data if Circle API fails
//             const fallbackWalletData = {
//               ...walletData.wallet,
//               balance: "0",
//               blockchain: walletData.wallet.blockchain || "Ethereum",
//               currency: "USDC",
//             };
//             setWallet(fallbackWalletData);
//             console.log("Using fallback wallet data:", fallbackWalletData);
//           }
//         } else {
//           setError("Invalid wallet configuration. Please contact support.");
//         }
//       } catch (error) {
//         console.error("Error fetching wallet data:", error);
//         setError("Failed to fetch user data. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [router]);

//   if (loading) {
//     return (
//       <div className="bg-white/[0.03] backdrop-blur-xl backdrop-saturate-150 border border-white/20 rounded-4xl p-6 shadow-lg shadow-black/10">
//         <div className="animate-pulse">
//           <div className="h-4 bg-gray-700 rounded mb-2"></div>
//           <div className="h-8 bg-gray-700 rounded mb-2"></div>
//           <div className="h-6 bg-gray-700 rounded w-16"></div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-white/[0.03] backdrop-blur-xl backdrop-saturate-150 border border-white/20 rounded-4xl p-6 shadow-lg shadow-black/10">
//         <h3 className="text-white text-medium font-bold mb-2">Wallet Error</h3>
//         <p className="text-gray-400 text-sm mb-4">{error}</p>
//         <p className="text-gray-500 text-xs">
//           Please contact support if this issue persists.
//         </p>
//       </div>
//     );
//   }

//   if (!wallet) {
//     return (
//       <div className="bg-white/[0.03] backdrop-blur-xl backdrop-saturate-150 border border-white/20 rounded-4xl p-6 shadow-lg shadow-black/10">
//         <h3 className="text-white text-medium font-bold mb-2">
//           No wallet found
//         </h3>
//         <p className="text-gray-400 text-sm">
//           Please contact support to set up your wallet.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="relative bg-white/[0.03] backdrop-blur-xl backdrop-saturate-150 border border-white/20 rounded-4xl p-6 h-[180px] shadow-lg shadow-black/10 overflow-hidden">
//       {/* Multi-layer glass overlay */}
//       <div className="absolute inset-0 pointer-events-none">
//         <div className="absolute top-0 left-0 right-0 h-[50%] bg-gradient-to-b from-white/10 to-transparent"></div>
//         <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-transparent"></div>
//         <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-black/5 to-transparent"></div>
//       </div>
//       {/* Inner glow shadow */}
//       <div className="absolute inset-0 rounded-4xl shadow-inner shadow-black/5"></div>

//       <div className="relative z-10">
//         <div className="space-y-1 mb-3">
//           <h3 className="text-sm font-medium text-gray-400">Total Balance</h3>
//           <div className="text-2xl font-bold text-white">
//             {wallet.balance} {wallet.currency}
//           </div>
//         </div>
//         <div className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full inline-block">
//           +6.3%
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:3001";

interface WalletData {
  id: string;
  address: string;
  usdBalance: number;
  usdcBalance: number;
  rewards: {
    amount: number;
    lastUpdated: string;
  };
}

export default function WalletBalanceCard() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);

        // Check if user is authenticated via NextAuth
        const sessionResponse = await fetch("/api/auth/session");
        const session = await sessionResponse.json();

        if (!session?.user) {
          router.push("/sign-in");
          return;
        }

        console.log("Current user info:", session.user);

        // Fetch wallet from Express backend
        const walletResponse = await fetch(
          `${BACKEND_API_URL}/api/user/getWallet`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.user.id}`,
              "x-user-email": session.user.email,
            },
          }
        );

        if (!walletResponse.ok) {
          throw new Error(`Backend API error: ${walletResponse.status}`);
        }

        const userData = await walletResponse.json();

        if (!userData.wallet) {
          setError(
            "No wallet found for this user. Please contact support to set up your wallet."
          );
          return;
        }

        console.log("Wallet info fetched:", userData.wallet);

        setWallet(userData.wallet);
      } catch (error: any) {
        console.error("Error fetching wallet data:", error);
        setError("Failed to fetch user data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="bg-white/[0.03] backdrop-blur-xl backdrop-saturate-150 border border-white/20 rounded-4xl p-6 shadow-lg shadow-black/10">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded mb-2"></div>
          <div className="h-8 bg-gray-700 rounded mb-2"></div>
          <div className="h-6 bg-gray-700 rounded w-16"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/[0.03] backdrop-blur-xl backdrop-saturate-150 border border-white/20 rounded-4xl p-6 shadow-lg shadow-black/10">
        <h3 className="text-white text-medium font-bold mb-2">Wallet Error</h3>
        <p className="text-gray-400 text-sm mb-4">{error}</p>
        <p className="text-gray-500 text-xs">
          Please contact support if this issue persists.
        </p>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="bg-white/[0.03] backdrop-blur-xl backdrop-saturate-150 border border-white/20 rounded-4xl p-6 shadow-lg shadow-black/10">
        <h3 className="text-white text-medium font-bold mb-2">
          No wallet found
        </h3>
        <p className="text-gray-400 text-sm">
          Please contact support to set up your wallet.
        </p>
      </div>
    );
  }

  return (
    <div className="relative bg-white/[0.03] backdrop-blur-xl backdrop-saturate-150 border border-white/20 rounded-4xl p-6 h-[180px] shadow-lg shadow-black/10 overflow-hidden">
      {/* Multi-layer glass overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-[50%] bg-gradient-to-b from-white/10 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-black/5 to-transparent"></div>
      </div>
      {/* Inner glow shadow */}
      <div className="absolute inset-0 rounded-4xl shadow-inner shadow-black/5"></div>

      <div className="relative z-10">
        <div className="space-y-1 mb-3">
          <h3 className="text-sm font-medium text-gray-400">Total Balance</h3>
          <div className="text-2xl font-bold text-white">
            {wallet.usdcBalance.toFixed(2)} USDC
          </div>
          {wallet.rewards && (
            <div className="text-xs text-gray-400">
              Rewards: +{wallet.rewards.amount.toFixed(4)} USDC
            </div>
          )}
        </div>
        <div className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full inline-block">
          +6.3%
        </div>
      </div>
    </div>
  );
}
