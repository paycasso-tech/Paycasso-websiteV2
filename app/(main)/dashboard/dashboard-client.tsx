"use client"
import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Bell,
  User,
  Plus,
  Download,
} from "lucide-react";
import WalletBalanceCard from "@/components/dashboard/wallet/wallet-balance-card";
import { Transactions } from "@/components/dashboard/wallet/transactions";
import { useRouter } from "next/navigation";

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
    <div
      className="min-h-screen w-full bg-primary-900 text-white"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-16 bg-gray-800 flex flex-col items-center py-6 space-y-6">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
          <div className="w-4 h-4 bg-gray-900 rounded grid grid-cols-2 gap-0.5">
            <div className="bg-white rounded-sm"></div>
            <div className="bg-white rounded-sm"></div>
            <div className="bg-white rounded-sm"></div>
            <div className="bg-white rounded-sm"></div>
          </div>
        </div>
        <div className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer">
          <div className="w-6 h-1 bg-current rounded"></div>
        </div>
        <div 
          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer" 
          onClick={handleNavigateToAgreements}
        >
          <div className="w-6 h-6 border-2 border-current rounded"></div>
        </div>
        <div className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer">
          <div className="w-6 h-6 relative">
            <div className="w-4 h-4 border-2 border-current rounded-full absolute top-0 left-1"></div>
            <div className="w-2 h-2 bg-current rounded-full absolute bottom-0 left-2"></div>
          </div>
        </div>
        <div className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer">
          <div className="w-6 h-6 border-2 border-current rounded-lg flex items-center justify-center">
            <div className="w-2 h-2 bg-current rounded-full"></div>
          </div>
        </div>
        <div className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer">
          <div className="w-6 h-6 flex flex-col space-y-1">
            <div className="w-full h-1 bg-current rounded"></div>
            <div className="w-full h-1 bg-current rounded"></div>
            <div className="w-4 h-1 bg-current rounded"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-16 p-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Stats Cards */}
          <div className="col-span-8">
            <div className="grid grid-cols-4 gap-6 mb-8">
              <WalletBalanceCard/>

              {/* Pending Escrow */}
              <div className="bg-primary rounded-3xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white text-medium font-bold mb-2">
                    Pending Escrow
                  </h3>
                </div>
                <div className="text-2xl font-medium mb-2">12</div>
                <div className="text-xs px-2 py-1 rounded-full inline-block text-white">
                  3 awaiting approval
                </div>
              </div>

              {/* Completed Deals */}
              <div className="bg-primary rounded-3xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-400 text-sm">Completed Deals</h3>
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-white">✓</span>
                  </div>
                </div>
                <div className="text-2xl font-semibold mb-2">78</div>
                <div className="text-green-400 text-xs">+10 this week</div>
              </div>

              {/* Disputes */}
              <div className="bg-primary rounded-3xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-400 text-sm">Disputes</h3>
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-white">✕</span>
                  </div>
                </div>
                <div className="text-2xl font-semibold mb-2">2</div>
                <div className="text-red-400 text-xs">1 requires attention</div>
              </div>
            </div>

            {/* Recent Transactions */}
            <Transactions/>
          </div>

          {/* Right Sidebar */}
          <div className="col-span-4 space-y-6">
            {/* Calendar */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => setCurrentMonth("December")}>
                  <ChevronLeft className="w-4 h-4 text-gray-400" />
                </button>
                <div className="flex space-x-4">
                  <span className="text-sm font-medium">{currentMonth}</span>
                  <span className="text-sm font-medium">February</span>
                </div>
                <button onClick={() => setCurrentMonth("February")}>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {["S", "M", "T", "W", "W", "S", "S"].map((day, index) => (
                  <div
                    key={index}
                    className="text-center text-xs text-gray-400 py-2 font-medium"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    className={`text-center text-sm py-2 cursor-pointer rounded ${
                      day.inactive
                        ? "text-gray-600"
                        : day.highlighted
                        ? "bg-blue-600 text-white"
                        : day.date === 28
                        ? "bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto"
                        : "text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {day.day}
                  </div>
                ))}
              </div>
            </div>

            {/* Paycasso AI Lab */}
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-6 text-center">
              <div className="mb-4">
                <div className="w-12 h-12 mx-auto mb-3 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 text-white">⚡</div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Paycasso AI Lab</h3>
              </div>
            </div>

            {/* Pending Approvals */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Pending Approvals</h3>
              <div className="space-y-3">
                {[
                  {
                    project: "Milestone Project - Alpha",
                    task: "Task validation required",
                    time: "2 hrs ago",
                    from: "Client 2",
                  },
                  {
                    project: "Milestone Project - Beta",
                    task: "Task validation required",
                    time: "2 hrs ago",
                    from: "Client 3",
                  },
                  {
                    project: "Milestone Project - Delta",
                    task: "Task validation required",
                    time: "2 hrs ago",
                    from: "Client 1",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="text-sm font-medium">{item.project}</div>
                      <div className="text-xs text-gray-400">{item.task}</div>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                        <span>Time: {item.time}</span>
                        <span>From: {item.from}</span>
                      </div>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium">
                      Review
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Quick Actions</h3>
              <button className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg py-3 px-4 flex items-center justify-center space-x-2 font-medium">
                <Plus className="w-4 h-4" />
                <span>New Escrow</span>
              </button>
              <button className="w-full bg-gray-700 hover:bg-gray-600 rounded-lg py-3 px-4 flex items-center justify-center space-x-2 font-medium">
                <Download className="w-4 h-4" />
                <span>Release Funds</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardClient;