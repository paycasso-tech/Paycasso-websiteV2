"use client"
import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Bell,
  User,
  Plus,
  Download,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import WalletBalanceCard from "@/components/dashboard/wallet/wallet-balance-card";
import { Transactions } from "@/components/dashboard/wallet/transactions";
import { useRouter } from "next/navigation";
import InteractiveSidebar from "@/components/dashboard/sidebar";

const DashboardClient: React.FC = () => {
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState("January");
  
  const transactions = [
    {
      id: "jessica.hanson@example.com",
      amount: "100.35 USDC",
      status: "Completed",
      counterparty: "Oliver Elijah",
    },
    {
      id: "willie.jennings@example.com",
      amount: "1324.43 USDC",
      status: "Completed",
      counterparty: "James William",
    },
    {
      id: "d.chambers@example.com",
      amount: "541.16 USDC",
      status: "Completed",
      counterparty: "Lucas Benjamin",
    },
    {
      id: "willie.jennings@example.com",
      amount: "690.75 USDC",
      status: "Completed",
      counterparty: "Alexander Henry",
    },
    {
      id: "michael.milt@example.com",
      amount: "823.14 USDC",
      status: "Pending",
      counterparty: "Surder Way",
    },
    {
      id: "michael.milt@example.com",
      amount: "1678.83 USDC",
      status: "Disputed",
      counterparty: "John Doe",
    },
    {
      id: "michael.milt@example.com",
      amount: "321.89 USDC",
      status: "Disputed",
      counterparty: "Mia Lucas",
    },
    {
      id: "deanna.curtis@example.com",
      amount: "1316.34 USDC",
      status: "Completed",
      counterparty: "Lucy Josephg",
    },
    {
      id: "alma.lawson@example.com",
      amount: "453.67 USDC",
      status: "Pending",
      counterparty: "James William",
    },
    {
      id: "tanya.hill@example.com",
      amount: "43.19 USDC",
      status: "Completed",
      counterparty: "Roel Otty",
    },
  ];

  const calendarDays = [
    { day: "", inactive: true },
    { day: "", inactive: true },
    { day: "", inactive: true },
    { day: "", inactive: true },
    { day: "", inactive: true },
    { day: "", inactive: true },
    { day: "1", date: 1 },
    { day: "2", date: 2 },
    { day: "3", date: 3 },
    { day: "4", date: 4 },
    { day: "5", date: 5 },
    { day: "6", date: 6 },
    { day: "7", date: 7 },
    { day: "8", date: 8 },
    { day: "9", date: 9 },
    { day: "10", date: 10 },
    { day: "11", date: 11 },
    { day: "12", date: 12 },
    { day: "13", date: 13 },
    { day: "14", date: 14 },
    { day: "15", date: 15 },
    { day: "16", date: 16 },
    { day: "17", date: 17 },
    { day: "18", date: 18 },
    { day: "19", date: 19 },
    { day: "20", date: 20 },
    { day: "21", date: 21 },
    { day: "22", date: 22 },
    { day: "23", date: 23 },
    { day: "24", date: 24 },
    { day: "25", date: 25 },
    { day: "26", date: 26 },
    { day: "27", date: 27 },
    { day: "28", date: 28, highlighted: true },
    { day: "29", date: 29 },
    { day: "30", date: 30 },
  ];

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return "●";
      case "Pending":
        return "●";
      case "Disputed":
        return "●";
      default:
        return "●";
    }
  };

  const handleNavigateToAgreements = () => {
    router.push("/dashboard/agreements");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white">
      {/* Sidebar */}
      <InteractiveSidebar />

      {/* Main Content */}
      <div className="ml-16 p-6 lg:p-8">
        <div className="grid grid-cols-12 gap-6 lg:gap-8">
          {/* Stats Cards */}
          <div className="col-span-12 lg:col-span-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
              <WalletBalanceCard />

              {/* Pending Escrow */}
              <div className="group bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/80 transition-all duration-300 hover:border-yellow-500/30 hover:shadow-lg hover:shadow-yellow-500/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-yellow-500/20 rounded-lg">
                    <Clock className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full border border-yellow-500/30">
                    Active
                  </div>
                </div>
                <div className="space-y-1 mb-3">
                  <h3 className="text-sm font-medium text-gray-300">Pending Escrow</h3>
                  <div className="text-2xl font-bold text-white">12</div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-yellow-300">3 awaiting approval</span>
                  <ArrowUpRight className="w-3 h-3 text-yellow-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>

              {/* Completed Deals */}
              <div className="group bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/80 transition-all duration-300 hover:border-green-500/30 hover:shadow-lg hover:shadow-green-500/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full border border-green-500/30">
                    +12.5%
                  </div>
                </div>
                <div className="space-y-1 mb-3">
                  <h3 className="text-sm font-medium text-gray-300">Completed Deals</h3>
                  <div className="text-2xl font-bold text-white">78</div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-green-300">+10 this week</span>
                  <TrendingUp className="w-3 h-3 text-green-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>

              {/* Disputes */}
              <div className="group bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/80 transition-all duration-300 hover:border-red-500/30 hover:shadow-lg hover:shadow-red-500/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  </div>
                  <div className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded-full border border-red-500/30">
                    Critical
                  </div>
                </div>
                <div className="space-y-1 mb-3">
                  <h3 className="text-sm font-medium text-gray-300">Disputes</h3>
                  <div className="text-2xl font-bold text-white">2</div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-red-300">1 requires attention</span>
                  <ArrowUpRight className="w-3 h-3 text-red-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl">
              <Transactions />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Calendar */}
            <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/80 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <h3 className="font-semibold text-white">Calendar</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setCurrentMonth("December")}
                    className="p-1.5 hover:bg-gray-700/50 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-400 hover:text-white" />
                  </button>
                  <span className="text-sm font-medium text-gray-200 px-3">
                    {currentMonth} 2024
                  </span>
                  <button 
                    onClick={() => setCurrentMonth("February")}
                    className="p-1.5 hover:bg-gray-700/50 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-400 hover:text-white" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-3">
                {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                  <div
                    key={index}
                    className="text-center text-xs font-semibold text-gray-400 py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    className={`text-center text-sm py-2 cursor-pointer rounded-lg transition-all duration-200 ${
                      day.inactive
                        ? "text-gray-600"
                        : day.date === 28
                        ? "bg-blue-600 text-white shadow-md hover:bg-blue-500"
                        : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                    }`}
                  >
                    {day.day}
                  </div>
                ))}
              </div>
            </div>

            {/* Paycasso AI Lab */}
            <div className="relative overflow-hidden bg-gradient-to-br from-purple-600/80 to-purple-800/80 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 hover:from-purple-600/90 hover:to-purple-800/90 transition-all duration-300 group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(168,85,247,0.3),transparent_70%)]"></div>
              <div className="relative">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-center mb-2">Paycasso AI Lab</h3>
                <p className="text-purple-100 text-sm text-center mb-4">
                  Smart contract analysis & risk assessment
                </p>
                <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-lg py-2.5 px-4 text-sm font-medium text-white transition-all duration-200 hover:scale-[1.02]">
                  Launch AI Assistant
                </button>
              </div>
            </div>

            {/* Pending Approvals */}
            <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/80 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Pending Approvals</h3>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
              <div className="space-y-4">
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
                    className="group p-4 bg-gray-700/30 rounded-lg border border-gray-600/30 hover:border-blue-500/50 hover:bg-gray-700/50 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-medium text-white">{item.project}</h4>
                          <div className={`w-2 h-2 rounded-full ${
                            item.priority === 'high' ? 'bg-red-400' : 
                            item.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                          }`}></div>
                        </div>
                        <p className="text-xs text-gray-400 mb-2">{item.task}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {item.from}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className="w-full bg-blue-600/80 hover:bg-blue-600 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium text-white transition-all duration-200 group-hover:scale-[1.02]">
                      Review & Approve
                    </button>
                  </div>
                ))}
              </div>
            </div>

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
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardClient;