'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Clock, Globe, AlertCircle, BarChart3 } from 'lucide-react';

const MarketUpdates = () => {
  return (
    <div className="space-y-6">
      {/* Market Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Market Updates
          </h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Live</span>
          </div>
        </div>

        {/* Major Indices */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">S&P 500</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">4,567.25</p>
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-sm text-green-600 mt-1">+12.50 (+0.27%)</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">NASDAQ</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">15,234.75</p>
              </div>
              <TrendingDown className="h-5 w-5 text-red-500" />
            </div>
            <p className="text-sm text-red-600 mt-1">-45.25 (-0.30%)</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Dow Jones</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">36,789.12</p>
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-sm text-green-600 mt-1">+89.34 (+0.24%)</p>
          </div>
        </div>
      </div>

      {/* Market News */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Latest Market News
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-red-900 dark:text-red-100">
                  Fed Announces Interest Rate Decision
                </h4>
                <span className="text-xs text-red-600 dark:text-red-400">2 min ago</span>
              </div>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                Federal Reserve maintains rates at 5.25-5.50%, signaling potential cuts in 2024.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <Globe className="h-5 w-5 text-blue-500 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Tech Earnings Beat Expectations
                </h4>
                <span className="text-xs text-gray-600 dark:text-gray-400">15 min ago</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Major tech companies report strong Q4 earnings, driving NASDAQ higher.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <BarChart3 className="h-5 w-5 text-green-500 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Oil Prices Surge on Supply Concerns
                </h4>
                <span className="text-xs text-gray-600 dark:text-gray-400">32 min ago</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Crude oil jumps 3% amid geopolitical tensions and supply disruptions.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <TrendingUp className="h-5 w-5 text-purple-500 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Bitcoin Reaches New Monthly High
                </h4>
                <span className="text-xs text-gray-600 dark:text-gray-400">1 hour ago</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Cryptocurrency markets rally as institutional adoption continues to grow.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Economic Calendar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Economic Calendar
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center space-x-3">
              <Clock className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-900 dark:text-yellow-100">
                  Non-Farm Payrolls
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Expected: 180K | Previous: 199K
                </p>
              </div>
            </div>
            <span className="text-sm font-medium text-yellow-600">Today 8:30 AM</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <Clock className="h-4 w-4 text-gray-500" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Consumer Price Index
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Expected: 3.2% | Previous: 3.1%
                </p>
              </div>
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Tomorrow 8:30 AM</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <Clock className="h-4 w-4 text-gray-500" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  FOMC Meeting Minutes
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Previous meeting insights
                </p>
              </div>
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Wed 2:00 PM</span>
          </div>
        </div>
      </div>

      {/* Market Movers */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Top Market Movers
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gainers */}
          <div>
            <h4 className="text-md font-medium text-green-600 mb-3">Top Gainers</h4>
            <div className="space-y-2">
              {[
                { symbol: 'NVDA', price: 485.20, change: 24.15, percent: 5.24 },
                { symbol: 'TSLA', price: 248.50, change: 12.30, percent: 5.21 },
                { symbol: 'AMD', price: 142.80, change: 6.45, percent: 4.73 }
              ].map((stock) => (
                <div key={stock.symbol} className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{stock.symbol}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">${stock.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">+${stock.change}</p>
                    <p className="text-xs text-green-600">+{stock.percent}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Losers */}
          <div>
            <h4 className="text-md font-medium text-red-600 mb-3">Top Losers</h4>
            <div className="space-y-2">
              {[
                { symbol: 'META', price: 342.15, change: -18.25, percent: -5.06 },
                { symbol: 'NFLX', price: 456.80, change: -22.10, percent: -4.62 },
                { symbol: 'GOOGL', price: 138.90, change: -6.15, percent: -4.24 }
              ].map((stock) => (
                <div key={stock.symbol} className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{stock.symbol}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">${stock.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-red-600">${stock.change}</p>
                    <p className="text-xs text-red-600">{stock.percent}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sector Performance */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Sector Performance
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Technology', change: 1.85, positive: true },
            { name: 'Healthcare', change: 0.92, positive: true },
            { name: 'Energy', change: 2.34, positive: true },
            { name: 'Financials', change: -0.45, positive: false },
            { name: 'Consumer Disc.', change: -1.23, positive: false },
            { name: 'Industrials', change: 0.67, positive: true },
            { name: 'Materials', change: 1.12, positive: true },
            { name: 'Utilities', change: -0.78, positive: false }
          ].map((sector) => (
            <div key={sector.name} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{sector.name}</p>
              <p className={`text-sm font-medium ${
                sector.positive ? 'text-green-600' : 'text-red-600'
              }`}>
                {sector.positive ? '+' : ''}{sector.change}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketUpdates;