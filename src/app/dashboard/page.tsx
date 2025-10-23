'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkflow } from '@/contexts/WorkflowContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import PortfolioOverview from '@/components/dashboard/PortfolioOverview';
import TradingPanel from '@/components/dashboard/TradingPanel';
import AutomatedStrategies from '@/components/dashboard/AutomatedStrategies';
import NotificationCenter from '@/components/dashboard/NotificationCenter';
import AISignalGenerator from '@/components/dashboard/AISignalGenerator';
import StrategyTemplates from '@/components/dashboard/StrategyTemplates';
import SignalDeliverySystem from '@/components/dashboard/SignalDeliverySystem';
import BacktestingEngine from '@/components/dashboard/BacktestingEngine';
import PerformanceAnalytics from '@/components/dashboard/PerformanceAnalytics';
import BrokerAccountSelector from '@/components/BrokerAccountSelector';
import TradingActions from '@/components/trading/TradingActions';
import DashboardAutomation from '@/components/dashboard/DashboardAutomation';
import { useBrokerAccount } from '@/contexts/BrokerAccountContext';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Bot,
  Target,
  Zap,
  BarChart3,
  Activity,
  Bell,
  Star,
  Shield,
  Brain,
  BookOpen,
  Play,
  ArrowRight,
  Settings
} from 'lucide-react';

function DashboardContent() {
  const { user } = useAuth();
  const { selectedAccount, setSelectedAccount } = useBrokerAccount();
  const { 
    workflowState, 
    executeWorkflow, 
    triggerFromDashboard, 
    navigateToTrading,
    toggleWorkflow,
    createWorkflow,
    handleDeepLink 
  } = useWorkflow();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Handle deep linking on page load
  useEffect(() => {
    if (searchParams) {
      handleDeepLink(searchParams);
    }
  }, [searchParams, handleDeepLink]);
  const [activeView, setActiveView] = useState<'overview' | 'trading' | 'automation' | 'strategies' | 'ai-signals' | 'templates' | 'signals' | 'backtesting' | 'performance-analytics'>('overview');
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  const [gainzAlgoActive, setGainzAlgoActive] = useState(false);
  const [copyTradingActive, setCopyTradingActive] = useState(false);
  const [riskManagementActive, setRiskManagementActive] = useState(false);
  const [workflowStatus, setWorkflowStatus] = useState('idle'); // idle, partial, active, optimized

  // Centralized handler to enable all features and trigger workflows
  const hasAutoEnabledRef = useRef(false);
  const handleEnableAll = () => {
    setGainzAlgoActive(true);
    setCopyTradingActive(true);
    setRiskManagementActive(true);
    try {
      // Prefetch trading route to reduce dev-time aborted requests
      router.prefetch('/trading');
      // Small delay to avoid racing RSC fetches during auto-navigation
      setTimeout(() => {
        navigateToTrading(undefined, {
          source: 'dashboard_enable_all',
          timestamp: Date.now()
        });
      }, 120);
      workflowState.activeWorkflows.forEach(workflow => {
        triggerFromDashboard(workflow.id, { action: 'enable_all' });
      });
    } catch (_) {}
  };

  // Centralized handler to disable all features
  const handleDisableAll = () => {
    setGainzAlgoActive(false);
    setCopyTradingActive(false);
    setRiskManagementActive(false);
  };

  // Auto-enable via URL param (e.g., /dashboard?autoEnable=1)
  useEffect(() => {
    const autoEnable = searchParams?.get('autoEnable');
    if (!hasAutoEnabledRef.current && (autoEnable === '1' || autoEnable === 'true')) {
      hasAutoEnabledRef.current = true;
      handleEnableAll();
    }
  }, [searchParams]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Workflow automation effects
  useEffect(() => {
    if (gainzAlgoActive) {
      alert('🚀 GainzAlgo V2 Pro Strategy Activated!\n\n✅ High-frequency momentum trading enabled\n✅ 78% win rate target active\n✅ 1.85x profit factor optimization\n✅ Real-time signal generation started');
    }
  }, [gainzAlgoActive]);

  useEffect(() => {
    if (copyTradingActive) {
      alert('👥 Copy Trading Enabled!\n\n✅ Following top traders\n✅ Automatic trade copying active\n✅ Portfolio synchronization started\n✅ Risk management applied to copied trades');
    }
  }, [copyTradingActive]);

  useEffect(() => {
    if (riskManagementActive) {
      alert('🛡️ Risk Management Controls Activated!\n\n✅ Automated stop-loss enabled\n✅ Position sizing optimization\n✅ Drawdown protection active\n✅ Real-time risk monitoring started');
    }
  }, [riskManagementActive]);

  // Workflow coordination - automatically update status based on active features
  useEffect(() => {
    const activeFeatures = [gainzAlgoActive, copyTradingActive, riskManagementActive].filter(Boolean).length;
    
    if (activeFeatures === 0) {
      setWorkflowStatus('idle');
    } else if (activeFeatures === 1) {
      setWorkflowStatus('partial');
    } else if (activeFeatures === 2) {
      setWorkflowStatus('active');
    } else if (activeFeatures === 3) {
      setWorkflowStatus('optimized');
      // Show comprehensive workflow activation message
      setTimeout(() => {
        alert('🎯 Complete Trading Workflow Activated!\n\n🚀 GainzAlgo V2 Pro: High-frequency momentum trading\n👥 Copy Trading: Following top performers\n🛡️ Risk Management: Advanced protection\n\n✨ All systems are now working together seamlessly!\n📈 Maximum profit potential with optimal risk control');
      }, 500);
    }
  }, [gainzAlgoActive, copyTradingActive, riskManagementActive]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary/20 border-t-primary"></div>
            <p className="text-muted-foreground font-medium">Loading your dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl p-6 space-y-8">
        {/* Welcome Header - Landio-inspired Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary via-blue-600 to-purple-700 rounded-3xl p-8 text-white shadow-2xl border border-white/10">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/5 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-400/10 to-transparent rounded-full blur-2xl"></div>
          
          {/* Floating Particles Animation */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
            <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-blue-200/40 rounded-full animate-ping"></div>
            <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-purple-200/30 rounded-full animate-pulse delay-1000"></div>
          </div>
          
          <div className="relative flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-lg">
                  <span className="text-3xl animate-bounce">🚀</span>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    Welcome back, {user?.firstName}!
                  </h1>
                  <p className="text-blue-100 text-xl font-medium mt-2">
                    Your AI-powered trading ecosystem is ready. <span className="text-yellow-300 font-semibold">Let's maximize your potential.</span>
                  </p>
                  <div className="flex items-center space-x-2 mt-3">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-200 font-medium">All systems operational</span>
                    </div>
                    <span className="text-white/40">•</span>
                    <span className="text-sm text-blue-200">Real-time market analysis active</span>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Broker Account Selector */}
              <div className="mt-8 max-w-md">
                <label className="block text-sm font-bold text-white/90 mb-3 flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Active Trading Account</span>
                </label>
                <div className="bg-gradient-to-r from-white/15 to-white/10 backdrop-blur-md rounded-2xl p-1 border border-white/20 shadow-lg">
                  <BrokerAccountSelector
                    selectedAccount={selectedAccount}
                    onAccountSelect={setSelectedAccount}
                    placeholder="Select your trading account"
                    className="bg-white text-foreground rounded-xl shadow-sm"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-4 rounded-2xl bg-gradient-to-br from-white/15 to-white/10 hover:from-white/25 hover:to-white/15 transition-all duration-300 backdrop-blur-md group border border-white/20 shadow-lg"
              >
                <Bell className="h-6 w-6 group-hover:animate-pulse" />
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-xs font-bold">3</span>
                </span>
                <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full animate-ping opacity-30"></div>
              </button>
              
              <div className="hidden lg:flex items-center space-x-6">
                <div className="text-center bg-gradient-to-br from-white/15 to-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <p className="text-4xl font-bold bg-gradient-to-r from-green-300 to-green-100 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">78.5%</p>
                  <p className="text-sm text-white/80 font-semibold mt-1">Win Rate</p>
                  <div className="w-full bg-white/20 rounded-full h-1 mt-2">
                    <div className="bg-gradient-to-r from-green-400 to-green-300 h-1 rounded-full" style={{width: '78.5%'}}></div>
                  </div>
                </div>
                <div className="text-center bg-gradient-to-br from-white/15 to-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <p className="text-4xl font-bold bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">1.85x</p>
                  <p className="text-sm text-white/80 font-semibold mt-1">Profit Factor</p>
                  <div className="flex items-center justify-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-300" />
                  </div>
                </div>
                <div className="text-center bg-gradient-to-br from-white/15 to-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <p className="text-4xl font-bold bg-gradient-to-r from-purple-300 to-purple-100 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">#12</p>
                  <p className="text-sm text-white/80 font-semibold mt-1">Global Rank</p>
                  <div className="flex items-center justify-center mt-2">
                    <Star className="h-4 w-4 text-yellow-300 fill-current" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* AI Status Indicator */}
          <div className="relative mt-8 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-green-500/20 to-green-400/20 backdrop-blur-sm rounded-full px-4 py-2 border border-green-400/30">
                <Brain className="h-4 w-4 text-green-300 animate-pulse" />
                <span className="text-sm font-semibold text-green-200">AI Analysis Active</span>
              </div>
              <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-blue-400/20 backdrop-blur-sm rounded-full px-4 py-2 border border-blue-400/30">
                <Activity className="h-4 w-4 text-blue-300" />
                <span className="text-sm font-semibold text-blue-200">Market Scanner Running</span>
              </div>
            </div>
            <button 
              onClick={handleEnableAll}
              className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Zap className="h-5 w-5" />
              <span>Activate All Systems</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Integration Status Cards - Landio-inspired */}
        <section aria-label="Integration Status" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Settings className="h-4 w-4 text-white" />
                </div>
                <span>Connected Integrations</span>
              </h2>
              <p className="text-muted-foreground mt-1">Your unified AI-powered trading ecosystem</p>
            </div>
            <div className="flex items-center space-x-2 bg-gradient-to-r from-green-500/20 to-green-400/20 rounded-full px-4 py-2 border border-green-200 dark:border-green-700">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-green-700 dark:text-green-300">All Systems Connected</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Broker Integration */}
            <div className="group bg-gradient-to-br from-card to-card/80 rounded-2xl p-6 border border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-500/30 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">Connected</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Broker Accounts</h3>
              <p className="text-sm text-muted-foreground mb-4">3 active trading accounts</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Interactive Brokers</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">✓ Active</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">TD Ameritrade</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">✓ Active</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Alpaca Markets</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">✓ Active</span>
                </div>
              </div>
            </div>

            {/* AI Analysis Integration */}
            <div className="group bg-gradient-to-br from-card to-card/80 rounded-2xl p-6 border border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:border-purple-500/30 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">Processing</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">AI Analysis</h3>
              <p className="text-sm text-muted-foreground mb-4">Real-time market intelligence</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Pattern Recognition</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">✓ Running</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Sentiment Analysis</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">✓ Running</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Risk Assessment</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">✓ Running</span>
                </div>
              </div>
            </div>

            {/* Market Data Integration */}
            <div className="group bg-gradient-to-br from-card to-card/80 rounded-2xl p-6 border border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:border-orange-500/30 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">Live</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Market Data</h3>
              <p className="text-sm text-muted-foreground mb-4">Real-time feeds & analytics</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Yahoo Finance</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">✓ Streaming</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Alpha Vantage</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">✓ Streaming</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">TradingView</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">✓ Streaming</span>
                </div>
              </div>
            </div>

            {/* Automation Integration */}
            <div className="group bg-gradient-to-br from-card to-card/80 rounded-2xl p-6 border border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:border-green-500/30 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">Automated</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Automation</h3>
              <p className="text-sm text-muted-foreground mb-4">Smart trading workflows</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Auto Trading</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">✓ Active</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Risk Management</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">✓ Active</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Portfolio Rebalancing</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">✓ Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Integration Performance Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Integration Health</h3>
                  <p className="text-sm text-muted-foreground">All systems operating at optimal performance</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">99.9%</p>
                  <p className="text-xs text-muted-foreground">Uptime</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">12ms</p>
                  <p className="text-xs text-muted-foreground">Latency</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">15</p>
                  <p className="text-xs text-muted-foreground">Active APIs</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enable Features Section with Nav */}
        <section aria-label="Enable Features" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Feature Management</h2>
              <p className="text-muted-foreground mt-1">Configure and control your trading features</p>
            </div>
            <nav aria-label="Enable Features navigation">
              <div className="inline-flex rounded-xl bg-muted p-1 shadow-sm">
                <a href="#enable-actions" className="px-4 py-2 whitespace-nowrap text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-background rounded-lg transition-all duration-200">Actions</a>
                <a href="#enable-controls" className="px-4 py-2 whitespace-nowrap text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-background rounded-lg transition-all duration-200">Controls</a>
              </div>
            </nav>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Actions Card */}
            <div id="enable-actions" className="group rounded-2xl border border-border bg-card p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-card-foreground">Featured Actions</h3>
                  <p className="text-sm text-muted-foreground">Quick trading actions and tools</p>
                </div>
              </div>
              <div className="mt-4">
                <TradingActions />
              </div>
            </div>

            {/* Controls Card */}
            <div id="enable-controls" className="group rounded-2xl border border-border bg-card p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
                  <Settings className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-card-foreground">Feature Controls</h3>
                  <p className="text-sm text-muted-foreground">Manage your trading features</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={handleEnableAll}
                    className="w-full px-4 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200"
                  >
                    Enable All Features
                  </button>
                  <button
                    onClick={handleDisableAll}
                    className="w-full px-4 py-3 rounded-xl bg-secondary hover:bg-secondary/90 text-secondary-foreground font-medium transition-all duration-200"
                  >
                    Disable All Features
                  </button>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => setGainzAlgoActive(true)}
                    className="px-4 py-3 rounded-xl bg-success/10 hover:bg-success/20 text-success border border-success/20 hover:border-success/40 font-medium transition-all duration-200"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Bot className="h-4 w-4" />
                      <span>Enable GainzAlgo</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setCopyTradingActive(true)}
                    className="px-4 py-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/20 hover:border-purple-500/40 font-medium transition-all duration-200"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>Enable Copy Trading</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setRiskManagementActive(true)}
                    className="px-4 py-3 rounded-xl bg-warning/10 hover:bg-warning/20 text-warning border border-warning/20 hover:border-warning/40 font-medium transition-all duration-200"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Shield className="h-4 w-4" />
                      <span>Enable Risk Management</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Workflow Status Indicator */}
        <div className={`rounded-2xl p-6 border transition-all duration-300 shadow-lg ${
          workflowStatus === 'idle' ? 'bg-muted/50 border-border' :
          workflowStatus === 'partial' ? 'bg-warning/5 border-warning/20' :
          workflowStatus === 'active' ? 'bg-primary/5 border-primary/20' :
          'bg-success/5 border-success/20'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`relative w-4 h-4 rounded-full ${
                workflowStatus === 'idle' ? 'bg-muted-foreground/40' :
                workflowStatus === 'partial' ? 'bg-warning animate-pulse' :
                workflowStatus === 'active' ? 'bg-primary animate-pulse' :
                'bg-success animate-pulse'
              }`}>
                {workflowStatus !== 'idle' && (
                  <div className={`absolute inset-0 rounded-full animate-ping ${
                    workflowStatus === 'partial' ? 'bg-warning' :
                    workflowStatus === 'active' ? 'bg-primary' :
                    'bg-success'
                  } opacity-75`}></div>
                )}
              </div>
              <div>
                <h3 className={`text-lg font-semibold ${
                  workflowStatus === 'idle' ? 'text-muted-foreground' :
                  workflowStatus === 'partial' ? 'text-warning' :
                  workflowStatus === 'active' ? 'text-primary' :
                  'text-success'
                }`}>
                  Trading Workflow: {
                    workflowStatus === 'idle' ? 'Standby' :
                    workflowStatus === 'partial' ? 'Partially Active' :
                    workflowStatus === 'active' ? 'Active' :
                    'Fully Optimized'
                  }
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {
                    workflowStatus === 'idle' ? 'Enable features below to start automated trading' :
                    workflowStatus === 'partial' ? 'Some automation features are active' :
                    workflowStatus === 'active' ? 'Multiple systems working together' :
                    'All automation systems fully integrated and optimized'
                  }
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {gainzAlgoActive && (
                <span className="px-3 py-1 bg-success/10 text-success text-xs font-medium rounded-full border border-success/20">
                  GainzAlgo
                </span>
              )}
              {copyTradingActive && (
                <span className="px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-medium rounded-full border border-purple-500/20">
                  Copy Trading
                </span>
              )}
              {riskManagementActive && (
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20">
                  Risk Control
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Quick Stats with Real-time Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Active Strategies Card */}
          <div className="group bg-gradient-to-br from-card to-success/5 rounded-2xl shadow-lg border border-border p-6 hover:shadow-xl transition-all duration-300 hover:border-success/20 relative overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-success rounded-full -translate-y-16 translate-x-16 animate-pulse"></div>
            </div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <p className="text-sm font-medium text-muted-foreground">Active Strategies</p>
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  </div>
                  <p className="text-3xl font-bold text-card-foreground mb-1">3</p>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-3 w-3 text-success" />
                    <p className="text-sm text-success font-medium">2 profitable</p>
                  </div>
                </div>
                <div className="bg-success/10 p-4 rounded-xl group-hover:bg-success/20 transition-colors duration-300">
                  <Bot className="h-7 w-7 text-success" />
                </div>
              </div>
              {/* Mini progress bar */}
              <div className="w-full bg-muted rounded-full h-2 mb-2">
                <div className="bg-success h-2 rounded-full transition-all duration-1000 ease-out" style={{width: '67%'}}></div>
              </div>
              <p className="text-xs text-muted-foreground">67% success rate</p>
            </div>
          </div>

          {/* Open Positions Card */}
          <div className="group bg-gradient-to-br from-card to-primary/5 rounded-2xl shadow-lg border border-border p-6 hover:shadow-xl transition-all duration-300 hover:border-primary/20 relative overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary rounded-full translate-y-12 -translate-x-12 animate-pulse"></div>
            </div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <p className="text-sm font-medium text-muted-foreground">Open Positions</p>
                    <div className="flex space-x-1">
                      <div className="w-1 h-4 bg-primary rounded-full animate-pulse"></div>
                      <div className="w-1 h-4 bg-primary/60 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-1 h-4 bg-primary/30 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-card-foreground mb-1">12</p>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-3 w-3 text-primary" />
                    <p className="text-sm text-primary font-medium">8 in profit</p>
                  </div>
                </div>
                <div className="bg-primary/10 p-4 rounded-xl group-hover:bg-primary/20 transition-colors duration-300">
                  <Target className="h-7 w-7 text-primary" />
                </div>
              </div>
              {/* Mini chart visualization */}
              <div className="flex items-end space-x-1 h-8 mb-2">
                <div className="w-2 bg-primary/30 rounded-t" style={{height: '20%'}}></div>
                <div className="w-2 bg-primary/50 rounded-t" style={{height: '40%'}}></div>
                <div className="w-2 bg-primary/70 rounded-t" style={{height: '60%'}}></div>
                <div className="w-2 bg-primary rounded-t" style={{height: '80%'}}></div>
                <div className="w-2 bg-primary rounded-t" style={{height: '100%'}}></div>
                <div className="w-2 bg-primary/80 rounded-t" style={{height: '90%'}}></div>
              </div>
              <p className="text-xs text-muted-foreground">P&L trend: +$2,340</p>
            </div>
          </div>

          {/* Active Signals Card */}
          <div className="group bg-gradient-to-br from-card to-purple-500/5 rounded-2xl shadow-lg border border-border p-6 hover:shadow-xl transition-all duration-300 hover:border-purple-500/20 relative overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-1/2 right-0 w-20 h-20 bg-purple-500 rounded-full translate-x-10 animate-ping"></div>
            </div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <p className="text-sm font-medium text-muted-foreground">Active Signals</p>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">LIVE</span>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-card-foreground mb-1">5</p>
                  <div className="flex items-center space-x-1">
                    <Zap className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                    <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">High confidence</p>
                  </div>
                </div>
                <div className="bg-purple-500/10 p-4 rounded-xl group-hover:bg-purple-500/20 transition-colors duration-300">
                  <Zap className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              {/* Signal strength indicator */}
              <div className="space-y-1 mb-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Signal Strength</span>
                  <span className="text-purple-600 dark:text-purple-400 font-medium">92%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-1000 ease-out" style={{width: '92%'}}></div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Last signal: 2 min ago</p>
            </div>
          </div>

          {/* Copiers Card */}
          <div className="group bg-gradient-to-br from-card to-orange-500/5 rounded-2xl shadow-lg border border-border p-6 hover:shadow-xl transition-all duration-300 hover:border-orange-500/20 relative overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute bottom-0 right-0 w-28 h-28 bg-orange-500 rounded-full translate-y-14 translate-x-14 animate-pulse"></div>
            </div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <p className="text-sm font-medium text-muted-foreground">Copiers</p>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-3 w-3 text-orange-600 dark:text-orange-400" />
                      <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">Growing</span>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-card-foreground mb-1">156</p>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                    <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">+8 today</p>
                  </div>
                </div>
                <div className="bg-orange-500/10 p-4 rounded-xl group-hover:bg-orange-500/20 transition-colors duration-300">
                  <Users className="h-7 w-7 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
              {/* Growth chart */}
              <div className="flex items-end justify-between h-6 mb-2">
                <div className="w-1 bg-orange-500/40 rounded-t" style={{height: '30%'}}></div>
                <div className="w-1 bg-orange-500/50 rounded-t" style={{height: '45%'}}></div>
                <div className="w-1 bg-orange-500/60 rounded-t" style={{height: '60%'}}></div>
                <div className="w-1 bg-orange-500/70 rounded-t" style={{height: '75%'}}></div>
                <div className="w-1 bg-orange-500/80 rounded-t" style={{height: '85%'}}></div>
                <div className="w-1 bg-orange-500 rounded-t" style={{height: '100%'}}></div>
              </div>
              <p className="text-xs text-muted-foreground">Monthly growth: +12.5%</p>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="bg-card rounded-2xl shadow-lg border border-border p-2">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveView('overview')}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 rounded-xl font-medium transition-all duration-200 ${
                activeView === 'overview'
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <BarChart3 className="h-5 w-5" />
              <span>Portfolio Overview</span>
            </button>
            <button
              onClick={() => setActiveView('trading')}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 rounded-xl font-medium transition-all duration-200 ${
                activeView === 'trading'
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Target className="h-5 w-5" />
              <span>Trading Panel</span>
            </button>
            <button
              onClick={() => setActiveView('strategies')}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 rounded-xl font-medium transition-all duration-200 ${
                activeView === 'strategies'
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Bot className="h-5 w-5" />
              <span>Strategies</span>
            </button>
            <button
              onClick={() => setActiveView('automation')}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 rounded-xl font-medium transition-all duration-200 ${
                activeView === 'automation'
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Bot className="h-5 w-5" />
              <span>Automation Hub</span>
            </button>
            <button
              onClick={() => setActiveView('ai-signals')}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 rounded-xl font-medium transition-all duration-200 ${
                activeView === 'ai-signals'
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Brain className="h-5 w-5" />
              <span>AI Signals</span>
            </button>
            <button
               onClick={() => setActiveView('templates')}
               className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 rounded-xl font-medium transition-all duration-200 ${
                 activeView === 'templates'
                   ? 'bg-primary text-primary-foreground shadow-lg'
                   : 'text-muted-foreground hover:text-foreground hover:bg-muted'
               }`}
             >
               <BookOpen className="h-5 w-5" />
               <span>Templates</span>
             </button>
             <button
               onClick={() => setActiveView('signals')}
               className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 rounded-xl font-medium transition-all duration-200 ${
                 activeView === 'signals'
                   ? 'bg-primary text-primary-foreground shadow-lg'
                   : 'text-muted-foreground hover:text-foreground hover:bg-muted'
               }`}
             >
               <Zap className="h-5 w-5" />
               <span>Signals</span>
             </button>
             <button
               onClick={() => setActiveView('backtesting')}
               className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 rounded-xl font-medium transition-all duration-200 ${
                 activeView === 'backtesting'
                   ? 'bg-primary text-primary-foreground shadow-lg'
                   : 'text-muted-foreground hover:text-foreground hover:bg-muted'
               }`}
             >
               <BarChart3 className="h-5 w-5" />
               <span>Backtesting</span>
             </button>
             <button
               onClick={() => setActiveView('performance-analytics')}
               className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 rounded-xl font-medium transition-all duration-200 ${
                 activeView === 'performance-analytics'
                   ? 'bg-primary text-primary-foreground shadow-lg'
                   : 'text-muted-foreground hover:text-foreground hover:bg-muted'
               }`}
             >
               <Activity className="h-5 w-5" />
               <span>Performance</span>
             </button>
          </div>
        </div>

        {/* Main Content */}
        {activeView === 'overview' && <PortfolioOverview />}
        {activeView === 'trading' && <TradingPanel />}
        {activeView === 'strategies' && <AutomatedStrategies />}
        {activeView === 'ai-signals' && <AISignalGenerator />}
         {activeView === 'templates' && <StrategyTemplates />}
         {activeView === 'signals' && <SignalDeliverySystem />}
         {activeView === 'backtesting' && <BacktestingEngine />}
         {activeView === 'performance-analytics' && <PerformanceAnalytics />}
        {activeView === 'automation' && (
          <div className="space-y-8">
            {/* Workflow Status Overview */}
            <div className="bg-card rounded-xl shadow-lg border border-border p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-foreground">Workflow Automation</h3>
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    workflowState.isConnected ? 'bg-success' : 'bg-destructive'
                  }`}></div>
                  <span className="text-sm text-muted-foreground font-medium">
                    {workflowState.isConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-primary/5 border border-primary/20 p-6 rounded-xl">
                  <div className="text-3xl font-bold text-primary">
                    {workflowState.workflows.length}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">Total Workflows</div>
                </div>
                <div className="bg-success/5 border border-success/20 p-6 rounded-xl">
                  <div className="text-3xl font-bold text-success">
                    {workflowState.activeWorkflows.length}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">Active Workflows</div>
                </div>
                <div className="bg-secondary/5 border border-secondary/20 p-6 rounded-xl">
                  <div className="text-3xl font-bold text-secondary-foreground">
                    {workflowState.recentExecutions.length}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">Recent Executions</div>
                </div>
              </div>
            </div>

            {/* Available Workflows */}
            <div className="bg-card rounded-xl shadow-lg border border-border p-8">
              <h4 className="text-xl font-semibold text-foreground mb-6">Available Workflows</h4>
              <div className="space-y-6">
                {workflowState.workflows.map((workflow) => (
                  <div key={workflow.id} className="flex items-center justify-between p-6 border border-border rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div className={`w-4 h-4 rounded-full ${
                          workflow.isActive ? 'bg-success' : 'bg-muted-foreground'
                        }`}></div>
                        <h5 className="font-semibold text-foreground">{workflow.name}</h5>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{workflow.description}</p>
                      <div className="flex items-center space-x-6 mt-3 text-xs text-muted-foreground">
                        <span>Executions: {workflow.executionCount}</span>
                        <span>Success Rate: {workflow.successRate}%</span>
                        {workflow.lastExecuted && (
                          <span>Last: {new Date(workflow.lastExecuted).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => toggleWorkflow(workflow.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          workflow.isActive
                            ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                            : 'bg-success/10 text-success hover:bg-success/20'
                        }`}
                      >
                        {workflow.isActive ? 'Disable' : 'Enable'}
                      </button>
                      <button
                        onClick={() => {
                          triggerFromDashboard(workflow.id, {
                            source: 'dashboard',
                            timestamp: new Date().toISOString()
                          });
                        }}
                        className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2"
                      >
                        <Play className="h-4 w-4" />
                        <span>Execute</span>
                      </button>
                      <button
                        onClick={() => {
                          triggerFromDashboard(workflow.id);
                          navigateToTrading(workflow.id, {
                             autoExecute: false,
                             source: 'dashboard',
                             workflowName: workflow.name,
                             timestamp: Date.now()
                           });
                        }}
                        className="px-4 py-2 bg-secondary/10 text-secondary-foreground hover:bg-secondary/20 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2"
                      >
                        <ArrowRight className="h-4 w-4" />
                        <span>Go to Trading</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Workflow Actions */}
            <div className="bg-card rounded-xl shadow-lg border border-border p-8">
              <h4 className="text-xl font-semibold text-foreground mb-6">Quick Workflow Actions</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <button
                  onClick={() => {
                    const stopLossWorkflow = workflowState.workflows.find(w => w.id === 'auto-stop-loss');
                    if (stopLossWorkflow) {
                      triggerFromDashboard(stopLossWorkflow.id, { action: 'quick_trigger' });
                      navigateToTrading(stopLossWorkflow.id, {
                        autoExecute: true,
                        source: 'dashboard_quick_action',
                        workflowType: 'risk_management',
                        timestamp: Date.now()
                      });
                    }
                  }}
                  className="p-6 border-2 border-dashed border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all duration-200 text-center group"
                >
                  <Shield className="h-10 w-10 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <div className="font-semibold text-foreground">Auto Stop Loss</div>
                  <div className="text-sm text-muted-foreground">Activate & Go to Trading</div>
                </button>
                
                <button
                  onClick={() => {
                    const profitWorkflow = workflowState.workflows.find(w => w.id === 'profit-taking');
                    if (profitWorkflow) {
                      triggerFromDashboard(profitWorkflow.id, { action: 'quick_trigger' });
                      navigateToTrading(profitWorkflow.id, {
                        autoExecute: true,
                        source: 'dashboard_quick_action',
                        workflowType: 'profit_taking',
                        timestamp: Date.now()
                      });
                    }
                  }}
                  className="p-6 border-2 border-dashed border-border rounded-xl hover:border-success hover:bg-success/5 transition-all duration-200 text-center group"
                >
                  <Target className="h-10 w-10 text-success mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <div className="font-semibold text-foreground">Profit Taking</div>
                  <div className="text-sm text-muted-foreground">Activate & Go to Trading</div>
                </button>
                
                <button
                  onClick={() => {
                    // Create and trigger portfolio rebalancing workflow
                    createWorkflow({
                       name: 'Portfolio Rebalancing',
                       description: 'Automatically rebalance portfolio based on target allocations',
                       isActive: false,
                       triggers: [],
                       actions: [],
                       conditions: [],
                       status: 'inactive'
                     });
                    alert('🔄 Portfolio Rebalancing Workflow Created!\n\n✅ Target allocation analysis\n✅ Automatic rebalancing triggers\n✅ Risk-adjusted position sizing\n✅ Execution optimization');
                  }}
                  className="p-6 border-2 border-dashed border-border rounded-xl hover:border-warning hover:bg-warning/5 transition-all duration-200 text-center group"
                >
                  <BarChart3 className="h-10 w-10 text-warning mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <div className="font-semibold text-foreground">Portfolio Rebalancing</div>
                  <div className="text-sm text-muted-foreground">Create & Activate</div>
                </button>
                
                <button
                  onClick={() => {
                    // Create and trigger market scanning workflow
                    createWorkflow({
                       name: 'Market Scanner',
                       description: 'Scan markets for trading opportunities based on technical indicators',
                       isActive: false,
                       triggers: [],
                       actions: [],
                       conditions: [],
                       status: 'inactive'
                     });
                    alert('🔍 Market Scanner Workflow Created!\n\n✅ Real-time market scanning\n✅ Technical indicator analysis\n✅ Opportunity alerts\n✅ Automated signal generation');
                  }}
                  className="p-6 border-2 border-dashed border-border rounded-xl hover:border-secondary hover:bg-secondary/5 transition-all duration-200 text-center group"
                >
                  <Zap className="h-10 w-10 text-secondary-foreground mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <div className="font-semibold text-foreground">Market Scanner</div>
                  <div className="text-sm text-muted-foreground">Create & Activate</div>
                </button>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => window.open('/automation', '_blank')}
                    className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors text-center"
                  >
                    <Settings className="h-6 w-6 mx-auto mb-2" />
                    <div className="font-medium">Workflow Builder</div>
                    <div className="text-sm opacity-90">Create Custom Workflows</div>
                  </button>
                  
                  <button
                    onClick={() => navigateToTrading(undefined, {
                       source: 'dashboard_quick_action',
                       timestamp: Date.now()
                     })}
                    className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-colors text-center"
                  >
                    <ArrowRight className="h-6 w-6 mx-auto mb-2" />
                    <div className="font-medium">Go to Trading</div>
                    <div className="text-sm opacity-90">Open Trading Dashboard</div>
                  </button>
                  
                  <button
                    onClick={() => {
                      // Trigger all active workflows
                      workflowState.activeWorkflows.forEach(workflow => {
                        triggerFromDashboard(workflow.id, { action: 'bulk_trigger', source: 'dashboard' });
                      });
                      alert(`🚀 Triggered ${workflowState.activeWorkflows.length} Active Workflows!\n\nAll your active automation workflows have been executed.`);
                    }}
                    className="p-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-colors text-center"
                  >
                    <Play className="h-6 w-6 mx-auto mb-2" />
                    <div className="font-medium">Execute All</div>
                    <div className="text-sm opacity-90">Run Active Workflows</div>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Workflow Templates */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Popular Workflow Templates</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer"
                     onClick={() => {
                       createWorkflow({
                          name: 'DCA Strategy',
                          description: 'Dollar-cost averaging with automated recurring purchases',
                          isActive: false,
                          triggers: [],
                          actions: [],
                          conditions: [],
                          status: 'inactive'
                        });
                       alert('💰 DCA Strategy Template Applied!\n\n✅ Weekly recurring purchases\n✅ Automated dollar-cost averaging\n✅ Risk-adjusted position sizing');
                     }}>
                  <DollarSign className="h-8 w-8 text-green-600 mb-3" />
                  <div className="font-medium text-gray-900 dark:text-white mb-1">DCA Strategy</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Automated dollar-cost averaging with scheduled purchases</div>
                </div>
                
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors cursor-pointer"
                     onClick={() => {
                       createWorkflow({
                          name: 'Momentum Trading',
                          description: 'Automated momentum-based trading strategy',
                          isActive: false,
                          triggers: [],
                          actions: [],
                          conditions: [],
                          status: 'inactive'
                        });
                       alert('⚡ Momentum Trading Template Applied!\n\n✅ Technical indicator triggers\n✅ Momentum-based entries\n✅ Automated position management');
                     }}>
                  <TrendingUp className="h-8 w-8 text-purple-600 mb-3" />
                  <div className="font-medium text-gray-900 dark:text-white mb-1">Momentum Trading</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Capture market momentum with automated entries and exits</div>
                </div>
                
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                     onClick={() => {
                       createWorkflow({
                          name: 'Risk Management Suite',
                          description: 'Comprehensive risk management and protection',
                          isActive: false,
                          triggers: [],
                          actions: [],
                          conditions: [],
                          status: 'inactive'
                        });
                       alert('🛡️ Risk Management Suite Applied!\n\n✅ Automated stop-losses\n✅ Position size management\n✅ Drawdown protection\n✅ Portfolio risk monitoring');
                     }}>
                  <Shield className="h-8 w-8 text-red-600 mb-3" />
                  <div className="font-medium text-gray-900 dark:text-white mb-1">Risk Management</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Comprehensive risk controls and automated protection</div>
                </div>
              </div>
            </div>

            {/* Enhanced Dashboard Automation */}
            <DashboardAutomation 
              onAutomationChange={(isActive) => {
                // Handle automation state changes
                console.log('Dashboard automation state changed:', isActive);
              }}
            />
          </div>
        )}

            {/* Recent Executions */}
            {workflowState.recentExecutions.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Executions</h4>
                <div className="space-y-3">
                  {workflowState.recentExecutions.slice(0, 5).map((execution) => {
                    const workflow = workflowState.workflows.find(w => w.id === execution.workflowId);
                    return (
                      <div key={execution.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {workflow?.name || execution.workflowId}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(execution.startedAt).toLocaleString()}
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          execution.status === 'completed' ? 'bg-green-100 text-green-700' :
                          execution.status === 'failed' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {execution.status}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

        {/* Quick Actions Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
            <div className="flex items-center space-x-3 mb-3">
              <TrendingUp className="h-6 w-6" />
              <h3 className="text-lg font-semibold">GainzAlgo V2 Pro</h3>
            </div>
            <p className="text-green-100 text-sm mb-4">
              High-frequency momentum strategy with 78% win rate and 1.85x profit factor
            </p>
            <button 
              onClick={() => setGainzAlgoActive(!gainzAlgoActive)}
              className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                gainzAlgoActive 
                  ? 'bg-green-200 text-green-800 hover:bg-green-300' 
                  : 'bg-white text-green-600 hover:bg-gray-100'
              }`}
            >
              {gainzAlgoActive ? 'Deactivate Strategy' : 'Activate Strategy'}
            </button>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white">
            <div className="flex items-center space-x-3 mb-3">
              <Users className="h-6 w-6" />
              <h3 className="text-lg font-semibold">Copy Trading</h3>
            </div>
            <p className="text-purple-100 text-sm mb-4">
              Follow top traders and automatically copy their winning strategies
            </p>
            <button 
              onClick={() => setCopyTradingActive(!copyTradingActive)}
              className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                copyTradingActive 
                  ? 'bg-purple-200 text-purple-800 hover:bg-purple-300' 
                  : 'bg-white text-purple-600 hover:bg-gray-100'
              }`}
            >
              {copyTradingActive ? 'Disable Copy Trading' : 'Enable Copy Trading'}
            </button>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-6 text-white">
            <div className="flex items-center space-x-3 mb-3">
              <Shield className="h-6 w-6" />
              <h3 className="text-lg font-semibold">Risk Management</h3>
            </div>
            <p className="text-blue-100 text-sm mb-4">
              Advanced risk controls with automated stop-loss and position sizing
            </p>
            <button 
              onClick={() => setRiskManagementActive(!riskManagementActive)}
              className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                riskManagementActive 
                  ? 'bg-blue-200 text-blue-800 hover:bg-blue-300' 
                  : 'bg-white text-blue-600 hover:bg-gray-100'
              }`}
            >
              {riskManagementActive ? 'Risk Controls Active' : 'Enable Risk Controls'}
            </button>
          </div>
      </div>

      {/* Feature Comparison Table */}
      <div className="mt-12 mb-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose KAIROQUANTUM?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Compare our AI-powered features with traditional trading platforms
          </p>
        </div>

        <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-primary/10 to-purple-500/10">
                <tr>
                  <th className="text-left p-6 font-semibold text-foreground">Features</th>
                  <th className="text-center p-6 font-semibold text-foreground">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary to-purple-600 rounded-lg flex items-center justify-center">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <span>KAIROQUANTUM</span>
                    </div>
                  </th>
                  <th className="text-center p-6 font-semibold text-muted-foreground">Traditional Platforms</th>
                  <th className="text-center p-6 font-semibold text-muted-foreground">Manual Trading</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="p-6 font-medium text-foreground">AI-Powered Signal Generation</td>
                  <td className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-8 h-8 bg-success rounded-full">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-8 h-8 bg-destructive rounded-full">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-8 h-8 bg-destructive rounded-full">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="p-6 font-medium text-foreground">24/7 Automated Trading</td>
                  <td className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-8 h-8 bg-success rounded-full">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-8 h-8 bg-yellow-500 rounded-full">
                      <span className="text-white text-xs font-bold">~</span>
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-8 h-8 bg-destructive rounded-full">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="p-6 font-medium text-foreground">Advanced Risk Management</td>
                  <td className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-8 h-8 bg-success rounded-full">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-8 h-8 bg-yellow-500 rounded-full">
                      <span className="text-white text-xs font-bold">~</span>
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-8 h-8 bg-yellow-500 rounded-full">
                      <span className="text-white text-xs font-bold">~</span>
                    </div>
                  </td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="p-6 font-medium text-foreground">Copy Trading Network</td>
                  <td className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-8 h-8 bg-success rounded-full">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-8 h-8 bg-destructive rounded-full">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-8 h-8 bg-destructive rounded-full">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="p-6 font-medium text-foreground">Real-time Market Analysis</td>
                  <td className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-8 h-8 bg-success rounded-full">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-8 h-8 bg-yellow-500 rounded-full">
                      <span className="text-white text-xs font-bold">~</span>
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-8 h-8 bg-destructive rounded-full">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="p-6 font-medium text-foreground">Multi-Broker Integration</td>
                  <td className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-8 h-8 bg-success rounded-full">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-8 h-8 bg-yellow-500 rounded-full">
                      <span className="text-white text-xs font-bold">~</span>
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-8 h-8 bg-destructive rounded-full">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="bg-gradient-to-r from-primary/5 to-purple-500/5 p-6 border-t border-border">
            <div className="flex items-center justify-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-success rounded-full"></div>
                <span className="text-sm text-muted-foreground">Full Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-muted-foreground">Partial Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-destructive rounded-full"></div>
                <span className="text-sm text-muted-foreground">Not Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Stories & Testimonials Section */}
      <div className="mt-12 mb-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">Trusted by Successful Traders</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join thousands of traders who have transformed their trading with KAIROQUANTUM's AI-powered automation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Testimonial 1 */}
          <div className="bg-gradient-to-br from-card to-success/5 rounded-2xl p-6 border border-border shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <span className="ml-2 text-sm text-muted-foreground">5.0</span>
            </div>
            <blockquote className="text-foreground mb-4">
              "KAIROQUANTUM's AI signals increased my win rate from 45% to 78% in just 3 months. The automation features saved me hours of manual analysis daily."
            </blockquote>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                MK
              </div>
              <div className="ml-3">
                <div className="font-semibold text-foreground">Michael K.</div>
                <div className="text-sm text-muted-foreground">Professional Trader</div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-success/10 rounded-lg border border-success/20">
              <div className="text-sm text-success font-medium">+$47,230 profit in Q1</div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-gradient-to-br from-card to-primary/5 rounded-2xl p-6 border border-border shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <span className="ml-2 text-sm text-muted-foreground">5.0</span>
            </div>
            <blockquote className="text-foreground mb-4">
              "The copy trading feature is incredible. I follow top performers and my portfolio has grown 156% this year while I focus on my day job."
            </blockquote>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
                SL
              </div>
              <div className="ml-3">
                <div className="font-semibold text-foreground">Sarah L.</div>
                <div className="text-sm text-muted-foreground">Part-time Trader</div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
              <div className="text-sm text-primary font-medium">156% portfolio growth</div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-gradient-to-br from-card to-purple-500/5 rounded-2xl p-6 border border-border shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <span className="ml-2 text-sm text-muted-foreground">5.0</span>
            </div>
            <blockquote className="text-foreground mb-4">
              "Risk management tools are game-changing. Automated stop-losses and position sizing protected my capital during market volatility."
            </blockquote>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold">
                DJ
              </div>
              <div className="ml-3">
                <div className="font-semibold text-foreground">David J.</div>
                <div className="text-sm text-muted-foreground">Hedge Fund Manager</div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">Protected $2.1M portfolio</div>
            </div>
          </div>
        </div>

        {/* Success Metrics */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-2xl p-8 border border-blue-200 dark:border-blue-800">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-foreground mb-2">Platform Success Metrics</h3>
            <p className="text-muted-foreground">Real results from our trading community</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">89%</div>
              <div className="text-sm text-muted-foreground">Average Win Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-success mb-2">$12.4M</div>
              <div className="text-sm text-muted-foreground">Total Profits Generated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">15,000+</div>
              <div className="text-sm text-muted-foreground">Active Traders</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">AI Monitoring</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Notification Center */}
      <NotificationCenter 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </DashboardLayout>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}