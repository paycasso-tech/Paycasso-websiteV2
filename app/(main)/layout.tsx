"use client";

import Link from "next/link";
import { hasEnvVars } from "@/lib/utils/supabase/check-env-vars";
import AuthButton from "@/components/dashboard/header-auth";
import { EnvVarWarning } from "@/components/dashboard/env-var-warning";
import { useEffect, useState } from "react";
import { IoNotifications } from "react-icons/io5";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<{ name?: string; email?: string } | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Check for authentication tokens in localStorage
    const checkAuth = () => {
      const token = localStorage.getItem('supabase.auth.token') || 
                   localStorage.getItem('auth_token') || 
                   localStorage.getItem('access_token') ||
                   localStorage.getItem('sb-auth-token');
      
      const userSession = localStorage.getItem('supabase.auth.session') ||
                          localStorage.getItem('user_session');
      
      if (token || userSession) {
        setIsAuthenticated(true);
        
        // Try to get user info from localStorage
        try {
          const storedUser = localStorage.getItem('user_data') || 
                           localStorage.getItem('supabase.auth.user') ||
                           localStorage.getItem('user_profile');
          
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUserInfo({
              name: userData.name || userData.user_metadata?.name || userData.full_name,
              email: userData.email
            });
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    };

    checkAuth();

    // Update time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timeInterval);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getWelcomeMessage = () => {
    if (isAuthenticated) {
      const greeting = getGreeting();
      const name = userInfo?.name?.split(' ')[0] || "there";
      return `${greeting}, ${name}`;
    }
    return "Welcome back";
  };

  const getSubMessage = () => {
    if (isAuthenticated) {
      return "Here's your Paycasso Escrow dashboard overview";
    }
    return "Your Paycasso Escrow at a glance";
  };

  return (
    <main className="flex flex-col items-center w-screen h-full bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.1),transparent_50%)] pointer-events-none"></div>

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-700/50">
        <div className="w-full max-w-7xl mx-auto flex justify-between items-center h-16 px-6">
          <div className="flex gap-6 items-center">
            <Link
              href={"/"}
              className="bg-gradient-to-r from-blue-400 to-amber-400 bg-clip-text text-transparent font-bold text-xl hover:from-blue-300 hover:to-amber-300 transition-all duration-300"
            >
              Paycasso
            </Link>
            
            {/* Status Indicator */}
            {isAuthenticated && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400 font-medium">Online</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Time Display */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-gray-300">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {/* Auth Section */}
            <div className="relative">
              {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="pt-16 px-6 lg:px-8 w-full max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 pt-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl lg:text-4xl font-bold text-white">
                {getWelcomeMessage()}
              </h1>
              {isAuthenticated && (
                <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xs text-blue-400 font-medium">Verified</span>
                </div>
              )}
            </div>
            
            <p className="text-gray-400 text-base lg:text-lg mb-1">
              {getSubMessage()}
            </p>
            
            {/* Additional Info */}
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              
              {userInfo?.email && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  {userInfo.email}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700/50 hover:border-gray-600/50 rounded-lg text-gray-300 hover:text-white transition-all duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7H4l5-5v5z" />
                  </svg>
                  <span className="text-sm font-medium hidden sm:block">Quick Transfer</span>
                </button>
                
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 hover:border-blue-500/50 rounded-lg text-blue-400 hover:text-blue-300 transition-all duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="text-sm font-medium hidden sm:block">New Escrow</span>
                </button>
              </>
            )}
            
            {/* Notifications */}
            <div className="relative">
              <button className="p-2 bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700/50 hover:border-gray-600/50 rounded-lg text-gray-400 hover:text-white transition-all duration-200">
                <IoNotifications/>
              </button>
              {isAuthenticated && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-gray-900"></div>
              )}
            </div>
          </div>
        </div>

        {/* Breadcrumb or Status Bar */}
        {isAuthenticated && (
          <div className="flex items-center gap-4 mb-6 p-4 bg-gray-800/30 border border-gray-700/30 rounded-lg backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300">System Status: All services operational</span>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
              <span>•</span>
              <span>Last updated: {currentTime.toLocaleTimeString()}</span>
            </div>
          </div>
        )}
      </div>

      {/* Children Content */}
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 pb-8">
        {children}
      </div>
    </main>
  );
}