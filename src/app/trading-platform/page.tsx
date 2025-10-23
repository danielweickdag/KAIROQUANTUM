'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  DollarSign, 
  Target, 
  Bot, 
  Users, 
  BarChart3,
  Settings,
  Bell,
  Play,
  Pause,
  RefreshCw,
  Zap,
  Shield,
  Brain,
  Globe,
  Clock,
  Menu,
  X,
  Wallet
} from 'lucide-react';
import TradingChart from '@/components/trading/TradingChart';
import AITradingBot from '@/components/trading/AITradingBot';
import CopyTradingPanel from '@/components/trading/CopyTradingPanel';
import OrderPanel from '@/components/trading/OrderPanel';
import PositionsPanel from '@/components/trading/PositionsPanel';
import MarketScanner from '@/components/trading/MarketScanner';
import GainzAlgoPanel from '@/components/trading/GainzAlgoPanel';
import DailyProfitTarget from '@/components/trading/DailyProfitTarget';
import RiskManagement from '@/components/trading/RiskManagement';
import MarketNews from '@/components/trading/MarketNews';
import PineScriptAuditor from '@/components/trading/PineScriptAuditor';
import MultiMarketPanel from '@/components/trading/MultiMarketPanel';
import TradingAutomation from '@/components/trading/TradingAutomation';
import PortfolioPanel from '@/components/trading/PortfolioPanel';
import { MobileDrawer } from '@/components/ui/mobile-drawer';

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

interface TradingStats {
  totalProfit: number;
  winRate: number;
  profitFactor: number;
  drawdown: number;
  dailyTarget: number;
  dailyProgress: number;
}

export default function TradingPlatform() {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [isAIBotActive, setIsAIBotActive] = useState(false);
  const [isCopyTradingActive, setIsCopyTradingActive] = useState(false);
  const [activeTab, setActiveTab] = useState('');
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [tradingStats, setTradingStats] = useState<TradingStats>({
    totalProfit: 12847.50,
    winRate: 78.5,
    profitFactor: 1.73,
    drawdown: 3.2,
    dailyTarget: 500,
    dailyProgress: 347.80
  });

  // Simulate real-time market data
  useEffect(() => {
    const mockData: MarketData[] = [
      { symbol: 'AAPL', price: 175.43, change: 2.15, changePercent: 1.24, volume: 45678900 },
      { symbol: 'TSLA', price: 248.87, change: -3.42, changePercent: -1.36, volume: 32145600 },
      { symbol: 'NVDA', price: 421.33, change: 8.76, changePercent: 2.12, volume: 28934500 },
      { symbol: 'MSFT', price: 378.92, change: 1.87, changePercent: 0.50, volume: 19876543 },
      { symbol: 'GOOGL', price: 142.65, change: -0.95, changePercent: -0.66, volume: 15432100 }
    ];
    setMarketData(mockData);

    // Update data every 5 seconds
    const interval = setInterval(() => {
      setMarketData(prev => prev.map(stock => ({
        ...stock,
        price: stock.price + (Math.random() - 0.5) * 2,
        change: (Math.random() - 0.5) * 5,
        changePercent: (Math.random() - 0.5) * 3
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 lg:px-6 py-3 lg:py-4 gap-3">
          <div className="flex items-center justify-between w-full sm:w-auto">
            <div className="flex items-center space-x-3 lg:space-x-4">
              <h1 className="text-lg lg:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                KAIRO Trading Platform
              </h1>
              <Badge variant="outline" className="border-green-500 text-green-400 text-xs">
                <Activity className="w-3 h-3 mr-1" />
                Live
              </Badge>
            </div>
            
            {/* Mobile Menu */}
            <div className="lg:hidden">
              <MobileDrawer 
                title="Trading Controls"
                trigger={
                  <Button variant="outline" size="sm" className="p-2">
                    <Menu className="h-4 w-4" />
                  </Button>
                }
              >
                <div className="space-y-6">
                  {/* AI Bot & Copy Trading Controls */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-white">Trading Controls</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-300">AI Bot</span>
                        <Button
                          variant={isAIBotActive ? "default" : "outline"}
                          size="sm"
                          onClick={() => setIsAIBotActive(!isAIBotActive)}
                          className={`text-xs ${isAIBotActive ? "bg-green-600 hover:bg-green-700" : ""}`}
                        >
                          {isAIBotActive ? 'ON' : 'OFF'}
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-300">Copy Trading</span>
                        <Button
                          variant={isCopyTradingActive ? "default" : "outline"}
                          size="sm"
                          onClick={() => setIsCopyTradingActive(!isCopyTradingActive)}
                          className={`text-xs ${isCopyTradingActive ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                        >
                          {isCopyTradingActive ? 'ON' : 'OFF'}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-white">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="flex flex-col items-center p-3 h-auto">
                        <Settings className="h-5 w-5 mb-1" />
                        <span className="text-xs">Settings</span>
                      </Button>
                      <Button variant="outline" className="flex flex-col items-center p-3 h-auto relative">
                        <Bell className="h-5 w-5 mb-1" />
                        <span className="text-xs">Alerts</span>
                        <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                      </Button>
                    </div>
                  </div>
                </div>
              </MobileDrawer>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center space-x-2 lg:space-x-4 w-full sm:w-auto">
            {/* AI Bot Status */}
            <Button
              variant={isAIBotActive ? "default" : "outline"}
              size="sm"
              onClick={() => setIsAIBotActive(!isAIBotActive)}
              className={`text-xs lg:text-sm ${isAIBotActive ? "bg-green-600 hover:bg-green-700" : ""}`}
            >
              <Bot className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
              <span className="hidden sm:inline">AI Bot</span>
              <span className="sm:hidden">AI</span>
              <span className="ml-1">{isAIBotActive ? 'ON' : 'OFF'}</span>
            </Button>

            {/* Copy Trading Status */}
            <Button
              variant={isCopyTradingActive ? "default" : "outline"}
              size="sm"
              onClick={() => setIsCopyTradingActive(!isCopyTradingActive)}
              className={`text-xs lg:text-sm ${isCopyTradingActive ? "bg-blue-600 hover:bg-blue-700" : ""}`}
            >
              <Users className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
              <span className="hidden sm:inline">Copy Trading</span>
              <span className="sm:hidden">Copy</span>
              <span className="ml-1">{isCopyTradingActive ? 'ON' : 'OFF'}</span>
            </Button>

            <Button variant="outline" size="sm" className="text-xs lg:text-sm">
              <Settings className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="hidden lg:inline ml-2">Settings</span>
            </Button>
            <Button variant="outline" size="sm" className="text-xs lg:text-sm">
              <Bell className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="hidden lg:inline ml-2">Alerts</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)]">
        {/* Left Sidebar - Market Data & Tools */}
        <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-slate-700 bg-slate-900/30 backdrop-blur-sm overflow-y-auto">
          <div className="p-3 lg:p-4 space-y-3 lg:space-y-4">
            {/* Collapsible Market Scanner */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-300 flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                Market Scanner
              </h3>
              <MarketScanner />
            </div>

            {/* Collapsible GainzAlgo Features */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-300 flex items-center">
                <Zap className="w-4 h-4 mr-2" />
                GainzAlgo
              </h3>
              <GainzAlgoPanel />
            </div>
          </div>
        </div>

        {/* Center - Chart Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Chart Header */}
          <div className="border-b border-slate-700 bg-slate-900/30 p-3 lg:p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-4">
                <h2 className="text-lg lg:text-xl font-bold">{selectedSymbol}</h2>
                <div className="flex items-center space-x-2">
                  {marketData.find(s => s.symbol === selectedSymbol) && (
                    <>
                      <span className="text-xl lg:text-2xl font-bold">
                        ${marketData.find(s => s.symbol === selectedSymbol)?.price.toFixed(2)}
                      </span>
                      <span className={`flex items-center text-sm lg:text-base ${
                        (marketData.find(s => s.symbol === selectedSymbol)?.change || 0) >= 0 
                          ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {(marketData.find(s => s.symbol === selectedSymbol)?.change || 0) >= 0 
                          ? <TrendingUp className="w-3 h-3 lg:w-4 lg:h-4 mr-1" /> 
                          : <TrendingDown className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                        }
                        {marketData.find(s => s.symbol === selectedSymbol)?.changePercent.toFixed(2)}%
                      </span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-1 lg:space-x-2">
                <Button variant="outline" size="sm" className="text-xs lg:text-sm">
                  <Clock className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                  1D
                </Button>
                <Button variant="outline" size="sm" className="text-xs lg:text-sm">1W</Button>
                <Button variant="outline" size="sm" className="text-xs lg:text-sm">1M</Button>
                <Button variant="outline" size="sm" className="text-xs lg:text-sm">1Y</Button>
                <Button variant="outline" size="sm" className="text-xs lg:text-sm">
                  <RefreshCw className="w-3 h-3 lg:w-4 lg:h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="flex-1 p-2 lg:p-4 min-h-0">
            <TradingChart symbol={selectedSymbol} />
          </div>
        </div>

        {/* Right Sidebar - Trading Panels - Hidden on mobile, shown in drawer */}
        <div className="hidden lg:block w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-slate-700 bg-slate-900/30 backdrop-blur-sm overflow-y-auto">
          <div className="p-3 lg:p-4">
            {/* Primary Trading Controls */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center">
                <Target className="w-4 h-4 mr-2" />
                Trading Controls
              </h3>
              <Tabs defaultValue="order" className="w-full">
                <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 bg-slate-800 text-xs">
                  <TabsTrigger value="order" className="text-xs">Order</TabsTrigger>
                  <TabsTrigger value="positions" className="text-xs">Positions</TabsTrigger>
                  <TabsTrigger value="portfolio" className="text-xs">Portfolio</TabsTrigger>
                  <TabsTrigger value="ai" className="text-xs">AI Bot</TabsTrigger>
                  <TabsTrigger value="copy" className="text-xs lg:block hidden">Copy</TabsTrigger>
                  <TabsTrigger value="target" className="text-xs lg:block hidden">Target</TabsTrigger>
                  <TabsTrigger value="automation" className="text-xs">Auto</TabsTrigger>
                </TabsList>
                
                <TabsContent value="order" className="mt-4">
                  <OrderPanel symbol={selectedSymbol} />
                </TabsContent>
                
                <TabsContent value="positions" className="mt-4">
                  <PositionsPanel />
                </TabsContent>
                
                <TabsContent value="portfolio" className="mt-4">
                  <PortfolioPanel />
                </TabsContent>
                
                <TabsContent value="ai" className="mt-4">
                  <AITradingBot isActive={isAIBotActive} onToggle={setIsAIBotActive} />
                </TabsContent>
                
                <TabsContent value="copy" className="mt-4">
                  <CopyTradingPanel isActive={isCopyTradingActive} onToggle={setIsCopyTradingActive} />
                </TabsContent>
                
                <TabsContent value="target" className="mt-4">
                  <DailyProfitTarget isActive={isAIBotActive} onToggle={setIsAIBotActive} />
                </TabsContent>
                
                <TabsContent value="automation" className="mt-4">
                  <TradingAutomation 
                    pageType="trading-platform"
                    onAutomationChange={(isActive) => {
                      // Handle automation state changes
                      console.log('Automation active:', isActive);
                    }}
                    onTradeExecuted={(trade) => {
                      // Handle trade execution
                      console.log('Trade executed:', trade);
                    }}
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* Secondary Tools */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-300 flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Analysis & Tools
              </h3>
              <Tabs defaultValue="risk" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-slate-800 text-xs">
                  <TabsTrigger value="risk" className="text-xs">Risk</TabsTrigger>
                  <TabsTrigger value="news" className="text-xs">News</TabsTrigger>
                  <TabsTrigger value="pine" className="text-xs lg:block hidden">Pine</TabsTrigger>
                  <TabsTrigger value="markets" className="text-xs lg:block hidden">Markets</TabsTrigger>
                </TabsList>
                
                <TabsContent value="risk" className="mt-4">
                  <RiskManagement />
                </TabsContent>
                
                <TabsContent value="news" className="mt-4">
                  <MarketNews />
                </TabsContent>
                
                <TabsContent value="pine" className="mt-4">
                  <PineScriptAuditor />
                </TabsContent>
                
                <TabsContent value="markets" className="mt-4">
                  <MultiMarketPanel />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Trading Panel */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-40">
          <div className="grid grid-cols-4 h-16">
            <button 
              onClick={() => setActiveTab('order')}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                activeTab === 'order' 
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <DollarSign className="h-5 w-5" />
              <span className="text-xs font-medium">Order</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('positions')}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                activeTab === 'positions' 
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <BarChart3 className="h-5 w-5" />
              <span className="text-xs font-medium">Positions</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('portfolio')}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                activeTab === 'portfolio' 
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Wallet className="h-5 w-5" />
              <span className="text-xs font-medium">Portfolio</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('automation')}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                activeTab === 'automation' 
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Bot className="h-5 w-5" />
              <span className="text-xs font-medium">Auto</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('ai')}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors relative ${
                activeTab === 'ai' 
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Activity className="h-5 w-5" />
              <span className="text-xs font-medium">AI Bot</span>
              {isAIBotActive && (
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full"></span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Tab Content Overlay */}
        {activeTab && (
          <div className="lg:hidden fixed inset-x-0 bottom-16 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg max-h-96 overflow-y-auto z-30">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                  {activeTab === 'ai' ? 'AI Bot' : activeTab}
                </h3>
                <button 
                  onClick={() => setActiveTab('')}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* Tab Content */}
              {activeTab === 'order' && (
                <div className="space-y-4">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <DollarSign className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Order panel content will be displayed here</p>
                  </div>
                </div>
              )}
              
              {activeTab === 'positions' && (
                <div className="space-y-4">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Positions panel content will be displayed here</p>
                  </div>
                </div>
              )}
              
              {activeTab === 'portfolio' && (
                <div className="space-y-4">
                  <PortfolioPanel />
                </div>
              )}
              
              {activeTab === 'automation' && (
                <div className="space-y-4">
                  <TradingAutomation 
                    pageType="trading-platform"
                    onAutomationChange={(config) => console.log('Automation config:', config)}
                    onTradeExecuted={(trade) => console.log('Trade executed:', trade)}
                  />
                </div>
              )}
              
              {activeTab === 'ai' && (
                <div className="space-y-4">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <Bot className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>AI Bot panel content will be displayed here</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}