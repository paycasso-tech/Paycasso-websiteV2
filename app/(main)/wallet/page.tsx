"use client"
import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { useRouter } from "next/navigation";
import {
  Wallet,
  Copy,
  ExternalLink,
  Shield,
  TrendingUp,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Send,
  Download,
  RefreshCw,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Zap,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  ArrowDownRight,
} from "lucide-react";
import InteractiveSidebar from "@/components/dashboard/sidebar";

interface WalletData {
  id: string;
  circle_wallet_id: string;
  blockchain: string;
  wallet_address: string;
  balance: string;
  currency: string;
  profiles?: any;
}

interface UserProfile {
  auth_user_id: string;
  email?: string;
  phone?: string;
  full_name?: string;
  avatar_url?: string;
}

export default function WalletInfoPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFullAddress, setShowFullAddress] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [currentMonth, setCurrentMonth] = useState("January");
  const [refreshing, setRefreshing] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      setError(null);
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) {
        router.push("/sign-in");
        return;
      }

      setUser(currentUser);

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
        if (walletError.code === 'PGRST116') {
          setError("No wallet found for this user. Please contact support to set up your wallet.");
          return;
        } else {
          setError("Failed to fetch wallet information");
          return;
        }
      }

      if (walletFromDB?.circle_wallet_id) {
        try {
          const balanceResponse = await fetch('/api/wallet/balance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ walletId: walletFromDB.circle_wallet_id })
          });

          const balanceData = await balanceResponse.json();
          
          const completeWalletData = {
            ...walletFromDB,
            balance: balanceData.balance || "0",
            blockchain: walletFromDB.blockchain || "ETH-SEPOLIA",
            currency: "USDC"
          };

          setWallet(completeWalletData);
        } catch (circleApiError) {
          const fallbackWalletData = {
            ...walletFromDB,
            balance: "0",
            blockchain: walletFromDB.blockchain || "ETH-SEPOLIA",
            currency: "USDC"
          };
          setWallet(fallbackWalletData);
        }
      }
    } catch (error) {
      console.error("Error fetching wallet data:", error);
      setError("Failed to fetch wallet data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const refreshBalance = async () => {
    if (!wallet?.circle_wallet_id) return;
    
    setRefreshing(true);
    try {
      const balanceResponse = await fetch('/api/wallet/balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletId: wallet.circle_wallet_id })
      });

      const balanceData = await balanceResponse.json();
      
      setWallet(prev => prev ? {
        ...prev,
        balance: balanceData.balance || prev.balance
      } : null);
    } catch (error) {
      console.error("Error refreshing balance:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const formatAddress = (address: string) => {
    if (!address) return "";
    if (showFullAddress) return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const calendarDays = Array.from({ length: 30 }, (_, i) => ({
    day: String(i + 1),
    date: i + 1,
    highlighted: i + 1 === 15,
    hasTransaction: [5, 12, 18, 25].includes(i + 1)
  }));

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 animate-pulse">
                <div className="h-4 bg-gray-600 rounded mb-4"></div>
                <div className="h-8 bg-gray-600 rounded mb-2"></div>
                <div className="h-6 bg-gray-600 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white flex items-center justify-center p-6">
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-8 max-w-md text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Wallet Error</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button 
            onClick={fetchWalletData}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.1),transparent_50%)] pointer-events-none"></div>

      {/* SideBar */}
      <InteractiveSidebar/>

      <div className="relative p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-8 space-y-6">
              {/* Wallet Balance & Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Balance Card */}
                <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-200">Total Balance</h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowBalance(!showBalance)}
                          className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={refreshBalance}
                          disabled={refreshing}
                          className="p-1.5 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-3xl font-bold">
                        {showBalance ? `${wallet?.balance || '0'} ${wallet?.currency || 'USDC'}` : '••••••••'}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs border border-blue-500/30">
                          {wallet?.blockchain || 'ETH-SEPOLIA'}
                        </div>
                        <div className="text-green-400 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          +2.5% today
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Wallet Status */}
                <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/80 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-200">Wallet Status</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-sm font-medium">Active</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Security Level</span>
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 font-medium">High</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Last Activity</span>
                      <span className="text-white">2 hours ago</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Network</span>
                      <span className="text-white">{wallet?.blockchain}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Wallet Address & Details */}
              <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-400" />
                  Wallet Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Wallet ID</label>
                      <div className="flex items-center gap-2 p-3 bg-gray-700/50 rounded-lg border border-gray-600/50">
                        <code className="flex-1 text-sm text-white font-mono">
                          {wallet?.id ? `${wallet.id.substring(0, 8)}...${wallet.id.substring(wallet.id.length - 8)}` : 'N/A'}
                        </code>
                        <button
                          onClick={() => wallet?.id && copyToClipboard(wallet.id, 'id')}
                          className="p-1.5 hover:bg-gray-600/50 rounded-lg transition-colors"
                        >
                          {copiedField === 'id' ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Circle Wallet ID</label>
                      <div className="flex items-center gap-2 p-3 bg-gray-700/50 rounded-lg border border-gray-600/50">
                        <code className="flex-1 text-sm text-white font-mono">
                          {wallet?.circle_wallet_id ? `${wallet.circle_wallet_id.substring(0, 8)}...${wallet.circle_wallet_id.substring(wallet.circle_wallet_id.length - 8)}` : 'N/A'}
                        </code>
                        <button
                          onClick={() => wallet?.circle_wallet_id && copyToClipboard(wallet.circle_wallet_id, 'circle_id')}
                          className="p-1.5 hover:bg-gray-600/50 rounded-lg transition-colors"
                        >
                          {copiedField === 'circle_id' ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 mb-2 block flex items-center gap-2">
                      Wallet Address
                      <button
                        onClick={() => setShowFullAddress(!showFullAddress)}
                        className="text-blue-400 hover:text-blue-300 text-xs underline"
                      >
                        {showFullAddress ? 'Show Short' : 'Show Full'}
                      </button>
                    </label>
                    <div className="flex items-center gap-2 p-3 bg-gray-700/50 rounded-lg border border-gray-600/50">
                      <code className="flex-1 text-sm text-white font-mono break-all">
                        {wallet?.wallet_address ? formatAddress(wallet.wallet_address) : 'N/A'}
                      </code>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => wallet?.wallet_address && copyToClipboard(wallet.wallet_address, 'address')}
                          className="p-1.5 hover:bg-gray-600/50 rounded-lg transition-colors"
                        >
                          {copiedField === 'address' ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                        </button>
                        <button
                          onClick={() => window.open(`https://sepolia.etherscan.io/address/${wallet?.wallet_address}`, '_blank')}
                          className="p-1.5 hover:bg-gray-600/50 rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Profile Information */}
              <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-green-400" />
                  Account Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Full Name</label>
                      <div className="p-3 bg-gray-700/50 rounded-lg border border-gray-600/50">
                        <span className="text-white">{userProfile?.full_name || user?.user_metadata?.full_name || 'Not provided'}</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Email Address</label>
                      <div className="flex items-center gap-2 p-3 bg-gray-700/50 rounded-lg border border-gray-600/50">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-white">{user?.email || 'Not provided'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">User ID</label>
                      <div className="flex items-center gap-2 p-3 bg-gray-700/50 rounded-lg border border-gray-600/50">
                        <code className="flex-1 text-sm text-white font-mono">
                          {user?.id ? `${user.id.substring(0, 8)}...${user.id.substring(user.id.length - 8)}` : 'N/A'}
                        </code>
                        <button
                          onClick={() => user?.id && copyToClipboard(user.id, 'user_id')}
                          className="p-1.5 hover:bg-gray-600/50 rounded-lg transition-colors"
                        >
                          {copiedField === 'user_id' ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Account Created</label>
                      <div className="p-3 bg-gray-700/50 rounded-lg border border-gray-600/50">
                        <span className="text-white">
                          {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          }) : 'Unknown'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              {/* Quick Actions */}
              <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-3">
                <button className="group flex items-center justify-center gap-3 bg-blue-600/80 hover:bg-blue-600 backdrop-blur-sm border border-blue-500/30 rounded-xl py-4 px-6 font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-600/25">
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
                  <span>Create New Escrow</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
                
                <button className="group flex items-center justify-center gap-3 bg-gray-700/60 hover:bg-gray-700 backdrop-blur-sm border border-gray-600/50 rounded-xl py-4 px-6 font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-gray-700/25">
                  <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform duration-200" />
                  <span>Release Funds</span>
                  <ArrowDownRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>

              {/* Calendar */}
              <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    <h3 className="font-semibold text-white">Transaction Calendar</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 hover:bg-gray-700/50 rounded-lg transition-colors">
                      <ChevronLeft className="w-4 h-4 text-gray-400" />
                    </button>
                    <span className="text-sm font-medium text-gray-200 px-3">{currentMonth} 2024</span>
                    <button className="p-1.5 hover:bg-gray-700/50 rounded-lg transition-colors">
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-3">
                  {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                    <div key={index} className="text-center text-xs font-semibold text-gray-400 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => (
                    <div
                      key={index}
                      className={`relative text-center text-sm py-2 cursor-pointer rounded-lg transition-all duration-200 ${
                        day.date === 15
                          ? "bg-blue-600 text-white shadow-md"
                          : day.hasTransaction
                          ? "bg-green-600/20 text-green-300 border border-green-500/30"
                          : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                      }`}
                    >
                      {day.day}
                      {day.hasTransaction && (
                        <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-400 rounded-full"></div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-blue-600/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-300">Days with transactions</span>
                  </div>
                </div>
              </div>

              {/* AI Assistant */}
              <div className="relative overflow-hidden bg-gradient-to-br from-purple-600/80 to-purple-800/80 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(168,85,247,0.3),transparent_70%)]"></div>
                <div className="relative">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30 group-hover:scale-110 transition-transform duration-300">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-center mb-2">Paycasso AI Assistant</h3>
                  <p className="text-purple-100 text-sm text-center mb-4">
                    Get insights about your wallet activity and transactions
                  </p>
                  <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-lg py-2.5 px-4 text-sm font-medium text-white transition-all duration-200 hover:scale-[1.02]">
                    Ask AI About My Wallet
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}