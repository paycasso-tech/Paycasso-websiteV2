"use client"
import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Bell,
  User,
  Plus,
  Download,
  Zap,
  Clock,
  Users,
  ArrowDownLeft,
} from "lucide-react";
import WalletBalanceCard from "@/components/dashboard/wallet/wallet-balance-card";
import { Transactions } from "@/components/dashboard/wallet/transactions";
import { EscrowAgreements } from "@/components/dashboard/agreements/escrow-agreements";
import { useRouter } from "next/navigation";
import { NewEscrowButton } from "@/components/dashboard/agreements/createAgreement/create-agreement";
import InteractiveSidebar from "@/components/dashboard/sidebar";

const PaycassoAgreements = () => {
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "text-emerald-400";
      case "Pending":
        return "text-amber-400";
      case "Disputed":
        return "text-red-400";
      default:
        return "text-slate-400";
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
      className="min-h-screen w-full bg-slate-900 text-white"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Sidebar */}
      <InteractiveSidebar/>

      {/* Main Content */}
      <div className="ml-16 p-6 lg:p-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-light text-white mb-2">
            Contracts
          </h1>
          <p className="text-slate-400 text-lg">
            Manage your escrow agreements and smart contracts
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
          {/* Main Content Area */}
          <div className="xl:col-span-8">
            <EscrowAgreements/>
          </div>

          {/* Right Sidebar */}
          <div className="xl:col-span-4 space-y-6">
            {/* Paycasso AI Lab - Enhanced */}
            <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 rounded-xl p-6 shadow-lg border border-purple-500/20">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-4 -translate-x-4"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-center w-14 h-14 mx-auto mb-4 bg-white/15 backdrop-blur-sm rounded-xl border border-white/20">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">
                  Paycasso AI Lab
                </h3>
                <p className="text-center text-purple-100 text-sm mb-4">
                  AI-powered contract analysis and insights
                </p>
                <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-lg py-2.5 px-4 text-sm font-medium transition-all duration-200 hover:scale-[1.02]">
                  Launch AI Assistant
                </button>
              </div>
            </div>

            {/* Pending Approvals - Enhanced */}
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold text-white">Pending Approvals</h3>
                <div className="flex items-center justify-center w-8 h-8 bg-amber-500/20 rounded-lg">
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
              </div>
              
              <div className="space-y-4">
                {[
                  {
                    project: "Milestone Project - Alpha",
                    task: "Task validation required",
                    time: "2 hrs ago",
                    from: "Client 2",
                    priority: "high"
                  },
                  {
                    project: "Milestone Project - Beta",
                    task: "Task validation required",
                    time: "2 hrs ago",
                    from: "Client 3",
                    priority: "medium"
                  },
                  {
                    project: "Milestone Project - Delta",
                    task: "Task validation required",
                    time: "2 hrs ago",
                    from: "Client 1",
                    priority: "low"
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-slate-700/40 border border-slate-600/30 rounded-lg p-4 hover:bg-slate-700/60 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-white mb-1">
                          {item.project}
                        </h4>
                        <p className="text-xs text-slate-300 mb-2">
                          {item.task}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {item.from}
                          </span>
                        </div>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${
                        item.priority === 'high' ? 'bg-red-400' : 
                        item.priority === 'medium' ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}></div>
                    </div>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg py-2.5 px-4 text-sm font-medium transition-all duration-200 hover:scale-[1.02] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800">
                      Review & Approve
                    </button>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 text-sm text-slate-400 hover:text-white transition-colors duration-200 py-2">
                View all pending approvals
              </button>
            </div>

            {/* Quick Actions - Enhanced */}
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-white mb-5">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-3">
                <NewEscrowButton/>
                <button className="group flex items-center justify-center gap-3 bg-gray-700/60 hover:bg-gray-700 backdrop-blur-sm border border-gray-600/50 rounded-xl py-4 px-6 font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-gray-700/25">
                    <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform duration-200" />
                    <span>Release Funds</span>
                    <ArrowDownLeft className="w-4 h-4 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
                  </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaycassoAgreements;