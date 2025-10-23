'use client';

import React from 'react';
import { TrendingUp, TrendingDown, BarChart3, DollarSign } from 'lucide-react';

const FuturesTrading = () => {
  return (
    <div className="space-y-6">
      {/* Futures Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Futures Trading
          </h2>
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Live Market</span>
          </div>
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">ES (S&P 500)</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">4,567.25</p>
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-sm text-green-600 mt-1">+12.50 (+0.27%)</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">NQ (NASDAQ)</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">15,234.75</p>
              </div>
              <TrendingDown className="h-5 w-5 text-red-500" />
            </div>
            <p className="text-sm text-red-600 mt-1">-45.25 (-0.30%)</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">CL (Crude Oil)</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">$78.45</p>
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-sm text-green-600 mt-1">+1.23 (+1.59%)</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">GC (Gold)</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">$2,045.30</p>
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-sm text-green-600 mt-1">+8.70 (+0.43%)</p>
          </div>
        </div>

        {/* Trading Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Panel */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Place Futures Order
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contract
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                  <option>ES (S&P 500 E-mini)</option>
                  <option>NQ (NASDAQ E-mini)</option>
                  <option>CL (Crude Oil)</option>
                  <option>GC (Gold)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Order Type
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                    <option>Market</option>
                    <option>Limit</option>
                    <option>Stop</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contracts
                  </label>
                  <input
                    type="number"
                    min="1"
                    defaultValue="1"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  step="0.25"
                  placeholder="Market Price"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
                  Buy Long
                </button>
                <button className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
                  Sell Short
                </button>
              </div>
            </div>
          </div>

          {/* Position Summary */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Open Positions
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">ES Dec23</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">2 Contracts Long</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">+$1,250</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">+2.1%</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">CL Jan24</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">1 Contract Long</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-red-600">-$340</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">-0.8%</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total P&L</span>
                <span className="font-medium text-green-600">+$910</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Management */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Risk Management
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Margin Used</span>
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">$12,500</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">of $50,000 available</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <BarChart3 className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Buying Power</span>
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">$37,500</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Available for trading</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Daily P&L</span>
            </div>
            <p className="text-lg font-semibold text-green-600">+$910</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">+1.82% today</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FuturesTrading;