// "use client"
// import React, { useState } from "react";
// import {
//   ChevronLeft,
//   ChevronRight,
//   Bell,
//   User,
//   Plus,
//   Download,
//   Zap,
//   Clock,
//   Users,
//   ArrowDownLeft,
// } from "lucide-react";
// import WalletBalanceCard from "@/components/dashboard/wallet/wallet-balance-card";
// import { Transactions } from "@/components/dashboard/wallet/transactions";
// import { EscrowAgreements } from "@/components/dashboard/agreements/escrow-agreements";
// import { useRouter } from "next/navigation";
// import { NewEscrowButton } from "@/components/dashboard/agreements/createAgreement/create-agreement";
// import InteractiveSidebar from "@/components/dashboard/sidebar";

// const PaycassoAgreements = () => {
//   const router = useRouter();

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "Completed":
//         return "text-emerald-400";
//       case "Pending":
//         return "text-amber-400";
//       case "Disputed":
//         return "text-red-400";
//       default:
//         return "text-slate-400";
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "Completed":
//         return "●";
//       case "Pending":
//         return "●";
//       case "Disputed":
//         return "●";
//       default:
//         return "●";
//     }
//   };

//   return (
//     <div
//       className="min-h-screen w-full bg-slate-900 text-white"
//       style={{ fontFamily: "Inter, sans-serif" }}
//     >
//       {/* Sidebar */}
//       <InteractiveSidebar/>

//       {/* Main Content */}
//       <div className="ml-16 p-6 lg:p-8">
//         {/* Page Header */}
//         <div className="mb-8">
//           <h1 className="text-4xl lg:text-5xl font-light text-white mb-2">
//             Contracts
//           </h1>
//           <p className="text-slate-400 text-lg">
//             Manage your escrow agreements and smart contracts
//           </p>
//         </div>

//         <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
//           {/* Main Content Area */}
//           <div className="xl:col-span-8">
//             <EscrowAgreements/>
//           </div>

//           {/* Right Sidebar */}
//           <div className="xl:col-span-4 space-y-6">
//             {/* Paycasso AI Lab - Enhanced */}
//             <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 rounded-xl p-6 shadow-lg border border-purple-500/20">
//               <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
//               <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-4 -translate-x-4"></div>
              
//               <div className="relative z-10">
//                 <div className="flex items-center justify-center w-14 h-14 mx-auto mb-4 bg-white/15 backdrop-blur-sm rounded-xl border border-white/20">
//                   <Zap className="w-7 h-7 text-white" />
//                 </div>
//                 <h3 className="text-xl font-semibold text-center mb-2">
//                   Paycasso AI Lab
//                 </h3>
//                 <p className="text-center text-purple-100 text-sm mb-4">
//                   AI-powered contract analysis and insights
//                 </p>
//                 <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-lg py-2.5 px-4 text-sm font-medium transition-all duration-200 hover:scale-[1.02]">
//                   Launch AI Assistant
//                 </button>
//               </div>
//             </div>

//             {/* Pending Approvals - Enhanced */}
//             <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-lg">
//               <div className="flex items-center justify-between mb-5">
//                 <h3 className="text-lg font-semibold text-white">Pending Approvals</h3>
//                 <div className="flex items-center justify-center w-8 h-8 bg-amber-500/20 rounded-lg">
//                   <Clock className="w-4 h-4 text-amber-400" />
//                 </div>
//               </div>
              
//               <div className="space-y-4">
//                 {[
//                   {
//                     project: "Milestone Project - Alpha",
//                     task: "Task validation required",
//                     time: "2 hrs ago",
//                     from: "Client 2",
//                     priority: "high"
//                   },
//                   {
//                     project: "Milestone Project - Beta",
//                     task: "Task validation required",
//                     time: "2 hrs ago",
//                     from: "Client 3",
//                     priority: "medium"
//                   },
//                   {
//                     project: "Milestone Project - Delta",
//                     task: "Task validation required",
//                     time: "2 hrs ago",
//                     from: "Client 1",
//                     priority: "low"
//                   },
//                 ].map((item, index) => (
//                   <div
//                     key={index}
//                     className="bg-slate-700/40 border border-slate-600/30 rounded-lg p-4 hover:bg-slate-700/60 transition-all duration-200"
//                   >
//                     <div className="flex items-start justify-between mb-3">
//                       <div className="flex-1">
//                         <h4 className="text-sm font-medium text-white mb-1">
//                           {item.project}
//                         </h4>
//                         <p className="text-xs text-slate-300 mb-2">
//                           {item.task}
//                         </p>
//                         <div className="flex items-center gap-4 text-xs text-slate-400">
//                           <span className="flex items-center gap-1">
//                             <Clock className="w-3 h-3" />
//                             {item.time}
//                           </span>
//                           <span className="flex items-center gap-1">
//                             <Users className="w-3 h-3" />
//                             {item.from}
//                           </span>
//                         </div>
//                       </div>
//                       <div className={`w-2 h-2 rounded-full ${
//                         item.priority === 'high' ? 'bg-red-400' : 
//                         item.priority === 'medium' ? 'bg-amber-400' : 'bg-emerald-400'
//                       }`}></div>
//                     </div>
//                     <button className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg py-2.5 px-4 text-sm font-medium transition-all duration-200 hover:scale-[1.02] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800">
//                       Review & Approve
//                     </button>
//                   </div>
//                 ))}
//               </div>
              
//               <button className="w-full mt-4 text-sm text-slate-400 hover:text-white transition-colors duration-200 py-2">
//                 View all pending approvals
//               </button>
//             </div>

//             {/* Quick Actions - Enhanced */}
//             <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-lg">
//               <h3 className="text-lg font-semibold text-white mb-5">Quick Actions</h3>
//               <div className="grid grid-cols-1 gap-3">
//                 <NewEscrowButton/>
//                 <button className="group flex items-center justify-center gap-3 bg-gray-700/60 hover:bg-gray-700 backdrop-blur-sm border border-gray-600/50 rounded-xl py-4 px-6 font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-gray-700/25">
//                     <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform duration-200" />
//                     <span>Release Funds</span>
//                     <ArrowDownLeft className="w-4 h-4 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
//                   </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaycassoAgreements;

"use client";
import React, { useState } from "react";
import {
  Bell,
  User,
  MessageCircle,
  Search,
  ChevronDown,
  Plus,
  Download,
  Eye,
  Copy,
  Info,
  MessageSquare,
  RotateCw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import InteractiveSidebar from "@/components/dashboard/sidebar";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { useEffect, useState as useStateHook } from "react";

const supabase = createSupabaseBrowserClient();

const PaycassoAgreements = () => {
  const router = useRouter();
  const [showChat, setShowChat] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [walletId, setWalletID] = useStateHook<any>(null);
  const [profileId, setProfileId] = useStateHook<any>(null);
  const [userId, setUserId] = useStateHook<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();

        if (!currentUser) {
          router.push("/sign-in");
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("auth_user_id", currentUser.id)
          .single();

        setProfileId(profile?.id);
        setUserId(currentUser.id);
        if (profile) {
          const { data: walletData } = await supabase
            .schema("public")
            .from("wallets")
            .select()
            .eq("profile_id", profile.id)
            .single();

          setWalletID(walletData?.id);
        }
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      }
    };

    fetchData();
  }, [supabase, router]);

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  // Dummy data
  const dummyContracts = [
    {
      date: "June 10",
      counterparty: "Oliver Elijah",
      purpose: "Logo Design",
      amount: "100.35 USDC",
      status: "Completed",
      statusColor: "text-green-400",
    },
    {
      date: "June 10",
      counterparty: "James William",
      purpose: "POS Integration",
      amount: "100.35 USDC",
      status: "Completed",
      statusColor: "text-green-400",
    },
    {
      date: "June 10",
      counterparty: "Lucas Benjamin",
      purpose: "Instagram Campaign",
      amount: "100.35 USDC",
      status: "Completed",
      statusColor: "text-green-400",
    },
    {
      date: "June 10",
      counterparty: "Alexander Henry",
      purpose: "POS Integration",
      amount: "100.35 USDC",
      status: "Completed",
      statusColor: "text-green-400",
    },
    {
      date: "June 10",
      counterparty: "Oliver Elijah",
      purpose: "Import/Export Escrow",
      amount: "100.35 USDC",
      status: "Pending",
      statusColor: "text-yellow-400",
    },
    {
      date: "June 10",
      counterparty: "Oliver Elijah",
      purpose: "Logo Design",
      amount: "100.35 USDC",
      status: "Disputed",
      statusColor: "text-red-400",
    },
    {
      date: "June 10",
      counterparty: "Mia Lucas",
      purpose: "Document Drafting",
      amount: "100.35 USDC",
      status: "Disputed",
      statusColor: "text-red-400",
    },
    {
      date: "June 10",
      counterparty: "Mia Lucas",
      purpose: "POS Integration",
      amount: "100.35 USDC",
      status: "Completed",
      statusColor: "text-green-400",
    },
    {
      date: "June 10",
      counterparty: "James William",
      purpose: "Logo Design",
      amount: "100.35 USDC",
      status: "Pending",
      statusColor: "text-yellow-400",
    },
    {
      date: "June 10",
      counterparty: "Alexander Henry",
      purpose: "Document Drafting",
      amount: "100.35 USDC",
      status: "Completed",
      statusColor: "text-green-400",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#000000] text-white overflow-hidden">
      <InteractiveSidebar />

      <div className="ml-[88px] p-8 h-screen overflow-y-auto">
        {/* Page Header */}
        <div className="mb-10 flex items-center justify-between">
          <h1 className="text-4xl font-semibold text-white">Contracts</h1>

          {/* Top Right: Notifications & User */}
          <div className="flex items-center gap-4">
            <button className="relative bg-white/[0.03] backdrop-blur-xl border border-white/20 rounded-full p-2.5 hover:bg-white/[0.08] transition-all">
              <Bell className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
                5
              </div>
            </button>
            <button className="flex items-center gap-2 bg-white/[0.03] backdrop-blur-xl border border-white/20 rounded-full py-2 px-4 hover:bg-white/[0.08] transition-all">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-sm font-semibold">
                <User className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">Vicky Shaw</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Main Content Area */}
          <div className="xl:col-span-8 space-y-6">
            {/* Top Row: Search + Filters + Action Buttons */}
            <div className="flex items-center justify-between gap-4">
              {/* Left Side: Search + Filters */}
              <div className="flex items-center gap-4">
                {/* Search with Icon */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                  <input
                    type="text"
                    placeholder="Search Here"
                    className="pl-11 pr-4 py-3 w-64 bg-white/[0.05] backdrop-blur-xl border border-white/20 rounded-[20px] text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  />
                </div>

                {/* Filters Dropdown */}
                <button className="flex items-center gap-2 px-5 py-3 bg-white/[0.05] backdrop-blur-xl border border-white/20 rounded-[20px] text-sm font-light hover:bg-white/[0.08] transition-all whitespace-nowrap">
                  Filters
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Contact Types Dropdown - NO WRAP */}
                <button className="flex items-center gap-2 px-5 py-3 bg-white/[0.05] backdrop-blur-xl border border-white/20 rounded-[20px] text-sm font-light hover:bg-white/[0.08] transition-all whitespace-nowrap">
                  Contact Types
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Refresh Icon with Animation */}
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="p-3 bg-white/[0.05] backdrop-blur-xl border border-white/20 rounded-[20px] hover:bg-white/[0.08] transition-all disabled:opacity-50"
                >
                  <RotateCw
                    className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                </button>
              </div>

              {/* Right Side: Action Buttons */}
              <div className="flex items-center gap-3">
                <button className="flex items-center justify-center gap-2 px-5 py-3 bg-white/[0.05] backdrop-blur-xl border border-white/20 rounded-[20px] text-sm font-light hover:bg-white/[0.08] transition-all whitespace-nowrap">
                  <Plus className="w-4 h-4" />
                  Add New Contract
                </button>
                <button className="flex items-center justify-center gap-2 px-5 py-3 bg-white/[0.05] backdrop-blur-xl border border-white/20 rounded-[20px] text-sm font-light hover:bg-white/[0.08] transition-all whitespace-nowrap">
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              </div>
            </div>

            {/* Contracts Table - FLAT CONTAINER, NO PADDING */}
            <div className="relative bg-gradient-to-br from-white/[0.07] via-white/[0.03] to-white/[0.02] backdrop-blur-2xl backdrop-saturate-150 border border-white/20 rounded-[20px] shadow-2xl overflow-hidden">
              {/* Enhanced Apple-Style Glass Layers */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[20px]">
                <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-white/[0.15] via-white/[0.05] to-transparent"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.05),transparent_50%)]"></div>
                <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="absolute inset-0 rounded-[20px] shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.1)]"></div>

              {/* Table - NO PADDING, DIRECT CONTENT */}
              <div className="relative z-10 overflow-x-auto overflow-y-auto max-h-[650px] apple-scrollbar">
                <table className="w-full">
                  <thead className="sticky top-0 bg-[#0a0a0a]/95 backdrop-blur-2xl z-10">
                    <tr className="border-b border-white/10">
                      <th className="text-left py-5 px-6 text-sm font-normal text-gray-400">
                        Date
                      </th>
                      <th className="text-left py-5 px-6 text-sm font-normal text-gray-400">
                        Counterparty
                      </th>
                      <th className="text-left py-5 px-6 text-sm font-normal text-gray-400">
                        Purpose
                      </th>
                      <th className="text-left py-5 px-6 text-sm font-normal text-gray-400">
                        Amount
                      </th>
                      <th className="text-left py-5 px-6 text-sm font-normal text-gray-400">
                        Status
                      </th>
                      <th className="text-right py-5 px-6 text-sm font-normal text-gray-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    className={
                      isRefreshing
                        ? "opacity-50"
                        : "opacity-100 transition-opacity duration-300"
                    }
                  >
                    {dummyContracts.map((contract, index) => (
                      <tr
                        key={index}
                        className="border-b border-white/5 hover:bg-white/5 transition-all duration-200"
                      >
                        <td className="py-5 px-6 text-sm font-light text-white/90">
                          {contract.date}
                        </td>
                        <td className="py-5 px-6 text-sm font-light text-white/90">
                          {contract.counterparty}
                        </td>
                        <td className="py-5 px-6 text-sm font-light text-white/90">
                          {contract.purpose}
                        </td>
                        <td className="py-5 px-6 text-sm font-normal text-white">
                          {contract.amount}
                        </td>
                        <td className="py-5 px-6">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                contract.status === "Completed"
                                  ? "bg-green-400"
                                  : contract.status === "Pending"
                                  ? "bg-yellow-400"
                                  : "bg-red-400"
                              }`}
                            ></div>
                            <span
                              className={`text-sm font-light ${contract.statusColor}`}
                            >
                              {contract.status}
                            </span>
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <div className="flex items-center justify-end gap-3">
                            <button className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200">
                              <Eye className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
                            </button>
                            <button className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200">
                              <Copy className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
                            </button>
                            <button className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200">
                              <Info className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
                            </button>
                            <button
                              onClick={() => setShowChat(true)}
                              className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200"
                            >
                              <MessageSquare className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="xl:col-span-4">
            {/* Message Window */}
            {!showChat ? (
              <div className="relative bg-gradient-to-br from-white/[0.07] via-white/[0.03] to-white/[0.02] backdrop-blur-2xl backdrop-saturate-150 border border-white/20 rounded-[20px] p-8 shadow-2xl overflow-hidden flex flex-col items-center justify-center min-h-[700px]">
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[20px]">
                  <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-white/[0.15] via-white/[0.05] to-transparent"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.05),transparent_50%)]"></div>
                </div>
                <div className="absolute inset-0 rounded-[20px] shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.1)]"></div>

                <div className="relative z-10 flex flex-col items-center justify-center text-center">
                  
                  <div className="mb-6 p-8 bg-transparent rounded-[32px]">
                    <MessageSquare
                      className="w-16 h-16 text-white"
                      strokeWidth={2}
                    />
                  </div>
                  <h3 className="text-xl font-regular text-white">
                    Start A Conversation
                  </h3>
                </div>
              </div>
            ) : (
              <div className="relative bg-gradient-to-br from-white/[0.07] via-white/[0.03] to-white/[0.02] backdrop-blur-2xl backdrop-saturate-150 border border-white/20 rounded-[20px] p-6 shadow-2xl overflow-hidden min-h-[700px]">
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[20px]">
                  <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-white/[0.15] via-white/[0.05] to-transparent"></div>
                </div>
                <div className="absolute inset-0 rounded-[20px] shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.1)]"></div>

                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                    <h3 className="text-lg font-semibold">Chat</h3>
                    <button
                      onClick={() => setShowChat(false)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="flex-1 text-center text-gray-400 flex items-center justify-center">
                    <p>Select a contract to start chatting</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Apple-Style Premium Scrollbar */}
      <style jsx global>{`
        .apple-scrollbar::-webkit-scrollbar {
          width: 10px;
        }
        .apple-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 10px;
          margin: 8px 0;
        }
        .apple-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.3),
            rgba(255, 255, 255, 0.2)
          );
          border-radius: 10px;
          border: 2px solid rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }
        .apple-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.4),
            rgba(255, 255, 255, 0.3)
          );
        }
      `}</style>
    </div>
  );
};

export default PaycassoAgreements;
