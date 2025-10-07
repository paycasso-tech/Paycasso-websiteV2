// "use client"
// import { useEffect, useState } from "react";
// import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
// import { useRouter } from "next/navigation";
// import {
//   Wallet,
//   Copy,
//   ExternalLink,
//   Shield,
//   TrendingUp,
//   Calendar,
//   Clock,
//   ChevronLeft,
//   ChevronRight,
//   Send,
//   Download,
//   RefreshCw,
//   Eye,
//   EyeOff,
//   CheckCircle2,
//   AlertTriangle,
//   User,
//   Mail,
//   Phone,
//   MapPin,
//   CreditCard,
//   Zap,
//   ArrowUpRight,
//   ArrowDownLeft,
//   Plus,
//   ArrowDownRight,
// } from "lucide-react";
// import InteractiveSidebar from "@/components/dashboard/sidebar";

// interface WalletData {
//   id: string;
//   circle_wallet_id: string;
//   blockchain: string;
//   wallet_address: string;
//   balance: string;
//   currency: string;
//   profiles?: unknown;
// }

// interface UserProfile {
//   auth_user_id: string;
//   email?: string;
//   phone?: string;
//   full_name?: string;
//   avatar_url?: string;
// }

// interface SupabaseUser {
//   id: string;
//   email: string | null;
//   created_at: string;
//   user_metadata: {
//     full_name?: string;
//   };
// }

// export default function WalletInfoPage() {
//   const [wallet, setWallet] = useState<WalletData | null>(null);
//   const [user, setUser] = useState<SupabaseUser | null>(null);
//   const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [showFullAddress, setShowFullAddress] = useState(false);
//   const [showBalance, setShowBalance] = useState(true);
//   const [currentMonth, setCurrentMonth] = useState("January");
//   const [refreshing, setRefreshing] = useState(false);
//   const [copiedField, setCopiedField] = useState<string | null>(null);

//   const router = useRouter();
//   const supabase = createSupabaseBrowserClient();

//   useEffect(() => {
//     fetchWalletData();
//   }, []);

//   const fetchWalletData = async () => {
//     try {
//       setError(null);
//       const { data: { user: currentUser } } = await supabase.auth.getUser();
      
//       if (!currentUser) {
//         router.push("/sign-in");
//         return;
//       }

//       setUser({
//         id: currentUser.id,
//         email: currentUser.email ?? null,
//         created_at: currentUser.created_at,
//         user_metadata: currentUser.user_metadata,
//       });

//       // Fetch user profile
//       const { data: profileData } = await supabase
//         .from("profiles")
//         .select("*")
//         .eq("auth_user_id", currentUser.id)
//         .single();

//       setUserProfile(profileData);

//       // Fetch wallet data
//       const { data: walletFromDB, error: walletError } = await supabase
//         .from("wallets")
//         .select(`
//           id, 
//           circle_wallet_id, 
//           blockchain, 
//           wallet_address,
//           profiles!inner(auth_user_id)
//         `)
//         .eq("profiles.auth_user_id", currentUser.id)
//         .single();

//       if (walletError) {
//         if (walletError.code === 'PGRST116') {
//           setError("No wallet found for this user. Please contact support to set up your wallet.");
//           return;
//         } else {
//           setError("Failed to fetch wallet information");
//           return;
//         }
//       }

//       if (walletFromDB?.circle_wallet_id) {
//         try {
//           const balanceResponse = await fetch('/api/wallet/balance', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ walletId: walletFromDB.circle_wallet_id })
//           });

//           const balanceData = await balanceResponse.json();
          
//           const completeWalletData = {
//             ...walletFromDB,
//             balance: balanceData.balance || "0",
//             blockchain: walletFromDB.blockchain || "ETH-SEPOLIA",
//             currency: "USDC"
//           };

//           setWallet(completeWalletData);
//         } catch (circleApiError) {
//           const fallbackWalletData = {
//             ...walletFromDB,
//             balance: "0",
//             blockchain: walletFromDB.blockchain || "ETH-SEPOLIA",
//             currency: "USDC"
//           };
//           setWallet(fallbackWalletData);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching wallet data:", error);
//       setError("Failed to fetch wallet data. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const refreshBalance = async () => {
//     if (!wallet?.circle_wallet_id) return;
    
//     setRefreshing(true);
//     try {
//       const balanceResponse = await fetch('/api/wallet/balance', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ walletId: wallet.circle_wallet_id })
//       });

//       const balanceData = await balanceResponse.json();
      
//       setWallet(prev => prev ? {
//         ...prev,
//         balance: balanceData.balance || prev.balance
//       } : null);
//     } catch (error) {
//       console.error("Error refreshing balance:", error);
//     } finally {
//       setRefreshing(false);
//     }
//   };

//   const copyToClipboard = async (text: string, field: string) => {
//     try {
//       await navigator.clipboard.writeText(text);
//       setCopiedField(field);
//       setTimeout(() => setCopiedField(null), 2000);
//     } catch (err) {
//       console.error('Failed to copy text: ', err);
//     }
//   };

//   const formatAddress = (address: string) => {
//     if (!address) return "";
//     if (showFullAddress) return address;
//     return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
//   };

//   const calendarDays = Array.from({ length: 30 }, (_, i) => ({
//     day: String(i + 1),
//     date: i + 1,
//     highlighted: i + 1 === 15,
//     hasTransaction: [5, 12, 18, 25].includes(i + 1)
//   }));

//   if (loading) {
//     return (
//       <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white p-6">
//         <div className="max-w-7xl mx-auto">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {[...Array(6)].map((_, i) => (
//               <div key={i} className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 animate-pulse">
//                 <div className="h-4 bg-gray-600 rounded mb-4"></div>
//                 <div className="h-8 bg-gray-600 rounded mb-2"></div>
//                 <div className="h-6 bg-gray-600 rounded w-20"></div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white flex items-center justify-center p-6">
//         <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-8 max-w-md text-center">
//           <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
//           <h2 className="text-xl font-bold mb-2">Wallet Error</h2>
//           <p className="text-gray-300 mb-4">{error}</p>
//           <button 
//             onClick={fetchWalletData}
//             className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-medium transition-colors"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white">
//       {/* Background Elements */}
//       <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none"></div>
//       <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.1),transparent_50%)] pointer-events-none"></div>

//       {/* SideBar */}
//       <InteractiveSidebar/>

//       <div className="relative p-6 lg:p-8">
//         <div className="max-w-7xl mx-auto">

//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
//             {/* Main Content */}
//             <div className="lg:col-span-8 space-y-6">
//               {/* Wallet Balance & Info */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Balance Card */}
//                 <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6 relative overflow-hidden group">
//                   <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                   <div className="relative">
//                     <div className="flex items-center justify-between mb-4">
//                       <h3 className="text-lg font-semibold text-gray-200">Total Balance</h3>
//                       <div className="flex items-center gap-2">
//                         <button
//                           onClick={() => setShowBalance(!showBalance)}
//                           className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
//                         >
//                           {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
//                         </button>
//                         <button
//                           onClick={refreshBalance}
//                           disabled={refreshing}
//                           className="p-1.5 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
//                         >
//                           <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
//                         </button>
//                       </div>
//                     </div>
//                     <div className="space-y-2">
//                       <div className="text-3xl font-bold">
//                         {showBalance ? `${wallet?.balance || '0'} ${wallet?.currency || 'USDC'}` : '••••••••'}
//                       </div>
//                       <div className="flex items-center gap-2 text-sm">
//                         <div className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs border border-blue-500/30">
//                           {wallet?.blockchain || 'ETH-SEPOLIA'}
//                         </div>
//                         <div className="text-green-400 flex items-center gap-1">
//                           <TrendingUp className="w-3 h-3" />
//                           +2.5% today
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Wallet Status */}
//                 <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/80 transition-all duration-300">
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-lg font-semibold text-gray-200">Wallet Status</h3>
//                     <div className="flex items-center gap-2">
//                       <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//                       <span className="text-green-400 text-sm font-medium">Active</span>
//                     </div>
//                   </div>
//                   <div className="space-y-3">
//                     <div className="flex items-center justify-between">
//                       <span className="text-gray-400">Security Level</span>
//                       <div className="flex items-center gap-2">
//                         <Shield className="w-4 h-4 text-green-400" />
//                         <span className="text-green-400 font-medium">High</span>
//                       </div>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <span className="text-gray-400">Last Activity</span>
//                       <span className="text-white">2 hours ago</span>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <span className="text-gray-400">Network</span>
//                       <span className="text-white">{wallet?.blockchain}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Wallet Address & Details */}
//               <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
//                 <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//                   <CreditCard className="w-5 h-5 text-blue-400" />
//                   Wallet Details
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-4">
//                     <div>
//                       <label className="text-sm text-gray-400 mb-2 block">Wallet ID</label>
//                       <div className="flex items-center gap-2 p-3 bg-gray-700/50 rounded-lg border border-gray-600/50">
//                         <code className="flex-1 text-sm text-white font-mono">
//                           {wallet?.id ? `${wallet.id.substring(0, 8)}...${wallet.id.substring(wallet.id.length - 8)}` : 'N/A'}
//                         </code>
//                         <button
//                           onClick={() => wallet?.id && copyToClipboard(wallet.id, 'id')}
//                           className="p-1.5 hover:bg-gray-600/50 rounded-lg transition-colors"
//                         >
//                           {copiedField === 'id' ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
//                         </button>
//                       </div>
//                     </div>

//                     <div>
//                       <label className="text-sm text-gray-400 mb-2 block">Circle Wallet ID</label>
//                       <div className="flex items-center gap-2 p-3 bg-gray-700/50 rounded-lg border border-gray-600/50">
//                         <code className="flex-1 text-sm text-white font-mono">
//                           {wallet?.circle_wallet_id ? `${wallet.circle_wallet_id.substring(0, 8)}...${wallet.circle_wallet_id.substring(wallet.circle_wallet_id.length - 8)}` : 'N/A'}
//                         </code>
//                         <button
//                           onClick={() => wallet?.circle_wallet_id && copyToClipboard(wallet.circle_wallet_id, 'circle_id')}
//                           className="p-1.5 hover:bg-gray-600/50 rounded-lg transition-colors"
//                         >
//                           {copiedField === 'circle_id' ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
//                         </button>
//                       </div>
//                     </div>
//                   </div>

//                   <div>
//                     <label className="text-sm text-gray-400 mb-2 block flex items-center gap-2">
//                       Wallet Address
//                       <button
//                         onClick={() => setShowFullAddress(!showFullAddress)}
//                         className="text-blue-400 hover:text-blue-300 text-xs underline"
//                       >
//                         {showFullAddress ? 'Show Short' : 'Show Full'}
//                       </button>
//                     </label>
//                     <div className="flex items-center gap-2 p-3 bg-gray-700/50 rounded-lg border border-gray-600/50">
//                       <code className="flex-1 text-sm text-white font-mono break-all">
//                         {wallet?.wallet_address ? formatAddress(wallet.wallet_address) : 'N/A'}
//                       </code>
//                       <div className="flex items-center gap-1 flex-shrink-0">
//                         <button
//                           onClick={() => wallet?.wallet_address && copyToClipboard(wallet.wallet_address, 'address')}
//                           className="p-1.5 hover:bg-gray-600/50 rounded-lg transition-colors"
//                         >
//                           {copiedField === 'address' ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
//                         </button>
//                         <button
//                           onClick={() => window.open(`https://sepolia.etherscan.io/address/${wallet?.wallet_address}`, '_blank')}
//                           className="p-1.5 hover:bg-gray-600/50 rounded-lg transition-colors"
//                         >
//                           <ExternalLink className="w-4 h-4 text-gray-400" />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* User Profile Information */}
//               <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
//                 <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//                   <User className="w-5 h-5 text-green-400" />
//                   Account Information
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-4">
//                     <div>
//                       <label className="text-sm text-gray-400 mb-2 block">Full Name</label>
//                       <div className="p-3 bg-gray-700/50 rounded-lg border border-gray-600/50">
//                         <span className="text-white">{userProfile?.full_name || user?.user_metadata?.full_name || 'Not provided'}</span>
//                       </div>
//                     </div>

//                     <div>
//                       <label className="text-sm text-gray-400 mb-2 block">Email Address</label>
//                       <div className="flex items-center gap-2 p-3 bg-gray-700/50 rounded-lg border border-gray-600/50">
//                         <Mail className="w-4 h-4 text-gray-400" />
//                         <span className="text-white">{user?.email || 'Not provided'}</span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="space-y-4">
//                     <div>
//                       <label className="text-sm text-gray-400 mb-2 block">User ID</label>
//                       <div className="flex items-center gap-2 p-3 bg-gray-700/50 rounded-lg border border-gray-600/50">
//                         <code className="flex-1 text-sm text-white font-mono">
//                           {user?.id ? `${user.id.substring(0, 8)}...${user.id.substring(user.id.length - 8)}` : 'N/A'}
//                         </code>
//                         <button
//                           onClick={() => user?.id && copyToClipboard(user.id, 'user_id')}
//                           className="p-1.5 hover:bg-gray-600/50 rounded-lg transition-colors"
//                         >
//                           {copiedField === 'user_id' ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
//                         </button>
//                       </div>
//                     </div>

//                     <div>
//                       <label className="text-sm text-gray-400 mb-2 block">Account Created</label>
//                       <div className="p-3 bg-gray-700/50 rounded-lg border border-gray-600/50">
//                         <span className="text-white">
//                           {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { 
//                             year: 'numeric', 
//                             month: 'long', 
//                             day: 'numeric' 
//                           }) : 'Unknown'}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Sidebar */}
//             <div className="lg:col-span-4 space-y-6">
//               {/* Quick Actions */}
//               <div className="space-y-4">
//               <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
//               <div className="grid grid-cols-1 gap-3">
//                 <button className="group flex items-center justify-center gap-3 bg-blue-600/80 hover:bg-blue-600 backdrop-blur-sm border border-blue-500/30 rounded-xl py-4 px-6 font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-600/25">
//                   <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
//                   <span>Create New Escrow</span>
//                   <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
//                 </button>
                
//                 <button className="group flex items-center justify-center gap-3 bg-gray-700/60 hover:bg-gray-700 backdrop-blur-sm border border-gray-600/50 rounded-xl py-4 px-6 font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-gray-700/25">
//                   <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform duration-200" />
//                   <span>Release Funds</span>
//                   <ArrowDownRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
//                 </button>
//               </div>
//             </div>

//               {/* Calendar */}
//               <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
//                 <div className="flex items-center justify-between mb-6">
//                   <div className="flex items-center gap-2">
//                     <Calendar className="w-5 h-5 text-blue-400" />
//                     <h3 className="font-semibold text-white">Transaction Calendar</h3>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <button className="p-1.5 hover:bg-gray-700/50 rounded-lg transition-colors">
//                       <ChevronLeft className="w-4 h-4 text-gray-400" />
//                     </button>
//                     <span className="text-sm font-medium text-gray-200 px-3">{currentMonth} 2024</span>
//                     <button className="p-1.5 hover:bg-gray-700/50 rounded-lg transition-colors">
//                       <ChevronRight className="w-4 h-4 text-gray-400" />
//                     </button>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-7 gap-1 mb-3">
//                   {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
//                     <div key={index} className="text-center text-xs font-semibold text-gray-400 py-2">
//                       {day}
//                     </div>
//                   ))}
//                 </div>

//                 <div className="grid grid-cols-7 gap-1">
//                   {calendarDays.map((day, index) => (
//                     <div
//                       key={index}
//                       className={`relative text-center text-sm py-2 cursor-pointer rounded-lg transition-all duration-200 ${
//                         day.date === 15
//                           ? "bg-blue-600 text-white shadow-md"
//                           : day.hasTransaction
//                           ? "bg-green-600/20 text-green-300 border border-green-500/30"
//                           : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
//                       }`}
//                     >
//                       {day.day}
//                       {day.hasTransaction && (
//                         <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-400 rounded-full"></div>
//                       )}
//                     </div>
//                   ))}
//                 </div>

//                 <div className="mt-4 p-3 bg-blue-600/10 border border-blue-500/20 rounded-lg">
//                   <div className="flex items-center gap-2 text-sm">
//                     <div className="w-2 h-2 bg-green-400 rounded-full"></div>
//                     <span className="text-gray-300">Days with transactions</span>
//                   </div>
//                 </div>
//               </div>

//               {/* AI Assistant */}
//               <div className="relative overflow-hidden bg-gradient-to-br from-purple-600/80 to-purple-800/80 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 group">
//                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(168,85,247,0.3),transparent_70%)]"></div>
//                 <div className="relative">
//                   <div className="flex items-center justify-center mb-4">
//                     <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30 group-hover:scale-110 transition-transform duration-300">
//                       <Zap className="w-6 h-6 text-white" />
//                     </div>
//                   </div>
//                   <h3 className="text-lg font-bold text-center mb-2">Paycasso AI Assistant</h3>
//                   <p className="text-purple-100 text-sm text-center mb-4">
//                     Get insights about your wallet activity and transactions
//                   </p>
//                   <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-lg py-2.5 px-4 text-sm font-medium text-white transition-all duration-200 hover:scale-[1.02]">
//                     Ask AI About My Wallet
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";
import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { useRouter } from "next/navigation";
import {
  Copy,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Download,
  Bell,
  ChevronDown,
  ArrowUpCircle,
  RefreshCcw,
  ArrowDownCircle,
  ArrowDownUp,
} from "lucide-react";
import InteractiveSidebar from "@/components/dashboard/sidebar";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { CircularProgressbar as ReactCircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { motion, AnimatePresence } from "framer-motion";
import { Menu } from "@headlessui/react";

interface WalletData {
  id: string;
  circle_wallet_id: string;
  blockchain: string;
  wallet_address: string;
  balance: string;
  currency: string;
  profiles?: unknown;
}

interface UserProfile {
  auth_user_id: string;
  email?: string;
  phone?: string;
  full_name?: string;
  avatar_url?: string;
}

interface SupabaseUser {
  id: string;
  email: string | null;
  created_at: string;
  user_metadata: {
    full_name?: string;
  };
}

export default function WalletInfoPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState("This Week");
  const [btcAmount, setBtcAmount] = useState("0.040");
  const [usdcAmount, setUsdcAmount] = useState("1246");

  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const balanceChartData = [
    { day: "Mon", value: 14200 },
    { day: "Tue", value: 14500 },
    { day: "Wed", value: 14800 },
    { day: "Thu", value: 15100 },
    { day: "Fri", value: 15000 },
    { day: "Sat", value: 15200 },
    { day: "Sun", value: 15230 },
  ];

  const spendingData = [
    { day: "Mon", amount: 450 },
    { day: "Tues", amount: 380 },
    { day: "Wed", amount: 520 },
    { day: "Thu", amount: 1000 },
    { day: "Fri", amount: 680 },
    { day: "Sat", amount: 750 },
    { day: "Sun", amount: 420 },
  ];

  const transactions = [
    {
      id: 1,
      name: "Aaron Evans",
      status: "Completed",
      date: "March 29, 2022",
      amount: 45,
      avatar: "AE",
    },
    {
      id: 2,
      name: "Clement Stewart",
      status: "Completed",
      date: "March 27, 2022",
      amount: -241,
      avatar: "CS",
    },
    {
      id: 3,
      name: "Jessica Johanne",
      status: "Disputed",
      date: "March 25, 2022",
      amount: 100,
      avatar: "JJ",
    },
    {
      id: 4,
      name: "Jessica Johanne",
      status: "Pending",
      date: "March 25, 2022",
      amount: 100,
      avatar: "JJ",
    },
  ];

  useEffect(() => {
    fetchWalletData();
    fetchCryptoData();
  }, []);

  const fetchCryptoData = async () => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum,bitcoin,binancecoin,solana,avalanche-2&order=market_cap_desc&sparkline=true"
      );
      const data = await response.json();
      setCryptoData(data);
    } catch (error) {
      console.error("Error fetching crypto data:", error);
    }
  };

  const fetchWalletData = async () => {
    try {
      setError(null);
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      if (!currentUser) {
        router.push("/sign-in");
        return;
      }

      setUser({
        id: currentUser.id,
        email: currentUser.email ?? null,
        created_at: currentUser.created_at,
        user_metadata: currentUser.user_metadata,
      });

      // Fetch user profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("auth_user_id", currentUser.id)
        .single();

      setUserProfile(profileData);

      // Fetch wallet data
      const { data: walletFromDB, error: walletError } = await supabase
        .from("wallets")
        .select(
          `id, circle_wallet_id, blockchain, wallet_address, profiles!inner(auth_user_id)`
        )
        .eq("profiles.auth_user_id", currentUser.id)
        .single();

      if (walletError) {
        if (walletError.code === "PGRST116") {
          setError("No wallet found. Please contact support.");
          return;
        }
        setError("Failed to fetch wallet information");
        return;
      }

      if (walletFromDB?.circle_wallet_id) {
        try {
          const balanceResponse = await fetch("/api/wallet/balance", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ walletId: walletFromDB.circle_wallet_id }),
          });
          const balanceData = await balanceResponse.json();
          setWallet({
            ...walletFromDB,
            balance: balanceData.balance || "0",
            blockchain: walletFromDB.blockchain || "ETH-SEPOLIA",
            currency: "USD",
          });
        } catch {
          setWallet({
            ...walletFromDB,
            balance: "0",
            blockchain: walletFromDB.blockchain || "ETH-SEPOLIA",
            currency: "USD",
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to fetch wallet data.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.substring(0, 8)}...${address.substring(
      address.length - 6
    )}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "text-green-400";
      case "Pending":
        return "text-yellow-400";
      case "Disputed":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-400";
      case "Pending":
        return "bg-yellow-400";
      case "Disputed":
        return "bg-red-400";
      default:
        return "bg-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-[#0a0a0a] text-white flex items-center justify-center p-6">
        <div className="relative bg-white/[0.03] backdrop-blur-xl backdrop-saturate-150 border border-white/20 rounded-2xl p-6 max-w-md text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Wallet Error</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={fetchWalletData}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-[#0a0a0a] text-white overflow-hidden">
      <InteractiveSidebar />

      {/* Header */}
      <div className="ml-[88px] px-8 py-5 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Wallet Overview</h1>
        <div className="flex items-center gap-4">
          <button className="relative bg-white/[0.03] backdrop-blur-xl border border-white/20 rounded-full p-2.5 hover:bg-white/[0.08] transition-all">
            <Bell className="w-5 h-5" />
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
              5
            </div>
          </button>
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center gap-2 bg-white/[0.03] backdrop-blur-xl border border-white/20 rounded-full py-2 px-4 hover:bg-white/[0.08] transition-all">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-sm font-semibold">
                VS
              </div>
              <span className="text-sm font-medium">Vicky Shaw</span>
              <ChevronDown className="w-4 h-4" />
            </Menu.Button>
          </Menu>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-[88px] px-8 pb-6 h-[calc(100vh-80px)]">
        <div className="grid grid-cols-12 gap-8 h-full">
          {/* Left Column */}
          <div className="col-span-7 flex flex-col gap-6 h-full overflow-hidden">
            {/* Top Row: Balance + Spending */}
            <div className="grid grid-cols-2 gap-6 h-[40%]">
              {/* Balance Card */}
              <div className="relative bg-white/[0.03] backdrop-blur-xl backdrop-saturate-150 border border-white/20 rounded-3xl p-6 shadow-lg shadow-black/10 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 left-0 right-0 h-[50%] bg-gradient-to-b from-white/10 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-transparent"></div>
                </div>
                <div className="absolute inset-0 rounded-3xl shadow-inner shadow-black/5"></div>

                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-2">
                        Total Balance
                      </h3>
                      <div className="text-4xl font-bold mb-2">
                        {wallet?.balance || "0"} {wallet?.currency || "USD"}
                      </div>
                      <div className="inline-flex items-center gap-1 bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-medium">
                        Last Day +5.3%
                      </div>
                    </div>
                    <div className="w-32 h-20">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={balanceChartData}>
                          <defs>
                            <linearGradient
                              id="colorValue"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#6366f1"
                                stopOpacity={0.4}
                              />
                              <stop
                                offset="95%"
                                stopColor="#6366f1"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#6366f1"
                            strokeWidth={2}
                            fill="url(#colorValue)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="mt-auto space-y-2">
                    <button
                      onClick={() => setShowWalletModal(true)}
                      className="w-full relative bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 hover:bg-white/15 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Copy className="w-4 h-4 text-gray-300" />
                          <span className="text-xs font-medium text-gray-400">
                            Address
                          </span>
                        </div>
                        <code className="text-xs font-mono text-white">
                          {wallet?.wallet_address
                            ? formatAddress(wallet.wallet_address)
                            : "0x5df7...f9f5"}
                        </code>
                      </div>
                    </button>

                    <button className="w-full relative bg-white backdrop-blur-md rounded-xl p-3 hover:bg-white/90 transition-all shadow-lg">
                      <div className="flex items-center justify-center gap-2">
                        <ArrowUpCircle className="w-5 h-5 text-black" />
                        <span className="text-sm font-semibold text-black">
                          Deposit
                        </span>
                      </div>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button className="relative bg-white backdrop-blur-md rounded-xl p-3 hover:bg-white/90 transition-all shadow-lg">
                        <div className="flex items-center justify-center gap-2">
                          <RefreshCcw className="w-4 h-4 text-black" />
                          <span className="text-sm font-semibold text-black">
                            Swap
                          </span>
                        </div>
                      </button>
                      <button className="relative bg-white backdrop-blur-md rounded-xl p-3 hover:bg-white/90 transition-all shadow-lg">
                        <div className="flex items-center justify-center gap-2">
                          <ArrowDownCircle className="w-4 h-4 text-black" />
                          <span className="text-sm font-semibold text-black">
                            Withdraw
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Your Spendings */}
              <div className="relative bg-white/[0.03] backdrop-blur-xl backdrop-saturate-150 border border-white/20 rounded-3xl p-6 shadow-lg shadow-black/10 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 left-0 right-0 h-[50%] bg-gradient-to-b from-white/10 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-transparent"></div>
                </div>
                <div className="absolute inset-0 rounded-3xl shadow-inner shadow-black/5"></div>

                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-base font-semibold">
                        Your Spendings
                      </h3>
                      <p className="text-xs text-gray-400">Total spend</p>
                      <div className="text-3xl font-bold mt-1">$1000K</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 hover:bg-white/15 transition-all">
                        📊
                      </button>
                      <button className="flex items-center gap-1 bg-white/10 backdrop-blur-md rounded-lg px-3 py-1.5 text-xs border border-white/20 hover:bg-white/15 transition-all">
                        {selectedPeriod} <ChevronDown className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={spendingData}>
                        <Bar
                          dataKey="amount"
                          fill="#a78bfa"
                          radius={[8, 8, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
                    {spendingData.map((item) => (
                      <span key={item.day}>{item.day.substring(0, 3)}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="relative bg-white/[0.03] backdrop-blur-xl backdrop-saturate-150 border border-white/20 rounded-3xl shadow-lg shadow-black/10 overflow-hidden flex-1">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 right-0 h-[30%] bg-gradient-to-b from-white/10 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-transparent"></div>
              </div>
              <div className="absolute inset-0 rounded-3xl shadow-inner shadow-black/5"></div>

              <div className="relative z-10 p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-semibold">Recent Transactions</h3>
                  <ExternalLink className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white transition-colors" />
                </div>
                <div className="flex-1 overflow-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left pb-3 text-xs font-medium text-gray-400">
                          Name
                        </th>
                        <th className="text-left pb-3 text-xs font-medium text-gray-400">
                          Status
                        </th>
                        <th className="text-left pb-3 text-xs font-medium text-gray-400">
                          Date
                        </th>
                        <th className="text-right pb-3 text-xs font-medium text-gray-400">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx) => (
                        <tr
                          key={tx.id}
                          className="border-b border-white/5 hover:bg-white/5 transition-colors"
                        >
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center text-xs font-semibold shadow-lg">
                                {tx.avatar}
                              </div>
                              <span className="font-medium">{tx.name}</span>
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-2 h-2 rounded-full ${getStatusDot(
                                  tx.status
                                )}`}
                              ></div>
                              <span
                                className={`text-sm ${getStatusColor(
                                  tx.status
                                )}`}
                              >
                                {tx.status}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 text-sm text-gray-400">
                            {tx.date}
                          </td>
                          <td
                            className={`py-4 text-right font-semibold ${
                              tx.amount > 0 ? "text-green-400" : "text-white"
                            }`}
                          >
                            {tx.amount > 0 ? "+" : ""}${Math.abs(tx.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-span-5 flex flex-col gap-6 h-full overflow-hidden">
            {/* Row 1: Live Prices + Exchange */}
            <div className="grid grid-cols-2 gap-6 h-[45%]">
              {/* Live Prices */}
              <div className="relative bg-white/[0.03] backdrop-blur-xl backdrop-saturate-150 border border-white/20 rounded-3xl p-5 shadow-lg shadow-black/10 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 left-0 right-0 h-[50%] bg-gradient-to-b from-white/10 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-transparent"></div>
                </div>
                <div className="absolute inset-0 rounded-3xl shadow-inner shadow-black/5"></div>

                <div className="relative z-10 h-full flex flex-col">
                  <h3 className="text-base font-semibold mb-4">Live Prices</h3>
                  <div className="flex-1 space-y-3">
                    {cryptoData.slice(0, 5).map((crypto) => (
                      <div
                        key={crypto.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold">
                            {crypto.symbol.toUpperCase().substring(0, 1)}
                          </div>
                          <div>
                            <div className="text-xs font-semibold">
                              {crypto.symbol.toUpperCase()}
                            </div>
                            <div className="text-[10px] text-gray-400">
                              {crypto.name}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-semibold">
                            ${crypto.current_price.toLocaleString()}
                          </div>
                          <div
                            className={`text-[10px] font-semibold ${
                              crypto.price_change_percentage_24h > 0
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {crypto.price_change_percentage_24h > 0 ? "+" : ""}
                            {crypto.price_change_percentage_24h.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Exchange - WITH BOTTOM PADDING */}
              <div className="relative bg-white/[0.03] backdrop-blur-xl backdrop-saturate-150 border border-white/20 rounded-3xl p-5 pb-6 shadow-lg shadow-black/10 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 left-0 right-0 h-[50%] bg-gradient-to-b from-white/10 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-transparent"></div>
                </div>
                <div className="absolute inset-0 rounded-3xl shadow-inner shadow-black/5"></div>

                <div className="relative z-10 h-full flex flex-col">
                  <h3 className="text-base font-semibold mb-4">Exchange</h3>

                  {/* BTC Section */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold">₿</span>
                        </div>
                        <div>
                          <div className="text-sm font-semibold">BTC</div>
                          <div className="text-[10px] text-gray-400">
                            1 BTC = $57234
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-blue-400 font-medium">
                        You Send
                      </div>
                    </div>
                    <input
                      type="text"
                      value={btcAmount}
                      onChange={(e) => setBtcAmount(e.target.value)}
                      className="w-full bg-transparent text-3xl font-bold text-white outline-none mb-3"
                    />
                  </div>

                  {/* Arrow Icon - RIGHT SIDE */}
                  <div className="flex justify-end mb-3">
                    <button className="p-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 hover:bg-white/15 transition-all">
                      <ArrowDownUp className="w-4 h-4" />
                    </button>
                  </div>

                  {/* USDC Section */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold">$</span>
                        </div>
                        <div>
                          <div className="text-sm font-semibold">USDC</div>
                          <div className="text-[10px] text-gray-400">
                            1 USDC = $1
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-blue-400 font-medium">
                        You Get
                      </div>
                    </div>
                    <input
                      type="text"
                      value={usdcAmount}
                      onChange={(e) => setUsdcAmount(e.target.value)}
                      className="w-full bg-transparent text-3xl font-bold text-white outline-none mb-3"
                    />
                  </div>

                  {/* Buy USDC Button with proper spacing */}
                  <button className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl py-3 text-sm font-semibold transition-all mt-auto">
                    Buy USDC
                  </button>
                </div>
              </div>
            </div>

            {/* Trust Meter - WITH BOTTOM PADDING */}
            <div className="relative bg-white/[0.03] backdrop-blur-xl backdrop-saturate-150 border border-white/20 rounded-3xl p-6 pb-7 shadow-lg shadow-black/10 overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 right-0 h-[50%] bg-gradient-to-b from-white/10 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-transparent"></div>
              </div>
              <div className="absolute inset-0 rounded-3xl shadow-inner shadow-black/5"></div>

              <div className="relative z-10">
                <h3 className="text-lg font-semibold mb-6">
                  Trust Meter & Dispute Stats
                </h3>
                <div className="flex items-center gap-8">
                  {/* Stats on LEFT */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="text-xs text-gray-400 mb-1">
                        Dispute Win Rate
                      </div>
                      <div className="text-3xl font-bold">100%</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">
                        Successful Escrows
                      </div>
                      <div className="text-3xl font-bold">22</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">
                        Avg. Resolution Time
                      </div>
                      <div className="text-3xl font-bold">4.2hrs</div>
                    </div>
                  </div>

                  {/* Circular Progress on RIGHT */}
                  <div className="flex flex-col items-center">
                    <div className="w-36 h-36 mb-3">
                      <ReactCircularProgressbar
                        value={40}
                        text="40%"
                        styles={buildStyles({
                          pathColor: "#6366f1",
                          textColor: "#fff",
                          trailColor: "rgba(255,255,255,0.1)",
                          textSize: "22px",
                        })}
                      />
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-medium text-gray-400">
                        Trust Score
                      </div>
                      <div className="text-xs text-green-400 font-medium mt-1">
                        Trusted by 65% users
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-400">
                Quick Actions
              </h3>
              <button className="w-full relative bg-blue-600/90 backdrop-blur-xl border border-blue-500/30 rounded-2xl py-4 hover:bg-blue-600 transition-all overflow-hidden shadow-lg">
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 left-0 right-0 h-[50%] bg-gradient-to-b from-white/10 to-transparent"></div>
                </div>
                <div className="relative z-10 flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5" />
                  <span className="text-sm font-semibold">New Escrow</span>
                </div>
              </button>
              <button className="w-full relative bg-white/[0.05] backdrop-blur-xl border border-white/20 rounded-2xl py-4 hover:bg-white/[0.08] transition-all overflow-hidden shadow-lg">
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 left-0 right-0 h-[50%] bg-gradient-to-b from-white/10 to-transparent"></div>
                </div>
                <div className="relative z-10 flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" />
                  <span className="text-sm font-semibold">Release Funds</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Modal */}
      <AnimatePresence>
        {showWalletModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowWalletModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative bg-white/[0.03] backdrop-blur-xl backdrop-saturate-150 border border-white/20 rounded-3xl p-8 max-w-lg w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 right-0 h-[50%] bg-gradient-to-b from-white/10 to-transparent rounded-3xl"></div>
              </div>
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-6">Wallet Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-400 mb-2 block">
                      Wallet Address
                    </label>
                    <div className="flex items-center gap-2 p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
                      <code className="flex-1 text-sm font-mono">
                        {wallet?.wallet_address || "adadasdqwdwqdqwe@#ad2"}
                      </code>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            wallet?.wallet_address || "",
                            "address"
                          )
                        }
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        {copiedField === "address" ? (
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                        ) : (
                          <Copy className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-400 mb-2 block">
                        Blockchain
                      </label>
                      <div className="p-4 bg-white/5 backdrop-blur-md rounded-xl text-sm border border-white/10">
                        {wallet?.blockchain || "ETH-SEPOLIA"}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-2 block">
                        Currency
                      </label>
                      <div className="p-4 bg-white/5 backdrop-blur-md rounded-xl text-sm border border-white/10">
                        {wallet?.currency || "USD"}
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowWalletModal(false)}
                  className="mt-6 w-full bg-blue-600 hover:bg-blue-700 rounded-xl py-3 text-sm font-semibold transition-all shadow-lg"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
