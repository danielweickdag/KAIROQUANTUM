'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  TrendingUp,
  Wallet,
  Settings,
  Users,
  BarChart3,
  Bot,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  DollarSign,
  Activity,
  Target,
  Zap,
  Shield,
  Star
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import QuickTradeModal from '@/components/modals/QuickTradeModal';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  badge?: string;
  submenu?: NavItem[];
}

const navigation: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Portfolio',
    href: '/portfolio',
    icon: Wallet,
    submenu: [
      { name: 'Overview', href: '/portfolio', icon: BarChart3 },
      { name: 'Holdings', href: '/portfolio/holdings', icon: TrendingUp },
      { name: 'Performance', href: '/portfolio/performance', icon: Activity },
    ]
  },
  {
    name: 'Trading',
    href: '/trading',
    icon: TrendingUp,
    submenu: [
      { name: 'Spot Trading', href: '/trading/spot', icon: DollarSign },
      { name: 'Futures', href: '/trading/futures', icon: Target },
      { name: 'Options', href: '/trading/options', icon: Zap },
    ]
  },
  {
    name: 'Automation',
    href: '/automation',
    icon: Bot,
    badge: 'Pro',
    submenu: [
      { name: 'Strategies', href: '/automation/strategies', icon: Bot },
      { name: 'Copy Trading', href: '/copy-trade', icon: Users },
      { name: 'Alerts', href: '/automation/alerts', icon: Bell },
    ]
  },
  {
    name: 'Social',
    href: '/social',
    icon: Users,
    submenu: [
      { name: 'Feed', href: '/social', icon: Activity },
      { name: 'Creators', href: '/creators', icon: Star },
      { name: 'Leaderboard', href: '/social/leaderboard', icon: TrendingUp },
    ]
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
  },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [quickTradeModalOpen, setQuickTradeModalOpen] = useState(false);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName]
    );
  };

  const isActive = (href: string) => {
    return pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-sidebar-bg border-r border-sidebar-border shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-sidebar-border">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-foreground">KAIRO</span>
                <span className="text-xs text-muted-foreground font-medium">QUANTUM</span>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-nav-hover transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <div key={item.name}>
                <button
                  className={`
                    group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 w-full text-left
                    ${isActive(item.href) 
                      ? 'bg-nav-active text-nav-active-text shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-nav-hover'
                    }
                  `}
                  type="button"
                  onClick={() => {
                    if (item.submenu) {
                      toggleExpanded(item.name);
                    } else {
                      router.push(item.href);
                      setSidebarOpen(false);
                    }
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className={`h-5 w-5 transition-colors ${
                      isActive(item.href) ? 'text-nav-active-text' : 'text-muted-foreground group-hover:text-foreground'
                    }`} />
                    <span className="font-medium">{item.name}</span>
                    {item.badge && (
                      <span className="px-2.5 py-1 text-xs font-semibold bg-gradient-to-r from-primary to-blue-600 text-white rounded-full shadow-sm">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {item.submenu && (
                    <ChevronDown className={`h-4 w-4 transition-all duration-200 ${
                      expandedItems.includes(item.name) ? 'rotate-180' : ''
                    } ${isActive(item.href) ? 'text-nav-active-text' : 'text-muted-foreground group-hover:text-foreground'}`} />
                  )}
                </button>
                
                {/* Submenu */}
                {item.submenu && expandedItems.includes(item.name) && (
                  <div className="ml-8 mt-2 space-y-1 border-l-2 border-border pl-4">
                    {item.submenu.map((subItem) => (
                      <button
                        key={subItem.name}
                        type="button"
                        className={`
                          group flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 w-full text-left
                          ${isActive(subItem.href)
                            ? 'bg-nav-active text-nav-active-text shadow-sm'
                            : 'text-muted-foreground hover:text-foreground hover:bg-nav-hover'
                          }
                        `}
                        onClick={() => {
                          router.push(subItem.href);
                          setSidebarOpen(false);
                        }}
                      >
                        <subItem.icon className={`h-4 w-4 transition-colors ${
                          isActive(subItem.href) ? 'text-nav-active-text' : 'text-muted-foreground group-hover:text-foreground'
                        }`} />
                        <span className="font-medium">{subItem.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* User Profile */}
          <div className="border-t border-sidebar-border p-4">
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center w-full px-4 py-3 text-sm rounded-xl hover:bg-nav-hover transition-all duration-200 group"
              >
                <div className="flex items-center space-x-3 flex-1">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-primary/20">
                    <span className="text-white text-sm font-bold">
                      {user?.firstName?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </button>
              
              {/* User Menu Dropdown */}
              {userMenuOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-card rounded-xl shadow-xl border border-border py-2 backdrop-blur-sm">
                  <button
                    onClick={() => {
                      router.push('/settings');
                      setUserMenuOpen(false);
                      setSidebarOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-3 text-sm text-foreground hover:bg-nav-hover transition-colors"
                  >
                    <Settings className="h-4 w-4 mr-3 text-muted-foreground" />
                    <span className="font-medium">Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      router.push('/security');
                      setUserMenuOpen(false);
                      setSidebarOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-3 text-sm text-foreground hover:bg-nav-hover transition-colors"
                  >
                    <Shield className="h-4 w-4 mr-3 text-muted-foreground" />
                    <span className="font-medium">Security</span>
                  </button>
                  <hr className="my-2 border-border" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <span className="mr-3 text-destructive">→</span>
                    <span className="font-medium">Sign out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="bg-card/80 backdrop-blur-md shadow-sm border-b border-border sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-nav-hover transition-all duration-200"
              >
                <Menu className="h-5 w-5" />
              </button>
              
              {/* Search */}
              <div className="relative hidden md:block">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  placeholder="Search stocks, crypto, traders..."
                  className="block w-96 pl-12 pr-4 py-3 border border-border rounded-xl bg-background/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-sm"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <button className="relative p-3 text-muted-foreground hover:text-foreground hover:bg-nav-hover rounded-xl transition-all duration-200 group">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full animate-pulse"></span>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full opacity-75 animate-ping"></span>
              </button>
              
              {/* Quick Trade Button */}
              <button 
                onClick={() => setQuickTradeModalOpen(true)}
                className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
              >
                Quick Trade
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>

      {/* Quick Trade Modal */}
      <QuickTradeModal 
        isOpen={quickTradeModalOpen} 
        onClose={() => setQuickTradeModalOpen(false)} 
      />
    </div>
  );
}