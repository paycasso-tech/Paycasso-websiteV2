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
import { EscrowAgreements } from "@/components/dashboard/agreements/escrow-agreements";
import { useRouter } from "next/navigation";
import { NewEscrowButton } from "@/components/dashboard/agreements/createAgreement/create-agreement";

const PaycassoAgreements = () => {
  const router = useRouter();

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
        <div className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer">
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
        <div className="text-5xl font-light">Contracts</div>
        <div className="grid grid-cols-12 gap-8">
          {/* Stats Cards */}
          <div className="col-span-8">
            <EscrowAgreements/>
          </div>

          {/* Right Sidebar */}
          <div className="col-span-4 space-y-6">

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
              <NewEscrowButton/>
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

export default PaycassoAgreements;
