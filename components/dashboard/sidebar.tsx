import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutGrid, Database, FileText, Wallet, Headphones } from 'lucide-react';

const InteractiveSidebar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [activeItem, setActiveItem] = useState('dashboard');
    const [hoveredItem, setHoveredItem] = useState(null);

    const menuItems = [
        {
            id: 'dashboard',
            icon: LayoutGrid,
            label: 'Dashboard',
            route: '/dashboard',
            isHome: true
        },
        {
            id: 'transactions',
            icon: Database,
            label: 'Transactions',
            route: '/transactions'
        },
        {
            id: 'agreements',
            icon: FileText,
            label: 'Agreements',
            route: '/dashboard/agreements'
        },
        {
            id: 'wallet',
            icon: Wallet,
            label: 'Wallet',
            route: '/wallet'
        },
        {
            id: 'support',
            icon: Headphones,
            label: 'Support',
            route: '/support'
        }
    ];

    // Update active item based on current route
    useEffect(() => {
        const currentPath = pathname;

        const activeMenuItem = menuItems.find(item => {
            // Exact match
            if (item.route === currentPath) return true;
            // Handle nested routes
            if (item.id === 'agreements' && currentPath.includes('/dashboard/agreements')) return true;
            // Handle dashboard subroutes
            if (item.id === 'dashboard' && currentPath.startsWith('/dashboard') && !currentPath.includes('/agreements')) return true;
            return false;
        });

        if (activeMenuItem) {
            setActiveItem(activeMenuItem.id);
        } else {
            setActiveItem('dashboard');
        }
    }, [pathname]);

    return (
        <div className="fixed left-0 top-0 h-full w-20 bg-gradient-to-b from-black/80 to-black/90 backdrop-blur-xl border-r border-white/10 flex flex-col items-center py-8 space-y-6 z-50">
            {menuItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeItem === item.id;
                const isHovered = hoveredItem === item.id;

                return (
                    <div
                        key={item.id}
                        className="relative group"
                        onMouseEnter={() => setHoveredItem(item.id as any)}
                        onMouseLeave={() => setHoveredItem(null)}
                    >
                        {/* Tooltip */}
                        <div className={`absolute left-16 top-1/2 -translate-y-1/2 px-3 py-2 bg-white/95 backdrop-blur-sm text-black text-sm font-medium rounded-lg shadow-xl border border-white/20 transition-all duration-300 pointer-events-none z-10 whitespace-nowrap ${isHovered
                                ? 'opacity-100 translate-x-2 visible'
                                : 'opacity-0 translate-x-0 invisible'
                            }`}>
                            <div className="flex items-center gap-2">
                                {item.label}
                                {isActive && (
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                )}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                                {item.route}
                                {isActive && ' (current)'}
                            </div>

                            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-white/95 rotate-45 border-l border-t border-white/20"></div>
                        </div>

                        {/* Next.js Link with proper navigation */}
                        <Link href={item.route} passHref>
                            <button
                                className={`relative w-12 h-12 flex items-center justify-center rounded-xl cursor-pointer transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-white/50 ${isActive
                                            ? 'bg-white/20 text-white shadow-lg shadow-white/20 backdrop-blur-sm scale-105'
                                            : 'text-gray-400 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm hover:scale-105'
                                    } ${isHovered && !isActive ? 'scale-110 shadow-xl' : ''
                                    }`}
                                aria-label={`Navigate to ${item.label}`}
                                title={`Go to ${item.label} (${item.route})`}
                            >
                                {/* Enhanced glow effect for active item */}
                                {isActive && (
                                    <>
                                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/40 to-transparent opacity-60 blur-sm animate-pulse"></div>
                                        <div className="absolute inset-0 rounded-xl border-2 border-white/30"></div>
                                    </>
                                )}

                                <IconComponent
                                    size={20}
                                    className={`relative z-10 transition-all duration-200 ${isHovered ? 'scale-110' : 'scale-100'
                                        } ${isActive ? 'drop-shadow-sm' : ''}`}
                                />

                                {/* Click feedback animation */}
                                <div className="absolute inset-0 rounded-xl overflow-hidden">
                                    <div className={`absolute inset-0 bg-white/30 rounded-xl transition-all duration-500 ${isActive ? 'animate-ping opacity-20' : 'opacity-0'
                                        }`}></div>
                                </div>
                            </button>
                        </Link>

                        {/* Active indicator - stays on clicked button only */}
                        <div className={`absolute -right-1 top-1/2 -translate-y-1/2 transition-all duration-300 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                            }`}>
                            <div className={`w-1.5 h-8 rounded-l-full ${item.id === 'agreements' ? 'bg-blue-400 shadow-lg shadow-blue-400/50' :
                                    item.id === 'dashboard' ? 'bg-white shadow-lg shadow-white/30' :
                                        'bg-emerald-400 shadow-lg shadow-emerald-400/50'
                                }`}></div>

                            <div className={`absolute inset-0 w-1.5 h-8 rounded-l-full blur-sm opacity-60 ${item.id === 'agreements' ? 'bg-blue-400' :
                                    item.id === 'dashboard' ? 'bg-white' :
                                        'bg-emerald-400'
                                }`}></div>
                        </div>

                        {/* Bottom indicator for active state */}
                        {isActive && (
                            <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-0.5 rounded-full transition-all duration-300 ${item.id === 'agreements' ? 'bg-blue-400 shadow-sm shadow-blue-400/50' :
                                    item.id === 'dashboard' ? 'bg-white/80 shadow-sm shadow-white/30' :
                                        'bg-emerald-400 shadow-sm shadow-emerald-400/50'
                                }`}></div>
                        )}

                        {/* Route breadcrumb for nested routes */}
                        {item.id === 'agreements' && isActive && (
                            <div className="absolute -top-1 right-0 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-80"></div>
                        )}
                    </div>
                );
            })}

            {/* Ambient glow effects */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-radial from-white/8 to-transparent opacity-40 blur-xl"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-32 bg-gradient-to-b from-transparent via-white/3 to-transparent opacity-50 blur-2xl"></div>
        </div>
    );
};

export default InteractiveSidebar;