// "use client"
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   Activity,
//   ArrowUpRight,
//   ArrowDownLeft,
//   Calendar,
//   Clock,
//   ChevronLeft,
//   ChevronRight,
//   Filter,
//   Download,
//   Plus,
//   Search,
//   RefreshCw,
//   TrendingUp,
//   TrendingDown,
//   CheckCircle2,
//   AlertCircle,
//   Copy,
//   ExternalLink,
//   Eye,
//   EyeOff,
//   Zap,
//   MoreVertical,
// } from "lucide-react";
// import InteractiveSidebar from "@/components/dashboard/sidebar";

// interface Transaction {
//   id: string;
//   wallet_id: string;
//   profile_id: string;
//   circle_transaction_id: string;
//   transaction_type: 'INBOUND' | 'OUTBOUND';
//   amount: number;
//   currency: string;
//   status: 'COMPLETE' | 'PENDING' | 'FAILED';
//   created_at: string;
//   updated_at: string;
// }

// interface CircleTransaction {
//   id: string;
//   amount: string[];
//   createDate: string;
//   status: 'COMPLETE' | 'PENDING' | 'FAILED';
//   transactionType: 'INBOUND' | 'OUTBOUND';
// }

// export default function TransactionsPage() {
//   const [transactions, setTransactions] = useState<Transaction[]>([]);
//   const [circleTransactions, setCircleTransactions] = useState<CircleTransaction[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [user, setUser] = useState<any>(null);
//   const [wallet, setWallet] = useState<any>(null);
//   const [filter, setFilter] = useState<'all' | 'inbound' | 'outbound'>('all');
//   const [statusFilter, setStatusFilter] = useState<'all' | 'complete' | 'pending' | 'failed'>('all');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentMonth, setCurrentMonth] = useState("January");
//   const [showAmounts, setShowAmounts] = useState(true);
//   const [copiedId, setCopiedId] = useState<string | null>(null);

//   const router = useRouter();

//   useEffect(() => {
//     fetchTransactions();
//   }, []);

//   const fetchTransactions = async () => {
//     try {
//       setError(null);

//       // Check NextAuth session
//       const sessionResponse = await fetch("/api/auth/session");
//       const session = await sessionResponse.json();

//       if (!session?.user) {
//         router.push("/sign-in");
//         return;
//       }

//       setUser(session.user);

//       // Get wallet info from PostgreSQL via API
//       const walletResponse = await fetch("/api/user/wallet");
//       const walletData = await walletResponse.json();

//       if (walletData.error) {
//         setError("Failed to fetch wallet information");
//         return;
//       }

//       setWallet(walletData.wallet);

//       // Fetch transactions from Circle API
//       if (walletData.wallet?.circle_wallet_id) {
//         try {
//           const transactionsResponse = await fetch("/api/wallet/transactions", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               walletId: walletData.wallet.circle_wallet_id,
//             }),
//           });

//           const transactionsData = await transactionsResponse.json();

//           if (transactionsData.transactions) {
//             setCircleTransactions(transactionsData.transactions);
//           }
//         } catch (apiError) {
//           console.error("Circle API error:", apiError);
//         }
//       }

//       // Fetch transactions from PostgreSQL database
//       const dbTransactionsResponse = await fetch(
//         `/api/wallet/db-transactions?walletId=${walletData.wallet.id}`
//       );
//       const dbTransactionsData = await dbTransactionsResponse.json();

//       if (dbTransactionsData.transactions) {
//         setTransactions(dbTransactionsData.transactions);
//       }
//     } catch (error) {
//       console.error("Error fetching transactions:", error);
//       setError("Failed to fetch transactions. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };


//   const refreshTransactions = async () => {
//     setRefreshing(true);
//     await fetchTransactions();
//     setRefreshing(false);
//   };

//   const copyToClipboard = async (text: string, id: string) => {
//     try {
//       await navigator.clipboard.writeText(text);
//       setCopiedId(id);
//       setTimeout(() => setCopiedId(null), 2000);
//     } catch (err) {
//       console.error('Failed to copy text: ', err);
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status.toUpperCase()) {
//       case 'COMPLETE':
//         return 'text-green-400 bg-green-400/20 border-green-400/30';
//       case 'PENDING':
//         return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
//       case 'FAILED':
//         return 'text-red-400 bg-red-400/20 border-red-400/30';
//       default:
//         return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
//     }
//   };

//   const getTransactionIcon = (type: string) => {
//     return type === 'INBOUND' ? 
//       <ArrowDownLeft className="w-4 h-4 text-green-400" /> : 
//       <ArrowUpRight className="w-4 h-4 text-red-400" />;
//   };

//   const filteredTransactions = transactions.filter(transaction => {
//     const matchesFilter = filter === 'all' || transaction.transaction_type.toLowerCase() === filter;
//     const matchesStatus = statusFilter === 'all' || transaction.status.toLowerCase() === statusFilter;
//     const matchesSearch = searchTerm === '' || 
//       transaction.circle_transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       transaction.amount.toString().includes(searchTerm);
    
//     return matchesFilter && matchesStatus && matchesSearch;
//   });

//   const totalInbound = transactions
//     .filter(t => t.transaction_type === 'INBOUND' && t.status === 'COMPLETE')
//     .reduce((sum, t) => sum + t.amount, 0);

//   const totalOutbound = transactions
//     .filter(t => t.transaction_type === 'OUTBOUND' && t.status === 'COMPLETE')
//     .reduce((sum, t) => sum + t.amount, 0);

//   const calendarDays = Array.from({ length: 30 }, (_, i) => ({
//     day: String(i + 1),
//     date: i + 1,
//     highlighted: i + 1 === 15,
//     hasTransaction: transactions.some(t => 
//       new Date(t.created_at).getDate() === (i + 1)
//     )
//   }));

//   if (loading) {
//     return (
//       <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white p-6">
//         <div className="max-w-7xl mx-auto">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {[...Array(9)].map((_, i) => (
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
//           <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
//           <h2 className="text-xl font-bold mb-2">Transaction Error</h2>
//           <p className="text-gray-300 mb-4">{error}</p>
//           <button 
//             onClick={fetchTransactions}
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

//       {/* sidebar */}
//       <InteractiveSidebar/>

//       <div className="relative p-6 lg:p-8">
//         <div className="max-w-7xl mx-auto">
//           {/* Header */}
//           <div className="mb-8">
//             <div className="flex items-center gap-3 mb-4">
//               <div className="p-2 bg-blue-500/20 rounded-lg">
//                 <Activity className="w-6 h-6 text-blue-400" />
//               </div>
//               <h1 className="text-3xl font-bold">Transaction History</h1>
//               <button
//                 onClick={refreshTransactions}
//                 disabled={refreshing}
//                 className="ml-auto p-2 bg-gray-800/50 hover:bg-gray-800/80 border border-gray-700/50 rounded-lg transition-colors disabled:opacity-50"
//               >
//                 <RefreshCw className={`w-5 h-5 text-gray-400 ${refreshing ? 'animate-spin' : ''}`} />
//               </button>
//             </div>
//             <p className="text-gray-400">View and manage your transaction history</p>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
//             {/* Main Content */}
//             <div className="lg:col-span-8 space-y-6">
//               {/* Stats Cards */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 {/* Total Received */}
//                 <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur-sm border border-green-500/30 rounded-xl p-6">
//                   <div className="flex items-center justify-between mb-4">
//                     <div className="p-2 bg-green-500/20 rounded-lg">
//                       <ArrowDownLeft className="w-5 h-5 text-green-400" />
//                     </div>
//                     <TrendingUp className="w-4 h-4 text-green-400" />
//                   </div>
//                   <div className="space-y-1">
//                     <h3 className="text-sm font-medium text-gray-300">Total Received</h3>
//                     <div className="text-2xl font-bold text-white">
//                       {showAmounts ? `${totalInbound.toFixed(2)} USDC` : '••••••••'}
//                     </div>
//                     <div className="text-green-400 text-xs">
//                       {transactions.filter(t => t.transaction_type === 'INBOUND').length} transactions
//                     </div>
//                   </div>
//                 </div>

//                 {/* Total Sent */}
//                 <div className="bg-gradient-to-br from-red-600/20 to-red-800/20 backdrop-blur-sm border border-red-500/30 rounded-xl p-6">
//                   <div className="flex items-center justify-between mb-4">
//                     <div className="p-2 bg-red-500/20 rounded-lg">
//                       <ArrowUpRight className="w-5 h-5 text-red-400" />
//                     </div>
//                     <TrendingDown className="w-4 h-4 text-red-400" />
//                   </div>
//                   <div className="space-y-1">
//                     <h3 className="text-sm font-medium text-gray-300">Total Sent</h3>
//                     <div className="text-2xl font-bold text-white">
//                       {showAmounts ? `${totalOutbound.toFixed(2)} USDC` : '••••••••'}
//                     </div>
//                     <div className="text-red-400 text-xs">
//                       {transactions.filter(t => t.transaction_type === 'OUTBOUND').length} transactions
//                     </div>
//                   </div>
//                 </div>

//                 {/* Net Balance */}
//                 <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
//                   <div className="flex items-center justify-between mb-4">
//                     <div className="p-2 bg-blue-500/20 rounded-lg">
//                       <Activity className="w-5 h-5 text-blue-400" />
//                     </div>
//                     <button
//                       onClick={() => setShowAmounts(!showAmounts)}
//                       className="p-1.5 hover:bg-gray-700/50 rounded-lg transition-colors"
//                     >
//                       {showAmounts ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
//                     </button>
//                   </div>
//                   <div className="space-y-1">
//                     <h3 className="text-sm font-medium text-gray-300">Net Balance</h3>
//                     <div className="text-2xl font-bold text-white">
//                       {showAmounts ? `${(totalInbound - totalOutbound).toFixed(2)} USDC` : '••••••••'}
//                     </div>
//                     <div className="text-blue-400 text-xs">
//                       {transactions.length} total transactions
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Filters */}
//               <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
//                 <div className="flex flex-col md:flex-row gap-4">
//                   {/* Search */}
//                   <div className="flex-1">
//                     <div className="relative">
//                       <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                       <input
//                         type="text"
//                         placeholder="Search by transaction ID or amount..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         className="w-full pl-10 pr-4 py-2.5 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all"
//                       />
//                     </div>
//                   </div>

//                   {/* Type Filter */}
//                   <div className="flex items-center gap-2">
//                     <Filter className="w-4 h-4 text-gray-400" />
//                     <select
//                       value={filter}
//                       onChange={(e) => setFilter(e.target.value as any)}
//                       className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
//                     >
//                       <option value="all">All Types</option>
//                       <option value="inbound">Received</option>
//                       <option value="outbound">Sent</option>
//                     </select>
//                   </div>

//                   {/* Status Filter */}
//                   <select
//                     value={statusFilter}
//                     onChange={(e) => setStatusFilter(e.target.value as any)}
//                     className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
//                   >
//                     <option value="all">All Status</option>
//                     <option value="complete">Complete</option>
//                     <option value="pending">Pending</option>
//                     <option value="failed">Failed</option>
//                   </select>
//                 </div>
//               </div>

//               {/* Transactions List */}
//               <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl">
//                 <div className="p-6 border-b border-gray-700/50">
//                   <h3 className="text-lg font-semibold">Recent Transactions</h3>
//                   <p className="text-gray-400 text-sm">
//                     Showing {filteredTransactions.length} of {transactions.length} transactions
//                   </p>
//                 </div>

//                 <div className="divide-y divide-gray-700/50">
//                   {filteredTransactions.length === 0 ? (
//                     <div className="p-8 text-center">
//                       <Activity className="w-12 h-12 text-gray-500 mx-auto mb-4" />
//                       <h3 className="text-lg font-medium text-gray-400 mb-2">No transactions found</h3>
//                       <p className="text-gray-500">
//                         {searchTerm || filter !== 'all' || statusFilter !== 'all' 
//                           ? 'Try adjusting your filters'
//                           : 'Your transactions will appear here once you start using your wallet'
//                         }
//                       </p>
//                     </div>
//                   ) : (
//                     filteredTransactions.map((transaction, index) => (
//                       <div key={transaction.id} className="p-4 hover:bg-gray-700/30 transition-colors group">
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-4 flex-1">
//                             <div className="p-2 bg-gray-700/50 rounded-lg group-hover:bg-gray-700/70 transition-colors">
//                               {getTransactionIcon(transaction.transaction_type)}
//                             </div>
                            
//                             <div className="flex-1 min-w-0">
//                               <div className="flex items-center gap-2 mb-1">
//                                 <h4 className="font-medium text-white">
//                                   {transaction.transaction_type === 'INBOUND' ? 'Received' : 'Sent'}
//                                 </h4>
//                                 <div className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(transaction.status)}`}>
//                                   {transaction.status}
//                                 </div>
//                               </div>
                              
//                               <div className="flex items-center gap-2 text-sm text-gray-400">
//                                 <code className="font-mono">
//                                   {transaction.circle_transaction_id.substring(0, 8)}...{transaction.circle_transaction_id.substring(transaction.circle_transaction_id.length - 8)}
//                                 </code>
//                                 <button
//                                   onClick={() => copyToClipboard(transaction.circle_transaction_id, transaction.id)}
//                                   className="p-1 hover:bg-gray-600/50 rounded transition-colors"
//                                 >
//                                   {copiedId === transaction.id ? 
//                                     <CheckCircle2 className="w-3 h-3 text-green-400" /> : 
//                                     <Copy className="w-3 h-3" />
//                                   }
//                                 </button>
//                               </div>
                              
//                               <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
//                                 <Clock className="w-3 h-3" />
//                                 {new Date(transaction.created_at).toLocaleDateString()} at {new Date(transaction.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                               </div>
//                             </div>
//                           </div>

//                           <div className="text-right">
//                             <div className={`text-lg font-bold ${
//                               transaction.transaction_type === 'INBOUND' ? 'text-green-400' : 'text-red-400'
//                             }`}>
//                               {transaction.transaction_type === 'INBOUND' ? '+' : '-'}
//                               {showAmounts ? `${transaction.amount} ${transaction.currency}` : '••••••'}
//                             </div>
//                             <div className="text-xs text-gray-500">
//                               {transaction.transaction_type === 'INBOUND' ? 'Credit' : 'Debit'}
//                             </div>
//                           </div>

//                           <button className="ml-4 p-2 opacity-0 group-hover:opacity-100 hover:bg-gray-600/50 rounded-lg transition-all">
//                             <MoreVertical className="w-4 h-4 text-gray-400" />
//                           </button>
//                         </div>
//                       </div>
//                     ))
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Sidebar */}
//             <div className="lg:col-span-4 space-y-6">
//               {/* Quick Actions */}
//               <div className="space-y-4">
//                 <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
//                 <div className="grid grid-cols-1 gap-3">
//                   <button className="group flex items-center justify-center gap-3 bg-blue-600/80 hover:bg-blue-600 backdrop-blur-sm border border-blue-500/30 rounded-xl py-4 px-6 font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-600/25">
//                     <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
//                     <span>Create New Escrow</span>
//                     <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
//                   </button>
                  
//                   <button className="group flex items-center justify-center gap-3 bg-gray-700/60 hover:bg-gray-700 backdrop-blur-sm border border-gray-600/50 rounded-xl py-4 px-6 font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-gray-700/25">
//                     <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform duration-200" />
//                     <span>Release Funds</span>
//                     <ArrowDownLeft className="w-4 h-4 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
//                   </button>
//                 </div>
//               </div>

//               {/* Transaction Calendar */}
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
//                   <h3 className="text-lg font-bold text-center mb-2">Transaction Insights</h3>
//                   <p className="text-purple-100 text-sm text-center mb-4">
//                     Get AI-powered analysis of your transaction patterns
//                   </p>
//                   <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-lg py-2.5 px-4 text-sm font-medium text-white transition-all duration-200 hover:scale-[1.02]">
//                     Analyze My Transactions
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
import { useRouter } from "next/navigation";
import InteractiveSidebar from "@/components/dashboard/sidebar";
// ... all your imports

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000";

export default function TransactionsPage() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // Get session
      const sessionResponse = await fetch("/api/auth/session");
      const session = await sessionResponse.json();

      if (!session?.user) {
        router.push("/sign-in");
        return;
      }

      // Fetch wallet data from backend
      const response = await fetch(`${BACKEND_API_URL}/api/wallet/user`, {
        headers: {
          Authorization: `Bearer ${session.user.id}`,
          "x-user-email": session.user.email,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white">
      <InteractiveSidebar />

      <div className="ml-[88px] p-8">
        <h1 className="text-3xl font-bold mb-6">Transaction History</h1>

        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <p className="text-gray-400">
            Wallet Address: {userData?.wallet?.address || "Not connected"}
          </p>
          {/* Your transaction list components */}
        </div>
      </div>
    </div>
  );
}
