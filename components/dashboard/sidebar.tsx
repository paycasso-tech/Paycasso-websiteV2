// import React, { useState, useEffect } from 'react';
// import { useRouter, usePathname } from 'next/navigation';
// import Link from 'next/link';
// import { LayoutGrid, Database, FileText, Wallet, Headphones } from 'lucide-react';

// const InteractiveSidebar = () => {
//     const router = useRouter();
//     const pathname = usePathname();
//     const [activeItem, setActiveItem] = useState('dashboard');
//     const [hoveredItem, setHoveredItem] = useState(null);

//     const menuItems = [
//         {
//             id: 'dashboard',
//             icon: LayoutGrid,
//             label: 'Dashboard',
//             route: '/dashboard',
//             isHome: true
//         },
//         {
//             id: 'transactions',
//             icon: Database,
//             label: 'Transactions',
//             route: '/transactions'
//         },
//         {
//             id: 'agreements',
//             icon: FileText,
//             label: 'Agreements',
//             route: '/dashboard/agreements'
//         },
//         {
//             id: 'wallet',
//             icon: Wallet,
//             label: 'Wallet',
//             route: '/wallet'
//         },
//         {
//             id: 'support',
//             icon: Headphones,
//             label: 'Support',
//             route: '/support'
//         }
//     ];

//     // Update active item based on current route
//     useEffect(() => {
//         const currentPath = pathname;

//         const activeMenuItem = menuItems.find(item => {
//             // Exact match
//             if (item.route === currentPath) return true;
//             // Handle nested routes
//             if (item.id === 'agreements' && currentPath.includes('/dashboard/agreements')) return true;
//             // Handle dashboard subroutes
//             if (item.id === 'dashboard' && currentPath.startsWith('/dashboard') && !currentPath.includes('/agreements')) return true;
//             return false;
//         });

//         if (activeMenuItem) {
//             setActiveItem(activeMenuItem.id);
//         } else {
//             setActiveItem('dashboard');
//         }
//     }, [pathname]);

//     return (
//         <div className="fixed left-0 top-0 h-full w-20 bg-gradient-to-b from-black/80 to-black/90 backdrop-blur-xl border-r border-white/10 flex flex-col items-center py-8 space-y-6 z-50">
//             {menuItems.map((item) => {
//                 const IconComponent = item.icon;
//                 const isActive = activeItem === item.id;
//                 const isHovered = hoveredItem === item.id;

//                 return (
//                     <div
//                         key={item.id}
//                         className="relative group"
//                         onMouseEnter={() => setHoveredItem(item.id as any)}
//                         onMouseLeave={() => setHoveredItem(null)}
//                     >
//                         {/* Tooltip */}
//                         <div className={`absolute left-16 top-1/2 -translate-y-1/2 px-3 py-2 bg-white/95 backdrop-blur-sm text-black text-sm font-medium rounded-lg shadow-xl border border-white/20 transition-all duration-300 pointer-events-none z-10 whitespace-nowrap ${isHovered
//                                 ? 'opacity-100 translate-x-2 visible'
//                                 : 'opacity-0 translate-x-0 invisible'
//                             }`}>
//                             <div className="flex items-center gap-2">
//                                 {item.label}
//                                 {isActive && (
//                                     <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                                 )}
//                             </div>
//                             <div className="text-xs text-gray-600 mt-1">
//                                 {item.route}
//                                 {isActive && ' (current)'}
//                             </div>

//                             <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-white/95 rotate-45 border-l border-t border-white/20"></div>
//                         </div>

//                         {/* Next.js Link with proper navigation */}
//                         <Link href={item.route} passHref>
//                             <button
//                                 className={`relative w-12 h-12 flex items-center justify-center rounded-xl cursor-pointer transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-white/50 ${isActive
//                                             ? 'bg-white/20 text-white shadow-lg shadow-white/20 backdrop-blur-sm scale-105'
//                                             : 'text-gray-400 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm hover:scale-105'
//                                     } ${isHovered && !isActive ? 'scale-110 shadow-xl' : ''
//                                     }`}
//                                 aria-label={`Navigate to ${item.label}`}
//                                 title={`Go to ${item.label} (${item.route})`}
//                             >
//                                 {/* Enhanced glow effect for active item */}
//                                 {isActive && (
//                                     <>
//                                         <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/40 to-transparent opacity-60 blur-sm animate-pulse"></div>
//                                         <div className="absolute inset-0 rounded-xl border-2 border-white/30"></div>
//                                     </>
//                                 )}

//                                 <IconComponent
//                                     size={20}
//                                     className={`relative z-10 transition-all duration-200 ${isHovered ? 'scale-110' : 'scale-100'
//                                         } ${isActive ? 'drop-shadow-sm' : ''}`}
//                                 />

//                                 {/* Click feedback animation */}
//                                 <div className="absolute inset-0 rounded-xl overflow-hidden">
//                                     <div className={`absolute inset-0 bg-white/30 rounded-xl transition-all duration-500 ${isActive ? 'animate-ping opacity-20' : 'opacity-0'
//                                         }`}></div>
//                                 </div>
//                             </button>
//                         </Link>

//                         {/* Active indicator - stays on clicked button only */}
//                         <div className={`absolute -right-1 top-1/2 -translate-y-1/2 transition-all duration-300 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
//                             }`}>
//                             <div className={`w-1.5 h-8 rounded-l-full ${item.id === 'agreements' ? 'bg-blue-400 shadow-lg shadow-blue-400/50' :
//                                     item.id === 'dashboard' ? 'bg-white shadow-lg shadow-white/30' :
//                                         'bg-emerald-400 shadow-lg shadow-emerald-400/50'
//                                 }`}></div>

//                             <div className={`absolute inset-0 w-1.5 h-8 rounded-l-full blur-sm opacity-60 ${item.id === 'agreements' ? 'bg-blue-400' :
//                                     item.id === 'dashboard' ? 'bg-white' :
//                                         'bg-emerald-400'
//                                 }`}></div>
//                         </div>

//                         {/* Bottom indicator for active state */}
//                         {isActive && (
//                             <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-0.5 rounded-full transition-all duration-300 ${item.id === 'agreements' ? 'bg-blue-400 shadow-sm shadow-blue-400/50' :
//                                     item.id === 'dashboard' ? 'bg-white/80 shadow-sm shadow-white/30' :
//                                         'bg-emerald-400 shadow-sm shadow-emerald-400/50'
//                                 }`}></div>
//                         )}

//                         {/* Route breadcrumb for nested routes */}
//                         {item.id === 'agreements' && isActive && (
//                             <div className="absolute -top-1 right-0 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-80"></div>
//                         )}
//                     </div>
//                 );
//             })}

//             {/* Ambient glow effects */}
//             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-radial from-white/8 to-transparent opacity-40 blur-xl"></div>
//             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-32 bg-gradient-to-b from-transparent via-white/3 to-transparent opacity-50 blur-2xl"></div>
//         </div>
//     );
// };

// export default InteractiveSidebar;

// import React, { useState, useEffect } from "react";
// import { useRouter, usePathname } from "next/navigation";
// import Link from "next/link";
// import {
//   SquaresFour,
//   Database,
//   FileText,
//   Wallet,
//   Headphones,
//   Faders,
// } from "@phosphor-icons/react";

// const InteractiveSidebar = () => {
//   const router = useRouter();
//   const pathname = usePathname();
//   const [activeItem, setActiveItem] = useState("dashboard");
//   const [hoveredItem, setHoveredItem] = useState(null);

//   const menuItems = [
//     {
//       id: "dashboard",
//       icon: SquaresFour,
//       label: "Dashboard",
//       route: "/dashboard",
//     },
//     {
//       id: "transactions",
//       icon: Database,
//       label: "Transactions",
//       route: "/transactions",
//     },
//     {
//       id: "agreements",
//       icon: FileText,
//       label: "Agreements",
//       route: "/dashboard/agreements",
//     },
//     {
//       id: "wallet",
//       icon: Wallet,
//       label: "Wallet",
//       route: "/wallet",
//     },
//     {
//       id: "support",
//       icon: Headphones,
//       label: "Support",
//       route: "/support",
//     },
//   ];

//   const bottomMenuItem = {
//     id: "settings",
//     icon: Faders,
//     label: "Settings",
//     route: "/settings",
//   };

//   useEffect(() => {
//     const currentPath = pathname;
//     const activeMenuItem = menuItems.find((item) => {
//       if (item.route === currentPath) return true;
//       if (
//         item.id === "agreements" &&
//         currentPath.includes("/dashboard/agreements")
//       )
//         return true;
//       if (
//         item.id === "dashboard" &&
//         currentPath.startsWith("/dashboard") &&
//         !currentPath.includes("/agreements")
//       )
//         return true;
//       return false;
//     });

//     if (activeMenuItem) {
//       setActiveItem(activeMenuItem.id);
//     } else if (currentPath === bottomMenuItem.route) {
//       setActiveItem(bottomMenuItem.id);
//     } else {
//       setActiveItem("dashboard");
//     }
//   }, [pathname]);

//   const renderMenuItem = (item) => {
//     const IconComponent = item.icon;
//     const isActive = activeItem === item.id;
//     const isHovered = hoveredItem === item.id;

//     return (
//       <div
//         key={item.id}
//         className="relative group"
//         onMouseEnter={() => setHoveredItem(item.id)}
//         onMouseLeave={() => setHoveredItem(null)}
//       >
//         {/* Tooltip */}
//         <div
//           className={`absolute left-[72px] top-1/2 -translate-y-1/2 px-3 py-2 
//                         bg-white/10 backdrop-blur-md text-white text-xs font-medium 
//                         rounded-lg shadow-2xl border border-white/20 
//                         transition-all duration-300 pointer-events-none z-50 whitespace-nowrap
//                         ${
//                           isHovered
//                             ? "opacity-100 translate-x-2 visible"
//                             : "opacity-0 translate-x-0 invisible"
//                         }`}
//         >
//           {item.label}
//           {/* Tooltip arrow */}
//           <div
//             className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[3px] 
//                         w-1.5 h-1.5 bg-white/10 backdrop-blur-md rotate-45 
//                         border-l border-b border-white/20"
//           ></div>
//         </div>

//         <Link href={item.route} passHref>
//           <button
//             className={`relative w-[60px] h-[60px] flex items-center justify-center 
//                             rounded-full cursor-pointer transition-all duration-300 
//                             focus:outline-none group
//                             ${
//                               isActive
//                                 ? "bg-white text-black shadow-xl shadow-white/25"
//                                 : "bg-white/[0.03] backdrop-blur-xl backdrop-saturate-150 text-white border border-white/25 hover:bg-white/[0.35] hover:text-white hover:border-white/35 hover:scale-[1.05] shadow-lg shadow-black/10"
//                             }`}
//             aria-label={`Navigate to ${item.label}`}
//           >
//             {/* Glass reflection overlay for non-active states */}
//             {!isActive && (
//               <>
//                 {/* Inner glow shadow */}
//                 <div className="absolute inset-0 rounded-full shadow-inner shadow-white/20"></div>

//                 {/* Multi-layer glass overlay */}
//                 <div
//                   className={`absolute inset-0 rounded-full overflow-hidden pointer-events-none
//             opacity-100 group-hover:opacity-100 transition-opacity duration-300`}
//                 >
//                   {/* Top shine */}
//                   <div className="absolute top-0 left-0 right-0 h-[50%] bg-gradient-to-b from-white/20 to-transparent"></div>
//                   {/* Corner highlight */}
//                   <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent"></div>
//                   {/* Bottom subtle reflection */}
//                   <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-white/5 to-transparent"></div>
//                 </div>
//               </>
//             )}

//             {/* Icon - filled when active, regular when not */}
//             <IconComponent
//               size={26}
//               weight={isActive ? "fill" : "regular"}
//               className={`relative z-10 transition-all duration-200 
//                                 ${isHovered ? "scale-110" : "scale-100"}`}
//             />

//             {/* Active state subtle inner shadow */}
//             {isActive && (
//               <div className="absolute inset-0 rounded-full shadow-inner shadow-black/5"></div>
//             )}
//           </button>
//         </Link>
//       </div>
//     );
//   };

//   return (
//     <div
//       className="fixed left-0 top-0 h-screen w-[88px] 
//             bg-black/30 backdrop-blur-3xl backdrop-saturate-150 
//             border-r border-white/[0.06] 
//             flex flex-col items-center justify-center
//             z-50
//             shadow-2xl shadow-black/40"
//     >
//       {/* Main menu items container - centered vertically */}
//       <div className="flex flex-col items-center gap-8">
//         {menuItems.map(renderMenuItem)}
//       </div>

//       {/* Bottom menu item - positioned at bottom */}
//       <div className="absolute bottom-8 flex flex-col items-center">
//         {renderMenuItem(bottomMenuItem)}
//       </div>

//       {/* Ambient background effects */}
//       <div className="absolute inset-0 pointer-events-none overflow-hidden">
//         {/* Top gradient glow */}
//         <div
//           className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-32 
//                     bg-gradient-to-b from-white/[0.03] to-transparent blur-2xl"
//         ></div>

//         {/* Center ambient glow */}
//         <div
//           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
//                     w-16 h-64 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent 
//                     blur-3xl animate-pulse"
//         ></div>

//         {/* Bottom gradient glow */}
//         <div
//           className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-32 
//                     bg-gradient-to-t from-white/[0.03] to-transparent blur-2xl"
//         ></div>
//       </div>
//     </div>
//   );
// };

// export default InteractiveSidebar;


"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  SquaresFour,
  Database,
  FileText,
  Wallet,
  Headphones,
  Faders,
} from "@phosphor-icons/react";

const InteractiveSidebar = () => {
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState("dashboard");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const menuItems = [
    {
      id: "dashboard",
      icon: SquaresFour,
      label: "Dashboard",
      route: "/dashboard", // ✅ Goes to app/(main)/dashboard/page.tsx
    },
    {
      id: "transactions",
      icon: Database,
      label: "Transactions",
      route: "/transactions", // ✅ Goes to app/(main)/transactions/page.tsx
    },
    {
      id: "agreements",
      icon: FileText,
      label: "Agreements",
      route: "/dashboard/agreements", // ✅ Goes to app/(main)/dashboard/agreements/page.tsx
    },
    {
      id: "wallet",
      icon: Wallet,
      label: "Wallet",
      route: "/wallet", // ✅ Goes to app/(main)/wallet/page.tsx
    },
    {
      id: "support",
      icon: Headphones,
      label: "Support",
      route: "/support", // ✅ Goes to app/(main)/support/page.tsx
    },
  ];


  const bottomMenuItem = {
    id: "settings",
    icon: Faders,
    label: "Settings",
    route: "/settings",
  };

  useEffect(() => {
    const currentPath = pathname;
    const activeMenuItem = menuItems.find((item) => {
      if (item.route === currentPath) return true;
      if (
        item.id === "agreements" &&
        currentPath.includes("/dashboard/agreements")
      )
        return true;
      if (
        item.id === "dashboard" &&
        currentPath.startsWith("/dashboard") &&
        !currentPath.includes("/agreements")
      )
        return true;
      return false;
    });

    if (activeMenuItem) {
      setActiveItem(activeMenuItem.id);
    } else if (currentPath === bottomMenuItem.route) {
      setActiveItem(bottomMenuItem.id);
    } else {
      setActiveItem("dashboard");
    }
  }, [pathname]);

  const renderMenuItem = (item: any) => {
    const IconComponent = item.icon;
    const isActive = activeItem === item.id;
    const isHovered = hoveredItem === item.id;

    return (
      <div
        key={item.id}
        className="relative group"
        onMouseEnter={() => setHoveredItem(item.id)}
        onMouseLeave={() => setHoveredItem(null)}
      >
        {/* Tooltip */}
        <div
          className={`absolute left-[72px] top-1/2 -translate-y-1/2 px-3 py-2 
                        bg-white/10 backdrop-blur-md text-white text-xs font-medium 
                        rounded-lg shadow-2xl border border-white/20 
                        transition-all duration-300 pointer-events-none z-50 whitespace-nowrap
                        ${
                          isHovered
                            ? "opacity-100 translate-x-2 visible"
                            : "opacity-0 translate-x-0 invisible"
                        }`}
        >
          {item.label}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[3px] w-1.5 h-1.5 bg-white/10 backdrop-blur-md rotate-45 border-l border-b border-white/20"></div>
        </div>

        <Link href={item.route}>
          <button
            className={`relative w-[60px] h-[60px] flex items-center justify-center 
                            rounded-full cursor-pointer transition-all duration-300 
                            focus:outline-none group
                            ${
                              isActive
                                ? "bg-white text-black shadow-xl shadow-white/25"
                                : "bg-white/[0.03] backdrop-blur-xl backdrop-saturate-150 text-white border border-white/25 hover:bg-white/[0.35] hover:text-white hover:border-white/35 hover:scale-[1.05] shadow-lg shadow-black/10"
                            }`}
            aria-label={`Navigate to ${item.label}`}
          >
            {!isActive && (
              <>
                <div className="absolute inset-0 rounded-full shadow-inner shadow-white/20"></div>
                <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none opacity-100 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute top-0 left-0 right-0 h-[50%] bg-gradient-to-b from-white/20 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-white/5 to-transparent"></div>
                </div>
              </>
            )}

            <IconComponent
              size={26}
              weight={isActive ? "fill" : "regular"}
              className={`relative z-10 transition-all duration-200 ${
                isHovered ? "scale-110" : "scale-100"
              }`}
            />

            {isActive && (
              <div className="absolute inset-0 rounded-full shadow-inner shadow-black/5"></div>
            )}
          </button>
        </Link>
      </div>
    );
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-[88px] bg-black/30 backdrop-blur-3xl backdrop-saturate-150 border-r border-white/[0.06] flex flex-col items-center justify-center z-50 shadow-2xl shadow-black/40">
      <div className="flex flex-col items-center gap-8">
        {menuItems.map(renderMenuItem)}
      </div>

      <div className="absolute bottom-8 flex flex-col items-center">
        {renderMenuItem(bottomMenuItem)}
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-32 bg-gradient-to-b from-white/[0.03] to-transparent blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-64 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-32 bg-gradient-to-t from-white/[0.03] to-transparent blur-2xl"></div>
      </div>
    </div>
  );
};

export default InteractiveSidebar;
