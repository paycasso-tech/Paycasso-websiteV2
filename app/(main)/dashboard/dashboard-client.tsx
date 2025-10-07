// "use client";
// import React, { useState } from "react";
// import {
//   ChevronLeft,
//   ChevronRight,
//   Bell,
//   Plus,
//   Download,
//   CheckCircle2,
//   Clock,
//   AlertTriangle,
//   Zap,
// } from "lucide-react";
// import WalletBalanceCard from "@/components/dashboard/wallet/wallet-balance-card";
// import { Transactions } from "@/components/dashboard/wallet/transactions";
// import { useRouter } from "next/navigation";
// import InteractiveSidebar from "@/components/dashboard/sidebar";

// const DashboardClient: React.FC = () => {
//   const router = useRouter();
//   const [currentMonth, setCurrentMonth] = useState("January");

//   const calendarDays = [
//     { day: "", inactive: true },
//     { day: "", inactive: true },
//     { day: "", inactive: true },
//     { day: "", inactive: true },
//     { day: "", inactive: true },
//     { day: "", inactive: true },
//     { day: "1", date: 1 },
//     { day: "2", date: 2 },
//     { day: "3", date: 3 },
//     { day: "4", date: 4 },
//     { day: "5", date: 5 },
//     { day: "6", date: 6 },
//     { day: "7", date: 7 },
//     { day: "8", date: 8 },
//     { day: "9", date: 9 },
//     { day: "10", date: 10 },
//     { day: "11", date: 11 },
//     { day: "12", date: 12 },
//     { day: "13", date: 13 },
//     { day: "14", date: 14 },
//     { day: "15", date: 15 },
//     { day: "16", date: 16 },
//     { day: "17", date: 17 },
//     { day: "18", date: 18 },
//     { day: "19", date: 19 },
//     { day: "20", date: 20 },
//     { day: "21", date: 21 },
//     { day: "22", date: 22 },
//     { day: "23", date: 23 },
//     { day: "24", date: 24 },
//     { day: "25", date: 25 },
//     { day: "26", date: 26 },
//     { day: "27", date: 27 },
//     { day: "28", date: 28, highlighted: true },
//     { day: "29", date: 29 },
//     { day: "30", date: 30 },
//   ];

//   return (
//     <div className="min-h-screen w-full bg-[#0a0a0a] text-white">
//       <InteractiveSidebar />

//       <div className="ml-20 p-8">
//         {/* Header Section */}
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h1 className="text-4xl font-bold text-white mb-2">
//               Welcome back, James!
//             </h1>
//             <p className="text-lg text-gray-400">
//               You Paycasso Escrow at a glance
//             </p>
//           </div>
//           <div className="flex items-center gap-4">
//             <div className="relative">
//               <Bell className="w-6 h-6 text-gray-400" />
//               <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
//             </div>
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
//                 <span className="text-white font-medium">J</span>
//               </div>
//               <span className="text-white font-medium">James</span>
//               <div className="w-2 h-2 bg-green-400 rounded-full"></div>
//             </div>
//           </div>
//         </div>

//         {/* Main Grid Layout */}
//         <div className="grid grid-cols-12 gap-6">
//           {/* Left Side - 8 columns */}
//           <div className="col-span-8 space-y-6">
//             {/* Top Row - 4 Cards */}
//             <div className="grid grid-cols-4 gap-4">
//               <WalletBalanceCard />

//               {/* Pending Escrow */}
//               <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-5 flex flex-col">
//                 <div className="flex items-center justify-between mb-3">
//                   <div className="p-2 bg-yellow-500/20 rounded-lg">
//                     <Clock className="w-5 h-5 text-yellow-400" />
//                   </div>
//                   <div className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full">
//                     Active
//                   </div>
//                 </div>
//                 <div className="space-y-1 mb-auto">
//                   <h3 className="text-sm font-medium text-gray-400">
//                     Pending Escroww
//                   </h3>
//                   <div className="text-2xl font-bold text-white">12</div>
//                 </div>
//                 <div className="text-xs text-yellow-300">
//                   3 awaiting approval
//                 </div>
//               </div>

//               {/* Completed Deals */}
//               <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-5 flex flex-col">
//                 <div className="flex items-center justify-between mb-3">
//                   <div className="p-2 bg-green-500/20 rounded-lg">
//                     <CheckCircle2 className="w-5 h-5 text-green-400" />
//                   </div>
//                   <div className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
//                     +12.5%
//                   </div>
//                 </div>
//                 <div className="space-y-1 mb-auto">
//                   <h3 className="text-sm font-medium text-gray-400">
//                     Completed Deals
//                   </h3>
//                   <div className="text-2xl font-bold text-white">78</div>
//                 </div>
//                 <div className="text-xs text-green-300">+10 this week</div>
//               </div>

//               {/* Disputes */}
//               <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-5 flex flex-col">
//                 <div className="flex items-center justify-between mb-3">
//                   <div className="p-2 bg-red-500/20 rounded-lg">
//                     <AlertTriangle className="w-5 h-5 text-red-400" />
//                   </div>
//                   <div className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded-full">
//                     Critical
//                   </div>
//                 </div>
//                 <div className="space-y-1 mb-auto">
//                   <h3 className="text-sm font-medium text-gray-400">
//                     Disputes
//                   </h3>
//                   <div className="text-2xl font-bold text-white">2</div>
//                 </div>
//                 <div className="text-xs text-red-300">1 requires attention</div>
//               </div>
//             </div>

//             {/* Bottom - Transactions Table */}
//             <div>
//               <Transactions />
//             </div>
//           </div>

//           {/* Right Side - 4 columns */}
//           <div className="col-span-4 space-y-6">
//             {/* Calendar */}
//             <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-5">
//               <div className="flex items-center justify-between mb-4">
//                 <span className="text-sm font-medium text-white">Calendar</span>
//                 <div className="flex items-center gap-2">
//                   <button className="p-1 hover:bg-gray-800 rounded">
//                     <ChevronLeft className="w-4 h-4 text-gray-400" />
//                   </button>
//                   <span className="text-sm text-gray-300">January</span>
//                   <button className="p-1 hover:bg-gray-800 rounded">
//                     <ChevronRight className="w-4 h-4 text-gray-400" />
//                   </button>
//                 </div>
//               </div>

//               <div className="grid grid-cols-7 gap-1 mb-2">
//                 {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
//                   <div
//                     key={index}
//                     className="text-center text-xs font-medium text-gray-400 py-1"
//                   >
//                     {day}
//                   </div>
//                 ))}
//               </div>

//               <div className="grid grid-cols-7 gap-1">
//                 {calendarDays.map((day, index) => (
//                   <div
//                     key={index}
//                     className={`text-center text-xs py-1 cursor-pointer rounded transition-colors ${
//                       day.inactive
//                         ? "text-gray-600"
//                         : day.date === 28
//                         ? "bg-blue-600 text-white"
//                         : "text-gray-300 hover:bg-gray-800"
//                     }`}
//                   >
//                     {day.day}
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* AI Lab */}
//             <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-500/30 rounded-xl p-5 flex flex-col justify-between">
//               <div className="flex items-center justify-center mb-4">
//                 <div className="p-3 bg-white/10 rounded-xl border border-white/20">
//                   <Zap className="w-6 h-6 text-white" />
//                 </div>
//               </div>
//               <div>
//                 <h3 className="text-lg font-bold text-center mb-2 text-white">
//                   Paycasso AI Lab
//                 </h3>
//                 <p className="text-purple-200 text-sm text-center mb-4">
//                   Smart contract analysis & risk assessment
//                 </p>
//               </div>
//               <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg py-2 text-sm font-medium text-white transition-colors">
//                 Launch AI Assistant
//               </button>
//             </div>

//             {/* Pending Approvals */}
//             <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-lg font-semibold text-white">
//                   Pending Approvals
//                 </h3>
//                 <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
//               </div>
//               <div className="space-y-4">
//                 {[
//                   {
//                     project: "Milestone Project - Alpha",
//                     task: "Task validation required",
//                     time: "2 hrs ago",
//                     from: "Client 2",
//                     priority: "high",
//                   },
//                   {
//                     project: "Milestone Project - Beta",
//                     task: "Task validation required",
//                     time: "2 hrs ago",
//                     from: "Client 3",
//                     priority: "medium",
//                   },
//                   {
//                     project: "Milestone Project - Delta",
//                     task: "Task validation required",
//                     time: "2 hrs ago",
//                     from: "Client 1",
//                     priority: "low",
//                   },
//                 ].map((item, index) => (
//                   <div
//                     key={index}
//                     className="p-4 bg-[#0f0f0f] rounded-lg border border-gray-800"
//                   >
//                     <div className="flex items-start justify-between mb-3">
//                       <div>
//                         <div className="flex items-center gap-2 mb-1">
//                           <h4 className="text-sm font-medium text-white">
//                             {item.project}
//                           </h4>
//                           <div
//                             className={`w-2 h-2 rounded-full ${
//                               item.priority === "high"
//                                 ? "bg-red-400"
//                                 : item.priority === "medium"
//                                 ? "bg-yellow-400"
//                                 : "bg-green-400"
//                             }`}
//                           ></div>
//                         </div>
//                         <p className="text-xs text-gray-400 mb-2">
//                           {item.task}
//                         </p>
//                         <div className="flex items-center gap-3 text-xs text-gray-500">
//                           <span>Time: {item.time}</span>
//                           <span>From: {item.from}</span>
//                         </div>
//                       </div>
//                     </div>
//                     <button className="w-full bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors">
//                       Review
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Quick Actions */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold text-white">
//                 Quick Actions
//               </h3>
//               <div className="grid grid-cols-1 gap-3">
//                 <button className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 rounded-xl py-4 px-6 font-semibold text-white transition-colors">
//                   <Plus className="w-5 h-5" />
//                   <span>New Escrow</span>
//                 </button>

//                 <button className="flex items-center justify-center gap-3 bg-gray-800 hover:bg-gray-700 rounded-xl py-4 px-6 font-semibold text-white transition-colors">
//                   <Download className="w-5 h-5" />
//                   <span>Release Funds</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardClient;

"use client";
import React, { useState } from "react";
import {
  Bell,
  Plus,
  Download,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Zap,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";
import WalletBalanceCard from "@/components/dashboard/wallet/wallet-balance-card";
import { Transactions } from "@/components/dashboard/wallet/transactions";
import { useRouter } from "next/navigation";
import InteractiveSidebar from "@/components/dashboard/sidebar";

const DashboardClient: React.FC = () => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [isApprovalsExpanded, setIsApprovalsExpanded] = useState(false);

  // Dates to highlight (example: important dates)
  const highlightedDates = [
    new Date(2025, 0, 7), // January 7
    new Date(2025, 0, 18), // January 18
    new Date(2025, 0, 28), // January 28
  ];

  return (
    <div className="min-h-screen w-full bg-[#00000082] text-white">
      <InteractiveSidebar />

      {/* Add global styles for glassmorphism calendar */}
      <style jsx global>{`
        .glass-calendar {
          background: rgba(26, 26, 26, 0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
          overflow: hidden;
        }

        .glass-calendar .rdp {
          --rdp-cell-size: 32px;
          --rdp-accent-color: #3b82f6;
          --rdp-background-color: rgba(59, 130, 246, 0.2);
          margin: 0;
        }

        .glass-calendar .rdp-months {
          justify-content: center;
        }

        .glass-calendar .rdp-month {
          width: 100%;
        }

        .glass-calendar .rdp-caption {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          padding: 0 32px;
          margin-bottom: 12px;
        }

        .glass-calendar .rdp-caption_label {
          font-size: 13px;
          font-weight: 600;
          color: #ffffff;
          text-transform: capitalize;
          text-align: center;
          flex: 1;
        }

        .glass-calendar .rdp-nav {
          display: flex;
          justify-content: space-between;
          position: absolute;
          left: 0;
          right: 0;
          width: 100%;
          pointer-events: none;
        }

        .glass-calendar .rdp-nav_button {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #9ca3af;
          transition: all 0.2s;
          pointer-events: all;
        }

        .glass-calendar .rdp-nav_button:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
        }

        .glass-calendar .rdp-head_cell {
          color: #9ca3af;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          padding: 6px 0;
        }

        .glass-calendar .rdp-tbody {
          border: none;
        }

        .glass-calendar .rdp-cell {
          padding: 1px;
        }

        .glass-calendar .rdp-day {
          width: 32px;
          height: 32px;
          font-size: 12px;
          color: #d1d5db;
          border-radius: 8px;
          transition: all 0.2s;
          background: transparent;
          border: none;
        }

        .glass-calendar .rdp-day:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
        }

        .glass-calendar .rdp-day_selected {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: #ffffff;
          font-weight: 600;
        }

        .glass-calendar .rdp-day_today {
          background: rgba(251, 146, 60, 0.2);
          color: #fb923c;
          font-weight: 600;
        }

        .glass-calendar .rdp-day_outside {
          color: #4b5563;
          opacity: 0.5;
        }

        /* Custom highlighted dates */
        .glass-calendar .highlighted-date {
          position: relative;
        }

        .glass-calendar .highlighted-date::after {
          content: "";
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #a855f7;
        }

        .glass-calendar .rdp-day_selected.highlighted-date::after {
          background: #ffffff;
        }
      `}</style>

      <div className="ml-20 p-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome back, James!
            </h1>
            <p className="text-lg text-gray-400">
              You Paycasso Escrow at a glance
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell className="w-6 h-6 text-gray-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">J</span>
              </div>
              <span className="text-white font-medium">James</span>
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Side - 8 columns */}
          <div className="col-span-8 space-y-6">
            {/* Top Row - 4 Cards */}
            <div className="grid grid-cols-4 gap-4">
              <WalletBalanceCard />

              {/* Pending Escrow */}
              <div className="relative bg-white/[0.03] backdrop-blur-xl backdrop-saturate-150 border border-white/20 rounded-4xl p-5 flex flex-col shadow-lg shadow-black/10 overflow-hidden">
                {/* Multi-layer glass overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 left-0 right-0 h-[50%] bg-gradient-to-b from-white/10 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-black/5 to-transparent"></div>
                </div>
                {/* Inner glow shadow */}
                <div className="absolute inset-0 rounded-2xl shadow-inner shadow-black/5"></div>

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-yellow-500/20 rounded-lg">
                      <Clock className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full">
                      Active
                    </div>
                  </div>
                  <div className="space-y-1 mb-auto">
                    <h3 className="text-sm font-medium text-gray-400">
                      Pending Escroww
                    </h3>
                    <div className="text-2xl font-bold text-white">12</div>
                  </div>
                  <div className="text-xs text-yellow-300">
                    3 awaiting approval
                  </div>
                </div>
              </div>

              {/* Completed Deals */}
              <div className="relative bg-white/[0.03] backdrop-blur-xl backdrop-saturate-150 border border-white/20 rounded-4xl p-5 flex flex-col shadow-lg shadow-black/10 overflow-hidden">
                {/* Multi-layer glass overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 left-0 right-0 h-[50%] bg-gradient-to-b from-white/10 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-black/5 to-transparent"></div>
                </div>
                {/* Inner glow shadow */}
                <div className="absolute inset-0 rounded-2xl shadow-inner shadow-black/5"></div>

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
                      +12.5%
                    </div>
                  </div>
                  <div className="space-y-1 mb-auto">
                    <h3 className="text-sm font-medium text-gray-400">
                      Completed Deals
                    </h3>
                    <div className="text-2xl font-bold text-white">78</div>
                  </div>
                  <div className="text-xs text-green-300">+10 this week</div>
                </div>
              </div>

              {/* Disputes */}
              <div className="relative bg-white/[0.03] backdrop-blur-xl backdrop-saturate-150 border border-white/20 rounded-4xl p-5 flex flex-col shadow-lg shadow-black/10 overflow-hidden">
                {/* Multi-layer glass overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 left-0 right-0 h-[50%] bg-gradient-to-b from-white/10 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-black/5 to-transparent"></div>
                </div>
                {/* Inner glow shadow */}
                <div className="absolute inset-0 rounded-2xl shadow-inner shadow-black/5"></div>

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-red-500/20 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    </div>
                    <div className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded-full">
                      Critical
                    </div>
                  </div>
                  <div className="space-y-1 mb-auto">
                    <h3 className="text-sm font-medium text-gray-400">
                      Disputes
                    </h3>
                    <div className="text-2xl font-bold text-white">2</div>
                  </div>
                  <div className="text-xs text-red-300">
                    1 requires attention
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom - Transactions Table */}
            <div>
              <Transactions />
            </div>
          </div>

          {/* Right Side - 4 columns */}
          <div className="col-span-4 space-y-6">
            {/* Calendar and AI Lab - Side by Side */}
            <div className="grid grid-cols-2 gap-4">
              {/* Glass Calendar */}
              <div className="glass-calendar">
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  modifiers={{
                    highlighted: highlightedDates,
                  }}
                  modifiersClassNames={{
                    highlighted: "highlighted-date",
                  }}
                  showOutsideDays={false}
                />
              </div>

              {/* AI Lab */}
              <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-500/30 rounded-xl p-5 flex flex-col justify-between backdrop-blur-sm">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-3 bg-white/10 rounded-xl border border-white/20">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-bold text-center mb-2 text-white">
                    Paycasso AI Lab
                  </h3>
                  <p className="text-purple-200 text-xs text-center mb-3">
                    Smart contract analysis & risk assessment
                  </p>
                </div>
                <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg py-2 text-xs font-medium text-white transition-colors">
                  Launch AI Assistant
                </button>
              </div>
            </div>

            {/* Collapsible Pending Approvals */}
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden">
              <button
                onClick={() => setIsApprovalsExpanded(!isApprovalsExpanded)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-semibold text-white">
                    Pending Approvals
                  </h3>
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                </div>
                {isApprovalsExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {isApprovalsExpanded && (
                <div className="px-4 pb-4 space-y-3 border-t border-gray-800">
                  {[
                    {
                      project: "Milestone Project - Alpha",
                      task: "Task validation required",
                      time: "2 hrs ago",
                      from: "Client 2",
                      priority: "high",
                    },
                    {
                      project: "Milestone Project - Beta",
                      task: "Task validation required",
                      time: "2 hrs ago",
                      from: "Client 3",
                      priority: "medium",
                    },
                    {
                      project: "Milestone Project - Delta",
                      task: "Task validation required",
                      time: "2 hrs ago",
                      from: "Client 1",
                      priority: "low",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="mt-3 p-3 bg-[#0f0f0f] rounded-lg border border-gray-800"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-medium text-white">
                              {item.project}
                            </h4>
                            <div
                              className={`w-2 h-2 rounded-full ${
                                item.priority === "high"
                                  ? "bg-red-400"
                                  : item.priority === "medium"
                                  ? "bg-yellow-400"
                                  : "bg-green-400"
                              }`}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-400 mb-2">
                            {item.task}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span>Time: {item.time}</span>
                            <span>From: {item.from}</span>
                          </div>
                        </div>
                      </div>
                      <button className="w-full bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors">
                        Review
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions - Always Visible */}
            <div className="space-y-3">
              <h3 className="text-base font-semibold text-white">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <button className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 rounded-xl py-3 px-6 font-semibold text-white transition-colors">
                  <Plus className="w-5 h-5" />
                  <span>New Escrow</span>
                </button>

                <button className="flex items-center justify-center gap-3 bg-gray-800 hover:bg-gray-700 rounded-xl py-3 px-6 font-semibold text-white transition-colors">
                  <Download className="w-5 h-5" />
                  <span>Release Funds</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardClient;
