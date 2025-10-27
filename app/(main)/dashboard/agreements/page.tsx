// // "use client";
// // import React, { useState } from "react";
// // import {
// //   Bell,
// //   User,
// //   Search,
// //   ChevronDown,
// //   Plus,
// //   Download,
// //   Eye,
// //   Copy,
// //   Info,
// //   MessageSquare,
// //   RotateCw,
// // } from "lucide-react";
// // import { useRouter } from "next/navigation";
// // import InteractiveSidebar from "@/components/dashboard/sidebar";
// // import ChatSidebar from "@/components/dashboard/chat/ChatSidebar";
// // import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
// // import { useEffect, useState as useStateHook } from "react";

// // const supabase = createSupabaseBrowserClient();

// // const PaycassoAgreements = () => {
// //   const router = useRouter();
// //   const [showChat, setShowChat] = useState(false);
// //   const [selectedContract, setSelectedContract] = useState<any>(null);
// //   const [isRefreshing, setIsRefreshing] = useState(false);

// //   // Your existing state
// //   const [walletId, setWalletID] = useStateHook<any>(null);
// //   const [profileId, setProfileId] = useStateHook<any>(null);
// //   const [userId, setUserId] = useStateHook<any>(null);

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         const {
// //           data: { user: currentUser },
// //         } = await supabase.auth.getUser();

// //         if (!currentUser) {
// //           router.push("/sign-in");
// //           return;
// //         }

// //         const { data: profile } = await supabase
// //           .from("profiles")
// //           .select("id")
// //           .eq("auth_user_id", currentUser.id)
// //           .single();

// //         setProfileId(profile?.id);
// //         setUserId(currentUser.id);
// //         if (profile) {
// //           const { data: walletData } = await supabase
// //             .schema("public")
// //             .from("wallets")
// //             .select()
// //             .eq("profile_id", profile.id)
// //             .single();

// //           setWalletID(walletData?.id);
// //         }
// //       } catch (error) {
// //         console.error("Error fetching wallet data:", error);
// //       }
// //     };

// //     fetchData();
// //   }, [supabase, router]);

// //   const handleRefresh = () => {
// //     setIsRefreshing(true);
// //     setTimeout(() => {
// //       setIsRefreshing(false);
// //     }, 1500);
// //   };

// //   const handleOpenChat = (contract: any) => {
// //     setSelectedContract(contract);
// //     setShowChat(true);
// //   };

// //   // Dummy data
// //   const dummyContracts = [
// //     {
// //       id: "1",
// //       date: "June 10",
// //       counterparty: "Oliver Elijah",
// //       counterpartyId: "oliver_elijah",
// //       purpose: "Logo Design",
// //       amount: "100.35 USDC",
// //       status: "Completed",
// //       statusColor: "text-green-400",
// //     },
// //     {
// //       id: "2",
// //       date: "June 10",
// //       counterparty: "James William",
// //       counterpartyId: "james_william",
// //       purpose: "POS Integration",
// //       amount: "100.35 USDC",
// //       status: "Completed",
// //       statusColor: "text-green-400",
// //     },
// //     {
// //       id: "3",
// //       date: "June 10",
// //       counterparty: "Lucas Benjamin",
// //       counterpartyId: "lucas_benjamin",
// //       purpose: "Instagram Campaign",
// //       amount: "100.35 USDC",
// //       status: "Completed",
// //       statusColor: "text-green-400",
// //     },
// //     {
// //       id: "4",
// //       date: "June 10",
// //       counterparty: "Alexander Henry",
// //       counterpartyId: "alexander_henry",
// //       purpose: "POS Integration",
// //       amount: "100.35 USDC",
// //       status: "Completed",
// //       statusColor: "text-green-400",
// //     },
// //     {
// //       id: "5",
// //       date: "June 10",
// //       counterparty: "Oliver Elijah",
// //       counterpartyId: "oliver_elijah",
// //       purpose: "Import/Export Escrow",
// //       amount: "100.35 USDC",
// //       status: "Pending",
// //       statusColor: "text-yellow-400",
// //     },
// //   ];

// //   return (
// //     <div className="min-h-screen w-full bg-[#000000] text-white overflow-hidden">
// //       <InteractiveSidebar />

// //       <div className="ml-[88px] p-8 h-screen overflow-y-auto">
// //         {/* Page Header */}
// //         <div className="mb-10 flex items-center justify-between">
// //           <h1 className="text-4xl font-semibold text-white">Contracts</h1>

// //           <div className="flex items-center gap-4">
// //             <button className="relative bg-white/[0.03] backdrop-blur-xl border border-white/20 rounded-full p-2.5 hover:bg-white/[0.08] transition-all">
// //               <Bell className="w-5 h-5" />
// //               <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
// //                 5
// //               </div>
// //             </button>
// //             <button className="flex items-center gap-2 bg-white/[0.03] backdrop-blur-xl border border-white/20 rounded-full py-2 px-4 hover:bg-white/[0.08] transition-all">
// //               <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-sm font-semibold">
// //                 <User className="w-5 h-5" />
// //               </div>
// //               <span className="text-sm font-medium">Vicky Shaw</span>
// //             </button>
// //           </div>
// //         </div>

// //         <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
// //           {/* Main Content */}
// //           <div className="xl:col-span-8 space-y-6">
// //             {/* Search Bar & Filters */}
// //             <div className="flex items-center justify-between gap-4">
// //               <div className="flex items-center gap-4">
// //                 <div className="relative">
// //                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
// //                   <input
// //                     type="text"
// //                     placeholder="Search Here"
// //                     className="pl-11 pr-4 py-3 w-64 bg-white/[0.05] backdrop-blur-xl border border-white/20 rounded-[20px] text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
// //                   />
// //                 </div>
// //                 <button className="flex items-center gap-2 px-5 py-3 bg-white/[0.05] backdrop-blur-xl border border-white/20 rounded-[20px] text-sm font-light hover:bg-white/[0.08] whitespace-nowrap">
// //                   Filters <ChevronDown className="w-4 h-4" />
// //                 </button>
// //                 <button className="flex items-center gap-2 px-5 py-3 bg-white/[0.05] backdrop-blur-xl border border-white/20 rounded-[20px] text-sm font-light hover:bg-white/[0.08] whitespace-nowrap">
// //                   Contact Types <ChevronDown className="w-4 h-4" />
// //                 </button>
// //                 <button
// //                   onClick={handleRefresh}
// //                   disabled={isRefreshing}
// //                   className="p-3 bg-white/[0.05] backdrop-blur-xl border border-white/20 rounded-[20px] hover:bg-white/[0.08]"
// //                 >
// //                   <RotateCw
// //                     className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
// //                   />
// //                 </button>
// //               </div>

// //               <div className="flex items-center gap-3">
// //                 <button className="flex items-center gap-2 px-5 py-3 bg-white/[0.05] backdrop-blur-xl border border-white/20 rounded-[20px] text-sm font-light hover:bg-white/[0.08] whitespace-nowrap">
// //                   <Plus className="w-4 h-4" /> Add New Contract
// //                 </button>
// //                 <button className="flex items-center gap-2 px-5 py-3 bg-white/[0.05] backdrop-blur-xl border border-white/20 rounded-[20px] text-sm font-light hover:bg-white/[0.08] whitespace-nowrap">
// //                   <Download className="w-4 h-4" /> Export CSV
// //                 </button>
// //               </div>
// //             </div>

// //             {/* Contracts Table */}
// //             <div className="relative bg-gradient-to-br from-white/[0.07] via-white/[0.03] to-white/[0.02] backdrop-blur-2xl backdrop-saturate-150 border border-white/20 rounded-[36px] shadow-2xl overflow-hidden">
// //               <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[36px]">
// //                 <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-white/[0.15] via-white/[0.05] to-transparent"></div>
// //                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]"></div>
// //               </div>
// //               <div className="absolute inset-0 rounded-[36px] shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.1)]"></div>

// //               <div className="relative z-10 overflow-x-auto overflow-y-auto max-h-[650px] apple-scrollbar">
// //                 <table className="w-full">
// //                   <thead className="sticky top-0 bg-[#0a0a0a]/95 backdrop-blur-2xl z-10">
// //                     <tr className="border-b border-white/10">
// //                       <th className="text-left py-5 px-6 text-sm font-normal text-gray-400">
// //                         Date
// //                       </th>
// //                       <th className="text-left py-5 px-6 text-sm font-normal text-gray-400">
// //                         Counterparty
// //                       </th>
// //                       <th className="text-left py-5 px-6 text-sm font-normal text-gray-400">
// //                         Purpose
// //                       </th>
// //                       <th className="text-left py-5 px-6 text-sm font-normal text-gray-400">
// //                         Amount
// //                       </th>
// //                       <th className="text-left py-5 px-6 text-sm font-normal text-gray-400">
// //                         Status
// //                       </th>
// //                       <th className="text-right py-5 px-6 text-sm font-normal text-gray-400">
// //                         Actions
// //                       </th>
// //                     </tr>
// //                   </thead>
// //                   <tbody
// //                     className={isRefreshing ? "opacity-50" : "opacity-100"}
// //                   >
// //                     {dummyContracts.map((contract) => (
// //                       <tr
// //                         key={contract.id}
// //                         className="border-b border-white/5 hover:bg-white/5"
// //                       >
// //                         <td className="py-5 px-6 text-sm font-light text-white/90">
// //                           {contract.date}
// //                         </td>
// //                         <td className="py-5 px-6 text-sm font-light text-white/90">
// //                           {contract.counterparty}
// //                         </td>
// //                         <td className="py-5 px-6 text-sm font-light text-white/90">
// //                           {contract.purpose}
// //                         </td>
// //                         <td className="py-5 px-6 text-sm font-normal text-white">
// //                           {contract.amount}
// //                         </td>
// //                         <td className="py-5 px-6">
// //                           <div className="flex items-center gap-2">
// //                             <div
// //                               className={`w-2 h-2 rounded-full ${
// //                                 contract.status === "Completed"
// //                                   ? "bg-green-400"
// //                                   : "bg-yellow-400"
// //                               }`}
// //                             ></div>
// //                             <span
// //                               className={`text-sm font-light ${contract.statusColor}`}
// //                             >
// //                               {contract.status}
// //                             </span>
// //                           </div>
// //                         </td>
// //                         <td className="py-5 px-6">
// //                           <div className="flex items-center justify-end gap-3">
// //                             <button className="p-2 hover:bg-white/10 rounded-xl">
// //                               <Eye className="w-4 h-4 text-gray-400 hover:text-white" />
// //                             </button>
// //                             <button className="p-2 hover:bg-white/10 rounded-xl">
// //                               <Copy className="w-4 h-4 text-gray-400 hover:text-white" />
// //                             </button>
// //                             <button className="p-2 hover:bg-white/10 rounded-xl">
// //                               <Info className="w-4 h-4 text-gray-400 hover:text-white" />
// //                             </button>
// //                             <button
// //                               onClick={() => handleOpenChat(contract)}
// //                               className="p-2 hover:bg-white/10 rounded-xl"
// //                             >
// //                               <MessageSquare className="w-4 h-4 text-gray-400 hover:text-white" />
// //                             </button>
// //                           </div>
// //                         </td>
// //                       </tr>
// //                     ))}
// //                   </tbody>
// //                 </table>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Chat Sidebar */}
// //           <div
// //             className={`${
// //               showChat ? "xl:col-span-5" : "xl:col-span-4"
// //             } transition-all duration-300`}
// //           >
// //             {showChat && selectedContract ? (
// //               <div className="h-[700px]">
// //                 <ChatSidebar
// //                   contractId={selectedContract.id}
// //                   counterpartyId={selectedContract.counterpartyId}
// //                   counterpartyName={selectedContract.counterparty}
// //                   contractStatus={selectedContract.status}
// //                   onClose={() => setShowChat(false)}
// //                 />
// //               </div>
// //             ) : (
// //               <div className="relative bg-gradient-to-br from-white/[0.07] via-white/[0.03] to-white/[0.02] backdrop-blur-2xl backdrop-saturate-150 border border-white/20 rounded-[36px] p-8 shadow-2xl overflow-hidden flex flex-col items-center justify-center h-[700px]">
// //                 <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[36px]">
// //                   <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-white/[0.15] via-white/[0.05] to-transparent"></div>
// //                 </div>
// //                 <div className="relative z-10 text-center">
// //                   <div className="mb-6 p-8 bg-white/95 backdrop-blur-md rounded-[32px] shadow-2xl inline-block">
// //                     <MessageSquare
// //                       className="w-16 h-16 text-black"
// //                       strokeWidth={2}
// //                     />
// //                   </div>
// //                   <h3 className="text-2xl font-semibold text-white">
// //                     Start A Conversation
// //                   </h3>
// //                 </div>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </div>

// //       <style jsx global>{`
// //         .apple-scrollbar::-webkit-scrollbar {
// //           width: 10px;
// //         }
// //         .apple-scrollbar::-webkit-scrollbar-track {
// //           background: rgba(255, 255, 255, 0.03);
// //           border-radius: 10px;
// //         }
// //         .apple-scrollbar::-webkit-scrollbar-thumb {
// //           background: linear-gradient(
// //             to bottom,
// //             rgba(255, 255, 255, 0.3),
// //             rgba(255, 255, 255, 0.2)
// //           );
// //           border-radius: 10px;
// //         }
// //       `}</style>
// //     </div>
// //   );
// // };

// // export default PaycassoAgreements;


// "use client";
// import React, { useState } from "react";
// import {
//   Bell,
//   User,
//   Search,
//   ChevronDown,
//   Plus,
//   Download,
//   Eye,
//   Copy,
//   Info,
//   MessageSquare,
//   RotateCw,
// } from "lucide-react";
// import { useRouter } from "next/navigation";
// import InteractiveSidebar from "@/components/dashboard/sidebar";
// import ChatSidebar from "@/components/dashboard/chat/ChatSidebar";
// import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
// import { useEffect, useState as useStateHook } from "react";

// const supabase = createSupabaseBrowserClient();

// const PaycassoAgreements = () => {
//   const router = useRouter();
//   const [showChat, setShowChat] = useState(false);
//   const [selectedContract, setSelectedContract] = useState<any>(null);
//   const [isRefreshing, setIsRefreshing] = useState(false);

//   // Your existing state
//   const [walletId, setWalletID] = useStateHook<any>(null);
//   const [profileId, setProfileId] = useStateHook<any>(null);
//   const [userId, setUserId] = useStateHook<any>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const {
//           data: { user: currentUser },
//         } = await supabase.auth.getUser();

//         if (!currentUser) {
//           router.push("/sign-in");
//           return;
//         }

//         const { data: profile } = await supabase
//           .from("profiles")
//           .select("id")
//           .eq("auth_user_id", currentUser.id)
//           .single();

//         setProfileId(profile?.id);
//         setUserId(currentUser.id);
//         if (profile) {
//           const { data: walletData } = await supabase
//             .schema("public")
//             .from("wallets")
//             .select()
//             .eq("profile_id", profile.id)
//             .single();

//           setWalletID(walletData?.id);
//         }
//       } catch (error) {
//         console.error("Error fetching wallet data:", error);
//       }
//     };

//     fetchData();
//   }, [supabase, router]);

//   const handleRefresh = () => {
//     setIsRefreshing(true);
//     setTimeout(() => {
//       setIsRefreshing(false);
//     }, 1500);
//   };

//   const handleOpenChat = (contract: any) => {
//     setSelectedContract(contract);
//     setShowChat(true);
//   };

//   // Dummy data
//   const dummyContracts = [
//     {
//       id: "1",
//       date: "June 10",
//       counterparty: "Oliver Elijah",
//       counterpartyId: "oliver_elijah",
//       purpose: "Logo Design",
//       amount: "100.35 USDC",
//       status: "Completed",
//       statusColor: "text-green-400",
//     },
//     {
//       id: "2",
//       date: "June 10",
//       counterparty: "James William",
//       counterpartyId: "james_william",
//       purpose: "POS Integration",
//       amount: "100.35 USDC",
//       status: "Completed",
//       statusColor: "text-green-400",
//     },
//     {
//       id: "3",
//       date: "June 10",
//       counterparty: "Lucas Benjamin",
//       counterpartyId: "lucas_benjamin",
//       purpose: "Instagram Campaign",
//       amount: "100.35 USDC",
//       status: "Completed",
//       statusColor: "text-green-400",
//     },
//     {
//       id: "4",
//       date: "June 10",
//       counterparty: "Alexander Henry",
//       counterpartyId: "alexander_henry",
//       purpose: "POS Integration",
//       amount: "100.35 USDC",
//       status: "Completed",
//       statusColor: "text-green-400",
//     },
//     {
//       id: "5",
//       date: "June 10",
//       counterparty: "Oliver Elijah",
//       counterpartyId: "oliver_elijah",
//       purpose: "Import/Export Escrow",
//       amount: "100.35 USDC",
//       status: "Pending",
//       statusColor: "text-yellow-400",
//     },
//   ];

//   return (
//     <div className="min-h-screen w-full bg-[#000000] text-white overflow-hidden">
//       <InteractiveSidebar />

//       <div className="ml-[88px] p-8 h-screen overflow-y-auto">
//         {/* Page Header */}
//         <div className="mb-10 flex items-center justify-between">
//           <h1 className="text-4xl font-semibold text-white">Contracts</h1>

//           <div className="flex items-center gap-4">
//             <button className="relative bg-white/[0.03] backdrop-blur-xl border border-white/20 rounded-full p-2.5 hover:bg-white/[0.08] transition-all">
//               <Bell className="w-5 h-5" />
//               <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
//                 5
//               </div>
//             </button>
//             <button className="flex items-center gap-2 bg-white/[0.03] backdrop-blur-xl border border-white/20 rounded-full py-2 px-4 hover:bg-white/[0.08] transition-all">
//               <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-sm font-semibold">
//                 <User className="w-5 h-5" />
//               </div>
//               <span className="text-sm font-medium">Vicky Shaw</span>
//             </button>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
//           {/* Main Content */}
//           <div className="xl:col-span-2 space-y-6">
//             {/* Search Bar & Filters */}
//             <div className="flex items-center justify-between gap-4 flex-wrap">
//               <div className="flex items-center gap-4 flex-wrap">
//                 <div className="relative">
//                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
//                   <input
//                     type="text"
//                     placeholder="Search Here"
//                     className="pl-11 pr-4 py-3 w-64 bg-white/[0.05] backdrop-blur-xl border border-white/20 rounded-[20px] text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
//                   />
//                 </div>
//                 <button className="flex items-center gap-2 px-5 py-3 bg-white/[0.05] backdrop-blur-xl border border-white/20 rounded-[20px] text-sm font-light hover:bg-white/[0.08] whitespace-nowrap">
//                   Filters <ChevronDown className="w-4 h-4" />
//                 </button>
//                 <button className="flex items-center gap-2 px-5 py-3 bg-white/[0.05] backdrop-blur-xl border border-white/20 rounded-[20px] text-sm font-light hover:bg-white/[0.08] whitespace-nowrap">
//                   Contact Types <ChevronDown className="w-4 h-4" />
//                 </button>
//                 <button
//                   onClick={handleRefresh}
//                   disabled={isRefreshing}
//                   className="p-3 bg-white/[0.05] backdrop-blur-xl border border-white/20 rounded-[20px] hover:bg-white/[0.08]"
//                 >
//                   <RotateCw
//                     className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
//                   />
//                 </button>
//               </div>

//               <div className="flex items-center gap-3">
//                 <button className="flex items-center gap-2 px-5 py-3 bg-white/[0.05] backdrop-blur-xl border border-white/20 rounded-[20px] text-sm font-light hover:bg-white/[0.08] whitespace-nowrap">
//                   <Plus className="w-4 h-4" /> Add New Contract
//                 </button>
//                 <button className="flex items-center gap-2 px-5 py-3 bg-white/[0.05] backdrop-blur-xl border border-white/20 rounded-[20px] text-sm font-light hover:bg-white/[0.08] whitespace-nowrap">
//                   <Download className="w-4 h-4" /> Export CSV
//                 </button>
//               </div>
//             </div>

//             {/* Contracts Table */}
//             <div className="relative bg-gradient-to-br from-white/[0.07] via-white/[0.03] to-white/[0.02] backdrop-blur-2xl backdrop-saturate-150 border border-white/20 rounded-[36px] shadow-2xl overflow-hidden">
//               <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[36px]">
//                 <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-white/[0.15] via-white/[0.05] to-transparent"></div>
//                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]"></div>
//               </div>
//               <div className="absolute inset-0 rounded-[36px] shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.1)]"></div>

//               <div className="relative z-10 overflow-x-auto overflow-y-auto max-h-[650px] apple-scrollbar">
//                 <table className="w-full">
//                   <thead className="sticky top-0 bg-[#0a0a0a]/95 backdrop-blur-2xl z-10">
//                     <tr className="border-b border-white/10">
//                       <th className="text-left py-5 px-6 text-sm font-normal text-gray-400">
//                         Date
//                       </th>
//                       <th className="text-left py-5 px-6 text-sm font-normal text-gray-400">
//                         Counterparty
//                       </th>
//                       <th className="text-left py-5 px-6 text-sm font-normal text-gray-400">
//                         Purpose
//                       </th>
//                       <th className="text-left py-5 px-6 text-sm font-normal text-gray-400">
//                         Amount
//                       </th>
//                       <th className="text-left py-5 px-6 text-sm font-normal text-gray-400">
//                         Status
//                       </th>
//                       <th className="text-right py-5 px-6 text-sm font-normal text-gray-400">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody
//                     className={isRefreshing ? "opacity-50" : "opacity-100"}
//                   >
//                     {dummyContracts.map((contract) => (
//                       <tr
//                         key={contract.id}
//                         className="border-b border-white/5 hover:bg-white/5"
//                       >
//                         <td className="py-5 px-6 text-sm font-light text-white/90">
//                           {contract.date}
//                         </td>
//                         <td className="py-5 px-6 text-sm font-light text-white/90">
//                           {contract.counterparty}
//                         </td>
//                         <td className="py-5 px-6 text-sm font-light text-white/90">
//                           {contract.purpose}
//                         </td>
//                         <td className="py-5 px-6 text-sm font-normal text-white">
//                           {contract.amount}
//                         </td>
//                         <td className="py-5 px-6">
//                           <div className="flex items-center gap-2">
//                             <div
//                               className={`w-2 h-2 rounded-full ${
//                                 contract.status === "Completed"
//                                   ? "bg-green-400"
//                                   : "bg-yellow-400"
//                               }`}
//                             ></div>
//                             <span
//                               className={`text-sm font-light ${contract.statusColor}`}
//                             >
//                               {contract.status}
//                             </span>
//                           </div>
//                         </td>
//                         <td className="py-5 px-6">
//                           <div className="flex items-center justify-end gap-3">
//                             <button className="p-2 hover:bg-white/10 rounded-xl">
//                               <Eye className="w-4 h-4 text-gray-400 hover:text-white" />
//                             </button>
//                             <button className="p-2 hover:bg-white/10 rounded-xl">
//                               <Copy className="w-4 h-4 text-gray-400 hover:text-white" />
//                             </button>
//                             <button className="p-2 hover:bg-white/10 rounded-xl">
//                               <Info className="w-4 h-4 text-gray-400 hover:text-white" />
//                             </button>
//                             <button
//                               onClick={() => handleOpenChat(contract)}
//                               className="p-2 hover:bg-white/10 rounded-xl"
//                             >
//                               <MessageSquare className="w-4 h-4 text-gray-400 hover:text-white" />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>

//           {/* Chat Sidebar - Fixed Column */}
//           <div className="xl:col-span-1">
//             {showChat && selectedContract ? (
//               <div className="h-[700px]">
//                 <ChatSidebar
//                   contractId={selectedContract.id}
//                   counterpartyId={selectedContract.counterpartyId}
//                   counterpartyName={selectedContract.counterparty}
//                   onClose={() => setShowChat(false)}
//                 />
//               </div>
//             ) : (
//               <div className="relative bg-gradient-to-br from-white/[0.07] via-white/[0.03] to-white/[0.02] backdrop-blur-2xl backdrop-saturate-150 border border-white/20 rounded-[36px] p-8 shadow-2xl overflow-hidden flex flex-col items-center justify-center h-[700px]">
//                 <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[36px]">
//                   <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-white/[0.15] via-white/[0.05] to-transparent"></div>
//                 </div>
//                 <div className="relative z-10 text-center">
//                   <div className="mb-6 p-8 bg-white/95 backdrop-blur-md rounded-[32px] shadow-2xl inline-block">
//                     <MessageSquare
//                       className="w-16 h-16 text-black"
//                       strokeWidth={2}
//                     />
//                   </div>
//                   <h3 className="text-2xl font-semibold text-white">
//                     Start A Conversation
//                   </h3>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <style jsx global>{`
//         .apple-scrollbar::-webkit-scrollbar {
//           width: 10px;
//         }
//         .apple-scrollbar::-webkit-scrollbar-track {
//           background: rgba(255, 255, 255, 0.03);
//           border-radius: 10px;
//         }
//         .apple-scrollbar::-webkit-scrollbar-thumb {
//           background: linear-gradient(
//             to bottom,
//             rgba(255, 255, 255, 0.3),
//             rgba(255, 255, 255, 0.2)
//           );
//           border-radius: 10px;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default PaycassoAgreements;

"use client";
import React, { useState, useEffect } from "react";
import {
  Bell,
  User,
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
import ChatSidebar from "@/components/dashboard/chat/ChatSidebar";

const PaycassoAgreements = () => {
  const router = useRouter();
  const [showChat, setShowChat] = useState(false);
  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [walletId, setWalletID] = useState<any>(null);
  const [profileId, setProfileId] = useState<any>(null);
  const [userId, setUserId] = useState<any>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check NextAuth session
        const sessionResponse = await fetch("/api/auth/session");
        const session = await sessionResponse.json();

        if (!session?.user) {
          router.push("/sign-in");
          return;
        }

        setUserId(session.user.id);
        setUserEmail(session.user.email || "");

        // Fetch wallet data from PostgreSQL
        const walletResponse = await fetch("/api/user/wallet");
        const walletData = await walletResponse.json();

        if (walletData.wallet) {
          setWalletID(walletData.wallet.id);
          setProfileId(walletData.profile?.id);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  const handleOpenChat = (contract: any) => {
    setSelectedContract(contract);
    setShowChat(true);
  };

  // Dummy data
  const dummyContracts = [
    {
      id: "1",
      date: "June 10",
      counterparty: "Oliver Elijah",
      counterpartyId: "oliver_elijah",
      purpose: "Logo Design",
      amount: "100.35 USDC",
      status: "Completed",
      statusColor: "text-green-400",
    },
    {
      id: "2",
      date: "June 10",
      counterparty: "James William",
      counterpartyId: "james_william",
      purpose: "POS Integration",
      amount: "100.35 USDC",
      status: "Completed",
      statusColor: "text-green-400",
    },
    {
      id: "3",
      date: "June 10",
      counterparty: "Lucas Benjamin",
      counterpartyId: "lucas_benjamin",
      purpose: "Instagram Campaign",
      amount: "100.35 USDC",
      status: "Completed",
      statusColor: "text-green-400",
    },
    {
      id: "4",
      date: "June 10",
      counterparty: "Alexander Henry",
      counterpartyId: "alexander_henry",
      purpose: "POS Integration",
      amount: "100.35 USDC",
      status: "Completed",
      statusColor: "text-green-400",
    },
    {
      id: "5",
      date: "June 10",
      counterparty: "Oliver Elijah",
      counterpartyId: "oliver_elijah",
      purpose: "Import/Export Escrow",
      amount: "100.35 USDC",
      status: "Pending",
      statusColor: "text-yellow-400",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#000000] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#000000] text-white overflow-hidden">
      <InteractiveSidebar />

      <div className="ml-[88px] p-8 h-screen overflow-y-auto">
        {/* Page Header */}
        <div className="mb-10 flex items-center justify-between">
          <h1 className="text-4xl font-semibold text-white">Contracts</h1>

          <div className="flex items-center gap-4">
            <button className="relative bg-white/[0.03] backdrop-blur-xl border border-white/20 rounded-full p-2.5 hover:bg-white/[0.08] transition-all">
              <Bell className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
                5
              </div>
            </button>
            <button className="flex items-center gap-2 bg-white/[0.03] backdrop-blur-xl border border-white/20 rounded-full py-2 px-4 hover:bg-white/[0.08] transition-all">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-sm font-semibold">
                {userEmail.substring(0, 2).toUpperCase()}
              </div>
              <span className="text-sm font-medium">{userEmail}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-6">
            {/* Search Bar & Filters */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                  <input
                    type="text"
                    placeholder="Search Here"
                    className="pl-11 pr-4 py-3 w-64 bg-white/[0.05] backdrop-blur-xl border border-white/20 rounded-[20px] text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
                <button className="flex items-center gap-2 px-5 py-3 bg-white/[0.05] backdrop-blur-xl border border-white/20 rounded-[20px] text-sm font-light hover:bg-white/[0.08] whitespace-nowrap">
                  Filters <ChevronDown className="w-4 h-4" />
                </button>
                <button className="flex items-center gap-2 px-5 py-3 bg-white/[0.05] backdrop-blur-xl border border-white/20 rounded-[20px] text-sm font-light hover:bg-white/[0.08] whitespace-nowrap">
                  Contact Types <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="p-3 bg-white/[0.05] backdrop-blur-xl border border-white/20 rounded-[20px] hover:bg-white/[0.08]"
                >
                  <RotateCw
                    className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-5 py-3 bg-white/[0.05] backdrop-blur-xl border border-white/20 rounded-[20px] text-sm font-light hover:bg-white/[0.08] whitespace-nowrap">
                  <Plus className="w-4 h-4" /> Add New Contract
                </button>
                <button className="flex items-center gap-2 px-5 py-3 bg-white/[0.05] backdrop-blur-xl border border-white/20 rounded-[20px] text-sm font-light hover:bg-white/[0.08] whitespace-nowrap">
                  <Download className="w-4 h-4" /> Export CSV
                </button>
              </div>
            </div>

            {/* Contracts Table */}
            <div className="relative bg-gradient-to-br from-white/[0.07] via-white/[0.03] to-white/[0.02] backdrop-blur-2xl backdrop-saturate-150 border border-white/20 rounded-[36px] shadow-2xl overflow-hidden">
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[36px]">
                <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-white/[0.15] via-white/[0.05] to-transparent"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]"></div>
              </div>
              <div className="absolute inset-0 rounded-[36px] shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.1)]"></div>

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
                    className={isRefreshing ? "opacity-50" : "opacity-100"}
                  >
                    {dummyContracts.map((contract) => (
                      <tr
                        key={contract.id}
                        className="border-b border-white/5 hover:bg-white/5"
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
                                  : "bg-yellow-400"
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
                            <button className="p-2 hover:bg-white/10 rounded-xl">
                              <Eye className="w-4 h-4 text-gray-400 hover:text-white" />
                            </button>
                            <button className="p-2 hover:bg-white/10 rounded-xl">
                              <Copy className="w-4 h-4 text-gray-400 hover:text-white" />
                            </button>
                            <button className="p-2 hover:bg-white/10 rounded-xl">
                              <Info className="w-4 h-4 text-gray-400 hover:text-white" />
                            </button>
                            <button
                              onClick={() => handleOpenChat(contract)}
                              className="p-2 hover:bg-white/10 rounded-xl"
                            >
                              <MessageSquare className="w-4 h-4 text-gray-400 hover:text-white" />
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

          {/* Chat Sidebar - Fixed Column */}
          <div className="xl:col-span-1">
            {showChat && selectedContract ? (
              <div className="h-[700px]">
                <ChatSidebar
                  contractId={selectedContract.id}
                  counterpartyId={selectedContract.counterpartyId}
                  counterpartyName={selectedContract.counterparty}
                  onClose={() => setShowChat(false)}
                />
              </div>
            ) : (
              <div className="relative bg-gradient-to-br from-white/[0.07] via-white/[0.03] to-white/[0.02] backdrop-blur-2xl backdrop-saturate-150 border border-white/20 rounded-[36px] p-8 shadow-2xl overflow-hidden flex flex-col items-center justify-center h-[700px]">
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[36px]">
                  <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-white/[0.15] via-white/[0.05] to-transparent"></div>
                </div>
                <div className="relative z-10 text-center">
                  <div className="mb-6 p-8 bg-white/95 backdrop-blur-md rounded-[32px] shadow-2xl inline-block">
                    <MessageSquare
                      className="w-16 h-16 text-black"
                      strokeWidth={2}
                    />
                  </div>
                  <h3 className="text-2xl font-semibold text-white">
                    Start A Conversation
                  </h3>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .apple-scrollbar::-webkit-scrollbar {
          width: 10px;
        }
        .apple-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 10px;
        }
        .apple-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.3),
            rgba(255, 255, 255, 0.2)
          );
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default PaycassoAgreements;
