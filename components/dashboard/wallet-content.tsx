"use client";

import { useEffect, useState } from "react";
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
import {
  CircularProgressbar as ReactCircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { motion, AnimatePresence } from "framer-motion";
import { Menu } from "@headlessui/react";

// Extend Window interface for MetaMask
declare global {
  interface Window {
    ethereum?: {
      request: (args: {
        method: string;
        params?: unknown[];
      }) => Promise<unknown>;
      isMetaMask?: boolean;
    };
  }
}

interface WalletData {
  id: string;
  circle_wallet_id: string;
  blockchain: string;
  wallet_address: string;
  balance: string;
  currency: string;
}

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
}

interface SelectedCrypto {
  symbol: string;
  name: string;
  price: number;
  image: string;
}

interface WalletContentProps {
  initialWalletData: WalletData;
  userEmail: string;
  userName?: string;
}

export default function WalletContent({
  initialWalletData,
  userEmail,
  userName,
}: WalletContentProps) {
  const [wallet, setWallet] = useState<WalletData | null>(initialWalletData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState("This Week");
  const [cryptoAmount, setCryptoAmount] = useState("0.040");
  const [usdcAmount, setUsdcAmount] = useState("1246");
  const [showCryptoDropdown, setShowCryptoDropdown] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState<SelectedCrypto>({
    symbol: "BTC",
    name: "Bitcoin",
    price: 57234,
    image: "",
  });

  const router = useRouter();

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
    fetchCryptoData();
    fetchWalletBalance();
  }, []);

  const fetchCryptoData = async () => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum,bitcoin,binancecoin,solana,avalanche-2&order=market_cap_desc&sparkline=true"
      );
      const data = await response.json();
      setCryptoData(data);

      const btc = data.find((c: CryptoData) => c.symbol === "btc");
      if (btc) {
        setSelectedCrypto({
          symbol: btc.symbol.toUpperCase(),
          name: btc.name,
          price: btc.current_price,
          image: btc.image,
        });
      }
    } catch (error) {
      console.error("Error fetching crypto data:", error);
    }
  };

  const calculateUSDC = (amount: string) => {
    const numAmount = parseFloat(amount) || 0;
    const usdValue = numAmount * selectedCrypto.price;
    setUsdcAmount(usdValue.toFixed(2));
  };

  const handleCryptoAmountChange = (value: string) => {
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setCryptoAmount(value);
      calculateUSDC(value);
    }
  };

  const handleCryptoSelect = (crypto: CryptoData) => {
    setSelectedCrypto({
      symbol: crypto.symbol.toUpperCase(),
      name: crypto.name,
      price: crypto.current_price,
      image: crypto.image,
    });
    setShowCryptoDropdown(false);
    calculateUSDC(cryptoAmount);
  };

  const handleBuyUSDC = async () => {
    try {
      if (typeof window.ethereum === "undefined") {
        alert("Please install MetaMask to continue!");
        window.open("https://metamask.io/download/", "_blank");
        return;
      }

      const accounts = (await window.ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];

      if (!accounts || accounts.length === 0) {
        alert("Please unlock MetaMask first.");
        return;
      }

      if (!cryptoAmount || parseFloat(cryptoAmount) <= 0) {
        alert("Please enter a valid amount to swap.");
        return;
      }

      const TOKEN_ADDRESSES: { [key: string]: string } = {
        ETH: "ETH",
        BTC: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
        BNB: "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
        SOL: "0x5288738df1aEB0894713De903E1D0C001eeFEc5C",
        AVAX: "0x85f138bfEE4ef8e540890CFb48F620571d67Eda3",
      };

      const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
      const inputToken = TOKEN_ADDRESSES[selectedCrypto.symbol] || "ETH";

      const uniswapUrl = `https://app.uniswap.org/#/swap?inputCurrency=${inputToken}&outputCurrency=${USDC_ADDRESS}&exactAmount=${cryptoAmount}&chain=mainnet`;

      window.open(uniswapUrl, "_blank", "noopener,noreferrer");
    } catch (error: any) {
      console.error("Error:", error);
      if (error.code === 4001) {
        alert("Connection request rejected.");
      } else {
        alert(`Error: ${error.message || "Failed to connect to MetaMask"}`);
      }
    }
  };

  // Just keep balance fetching, remove Supabase auth check
  const fetchWalletBalance = async () => {
    if (!wallet?.circle_wallet_id) return;

    try {
      const response = await fetch("/api/wallet/balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletId: wallet.circle_wallet_id }),
      });
      const data = await response.json();
      setWallet((prev) => ({ ...prev!, balance: data.balance || "0" }));
    } catch (error) {
      console.error("Failed to fetch balance:", error);
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
                {userName
                  ? userName.substring(0, 2).toUpperCase()
                  : userEmail.substring(0, 2).toUpperCase()}
              </div>
              <span className="text-sm font-medium">
                {userName || userEmail}
              </span>
              <ChevronDown className="w-4 h-4" />
            </Menu.Button>
          </Menu>
        </div>
      </div>

      {/* Main Content - Rest of your original UI code... */}
      {/* I'll continue in next message with the full remaining code */}
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
            <div className="grid grid-cols-2 gap-6 h-[45%] min-h-0">
              {/* Live Prices */}
              <div className="relative bg-white/[0.03] backdrop-blur-xl backdrop-saturate-150 border border-white/20 rounded-3xl p-5 shadow-lg shadow-black/10 overflow-hidden flex flex-col min-h-0">
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 left-0 right-0 h-[50%] bg-gradient-to-b from-white/10 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-transparent"></div>
                </div>
                <div className="absolute inset-0 rounded-3xl shadow-inner shadow-black/5"></div>

                <div className="relative z-10 h-full flex flex-col overflow-auto">
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

              {/* Exchange - FIXED OVERFLOW */}
              <div className="relative bg-white/[0.03] backdrop-blur-xl backdrop-saturate-150 border border-white/20 rounded-3xl p-5 shadow-lg shadow-black/10 flex flex-col min-h-0 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 left-0 right-0 h-[50%] bg-gradient-to-b from-white/10 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-transparent"></div>
                </div>
                <div className="absolute inset-0 rounded-3xl shadow-inner shadow-black/5"></div>

                <div className="relative z-10 h-full flex flex-col overflow-y-auto">
                  <div className="flex items-center justify-between mb-3 flex-shrink-0">
                    <h3 className="text-base font-semibold">Exchange</h3>
                    <span className="text-xs text-gray-400">Quick Swap</span>
                  </div>

                  {/* Crypto Selection - LEFT ALIGNED */}
                  <div className="mb-2 flex-shrink-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-blue-400 font-medium">
                        You Send
                      </span>
                    </div>

                    <div className="relative">
                      <button
                        onClick={() =>
                          setShowCryptoDropdown(!showCryptoDropdown)
                        }
                        className="flex items-center gap-2 hover:bg-white/5 p-1.5 rounded-lg transition-all w-full"
                      >
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center flex-shrink-0">
                          {selectedCrypto.image ? (
                            <img
                              src={selectedCrypto.image}
                              alt={selectedCrypto.symbol}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xs font-bold">₿</span>
                          )}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <div className="text-sm font-semibold truncate">
                            {selectedCrypto.symbol}
                          </div>
                          <div className="text-[10px] text-gray-400 truncate">
                            1 {selectedCrypto.symbol} = $
                            {selectedCrypto.price.toLocaleString()}
                          </div>
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      </button>

                      {/* Dropdown Menu */}
                      {showCryptoDropdown && (
                        <div className="absolute top-full left-0 mt-2 w-full bg-black/95 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden z-50 shadow-2xl max-h-48 overflow-y-auto scrollbar-hide">
                          {cryptoData.slice(0, 5).map((crypto) => (
                            <button
                              key={crypto.id}
                              onClick={() => handleCryptoSelect(crypto)}
                              className="w-full flex items-center gap-2 p-2.5 hover:bg-white/10 transition-all"
                            >
                              <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0">
                                <img
                                  src={crypto.image}
                                  alt={crypto.symbol}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 text-left min-w-0">
                                <div className="text-xs font-semibold truncate">
                                  {crypto.symbol.toUpperCase()}
                                </div>
                                <div className="text-[9px] text-gray-400 truncate">
                                  {crypto.name}
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <div className="text-xs font-semibold">
                                  ${crypto.current_price.toLocaleString()}
                                </div>
                                <div
                                  className={`text-[9px] ${
                                    crypto.price_change_percentage_24h > 0
                                      ? "text-green-400"
                                      : "text-red-400"
                                  }`}
                                >
                                  {crypto.price_change_percentage_24h > 0
                                    ? "+"
                                    : ""}
                                  {crypto.price_change_percentage_24h.toFixed(
                                    2
                                  )}
                                  %
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <input
                      type="text"
                      value={cryptoAmount}
                      onChange={(e) => handleCryptoAmountChange(e.target.value)}
                      placeholder="0.000"
                      className="w-full bg-transparent text-2xl font-bold text-white outline-none mt-1.5"
                    />
                  </div>

                  {/* Arrow Icon */}
                  <div className="flex justify-center my-2 flex-shrink-0">
                    <button className="p-1.5 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 hover:bg-white/15 transition-all">
                      <ArrowDownUp className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* USDC Section - LEFT ALIGNED */}
                  <div className="mb-3 flex-shrink-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-blue-400 font-medium">
                        You Get
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold">$</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold truncate">
                          USDC
                        </div>
                        <div className="text-[10px] text-gray-400 truncate">
                          1 USDC = $1
                        </div>
                      </div>
                    </div>

                    <div className="w-full bg-transparent text-2xl font-bold text-white truncate">
                      {usdcAmount || "0"}
                    </div>
                  </div>

                  {/* Buy USDC Button */}
                  <button
                    onClick={handleBuyUSDC}
                    disabled={parseFloat(cryptoAmount) <= 0}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-xl py-2.5 text-sm font-semibold transition-all mt-auto flex-shrink-0"
                  >
                    Buy USDC via MetaMask
                  </button>
                </div>
              </div>
            </div>

            {/* Trust Meter - COMPACT VERSION */}
            <div className="relative bg-white/[0.03] backdrop-blur-xl backdrop-saturate-150 border border-white/20 rounded-3xl p-5 shadow-lg shadow-black/10 overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 right-0 h-[50%] bg-gradient-to-b from-white/10 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-transparent"></div>
              </div>
              <div className="absolute inset-0 rounded-3xl shadow-inner shadow-black/5"></div>

              <div className="relative z-10">
                <h3 className="text-base font-semibold mb-4">
                  Trust Meter & Dispute Stats
                </h3>
                <div className="flex items-center gap-6">
                  {/* Stats on LEFT - More Compact */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <div className="text-[10px] text-gray-400 mb-0.5">
                        Dispute Win Rate
                      </div>
                      <div className="text-2xl font-bold">100%</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400 mb-0.5">
                        Successful Escrows
                      </div>
                      <div className="text-2xl font-bold">22</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400 mb-0.5">
                        Avg. Resolution Time
                      </div>
                      <div className="text-2xl font-bold">4.2hrs</div>
                    </div>
                  </div>

                  {/* Circular Progress on RIGHT - Smaller */}
                  <div className="flex flex-col items-center">
                    <div className="w-28 h-28 mb-2">
                      <ReactCircularProgressbar
                        value={40}
                        text="40%"
                        styles={buildStyles({
                          pathColor: "#6366f1",
                          textColor: "#fff",
                          trailColor: "rgba(255,255,255,0.1)",
                          textSize: "24px",
                        })}
                      />
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] font-medium text-gray-400">
                        Trust Score
                      </div>
                      <div className="text-[10px] text-green-400 font-medium mt-0.5">
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
