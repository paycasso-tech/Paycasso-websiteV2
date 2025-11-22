"use client";

import { useEffect, useState } from "react";

export function AnimatedBentoGrid() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-black opacity-90" />

      {/* Animated Bento Grid */}
      <div
        className={`relative h-full flex items-center justify-center p-8 transition-opacity duration-1000 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="grid grid-cols-2 grid-rows-3 gap-4 max-w-md w-full h-full max-h-[600px]">
          {/* Card 1 - Purple Large Top */}
          <div className="col-span-1 row-span-1 bg-gradient-to-br from-purple-400 to-purple-500 rounded-3xl p-6 flex flex-col justify-center animate-float-slow shadow-2xl">
            <h3 className="text-xl font-bold text-black mb-2">Total Care.</h3>
            <p className="text-lg font-semibold text-black">Total Different.</p>
          </div>

          {/* Card 2 - Yellow with Icon Top Right */}
          <div className="col-span-1 row-span-1 bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-3xl p-6 flex items-center justify-center animate-float-medium shadow-2xl">
            <div className="text-center">
              <div className="text-4xl font-black text-black mb-2">+</div>
              <p className="text-sm font-bold text-black">Building trust</p>
              <p className="text-sm font-bold text-black">in blockchain</p>
              <p className="text-sm font-bold text-black">technology</p>
            </div>
          </div>

          {/* Card 3 - Purple Logo Center */}
          <div className="col-span-1 row-span-1 bg-gradient-to-br from-purple-400 to-purple-500 rounded-3xl p-6 flex items-center justify-center animate-float-fast shadow-2xl">
            <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="white" className="w-12 h-12">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
          </div>

          {/* Card 4 - Yellow "Own your power" Center Right */}
          <div className="col-span-1 row-span-1 bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-3xl p-6 flex flex-col justify-center animate-float-medium shadow-2xl">
            <div className="text-3xl font-black text-black mb-3">+</div>
            <p className="text-lg font-bold text-black">Own</p>
            <p className="text-lg font-bold text-black">your power</p>
          </div>

          {/* Card 5 - Purple Bottom Left */}
          <div className="col-span-1 row-span-1 bg-gradient-to-br from-purple-400 to-purple-500 rounded-3xl p-6 flex flex-col justify-center animate-float-slow shadow-2xl">
            <h3 className="text-xl font-bold text-black mb-2">Total Care.</h3>
            <p className="text-lg font-semibold text-black">Total Different.</p>
          </div>

          {/* Card 6 - Yellow Bottom Right */}
          <div className="col-span-1 row-span-1 bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-3xl p-6 flex items-center justify-center animate-float-fast shadow-2xl">
            <div className="text-center">
              <div className="text-4xl font-black text-black mb-2">+</div>
              <p className="text-sm font-bold text-black">Building trust</p>
              <p className="text-sm font-bold text-black">in blockchain</p>
              <p className="text-sm font-bold text-black">technology</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Orbs Background */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl animate-pulse-slower" />
    </div>
  );
}
