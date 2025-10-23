'use client';

import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Target, Calendar, DollarSign, BarChart3 } from 'lucide-react';

const OptionsTrading = () => {
  const [selectedStrategy, setSelectedStrategy] = useState('call');

  return (
    <div className="space-y-6">
      {/* Options Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Options Trading
          </h2>
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Live Options Chain</span>
          </div>
        </div>

        {/* Strategy Selector */}
        <div className="mb-6">
          <div className="flex space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {[
              { id: 'call', label: 'Buy Call' },
              { id: 'put', label: 'Buy Put' },
              { id: 'covered-call', label: 'Covered Call' },
              { id: 'protective-put', label: 'Protective Put' },
              { id: 'straddle', label: 'Straddle' },
              { id: 'strangle', label: 'Strangle' }
            ].map((strategy) => (
              <button
                key={strategy.id}
                onClick={() => setSelectedStrategy(strategy.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedStrategy === strategy.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {strategy.label}
              </button>
            ))}
          </div>
        </div>

        {/* Underlying Stock Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">AAPL</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">$185.42</p>
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-sm text-green-600 mt-1">+2.15 (+1.17%)</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Implied Vol</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">24.5%</p>
              </div>
              <BarChart3 className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">30-day average</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Days to Exp</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">23</p>
              </div>
              <Calendar className="h-5 w-5 text-purple-500" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Dec 15, 2023</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Delta</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">0.65</p>
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">At-the-money</p>
          </div>
        </div>

        {/* Options Chain */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calls */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 text-center">
              Calls
            </h3>
            
            <div className="space-y-2">
              <div className="grid grid-cols-5 gap-2 text-xs font-medium text-gray-600 dark:text-gray-400 pb-2 border-b border-gray-200 dark:border-gray-600">
                <span>Strike</span>
                <span>Bid</span>
                <span>Ask</span>
                <span>Vol</span>
                <span>OI</span>
              </div>

              {[
                { strike: 180, bid: 7.20, ask: 7.40, vol: 1250, oi: 2340 },
                { strike: 185, bid: 3.80, ask: 4.00, vol: 2100, oi: 4560, atm: true },
                { strike: 190, bid: 1.45, ask: 1.65, vol: 890, oi: 1890 },
                { strike: 195, bid: 0.35, ask: 0.45, vol: 340, oi: 780 }
              ].map((option) => (
                <div
                  key={option.strike}
                  className={`grid grid-cols-5 gap-2 text-sm py-2 px-2 rounded cursor-pointer transition-colors ${
                    option.atm
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className="font-medium">{option.strike}</span>
                  <span className="text-green-600">{option.bid}</span>
                  <span className="text-red-600">{option.ask}</span>
                  <span>{option.vol}</span>
                  <span>{option.oi}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Puts */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 text-center">
              Puts
            </h3>
            
            <div className="space-y-2">
              <div className="grid grid-cols-5 gap-2 text-xs font-medium text-gray-600 dark:text-gray-400 pb-2 border-b border-gray-200 dark:border-gray-600">
                <span>Strike</span>
                <span>Bid</span>
                <span>Ask</span>
                <span>Vol</span>
                <span>OI</span>
              </div>

              {[
                { strike: 180, bid: 0.25, ask: 0.35, vol: 450, oi: 890 },
                { strike: 185, bid: 1.20, ask: 1.40, vol: 1800, oi: 3240, atm: true },
                { strike: 190, bid: 3.60, ask: 3.80, vol: 1100, oi: 2100 },
                { strike: 195, bid: 7.10, ask: 7.30, vol: 680, oi: 1450 }
              ].map((option) => (
                <div
                  key={option.strike}
                  className={`grid grid-cols-5 gap-2 text-sm py-2 px-2 rounded cursor-pointer transition-colors ${
                    option.atm
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className="font-medium">{option.strike}</span>
                  <span className="text-green-600">{option.bid}</span>
                  <span className="text-red-600">{option.ask}</span>
                  <span>{option.vol}</span>
                  <span>{option.oi}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Order Panel */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Place Options Order
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Symbol
                </label>
                <input
                  type="text"
                  defaultValue="AAPL"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Expiration
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                  <option>Dec 15, 2023</option>
                  <option>Dec 22, 2023</option>
                  <option>Jan 19, 2024</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Strike Price
                </label>
                <input
                  type="number"
                  defaultValue="185"
                  step="5"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Option Type
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                  <option>Call</option>
                  <option>Put</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Order Type
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                  <option>Market</option>
                  <option>Limit</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Limit Price
              </label>
              <input
                type="number"
                step="0.05"
                placeholder="4.00"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
                Buy to Open
              </button>
              <button className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
                Sell to Open
              </button>
            </div>
          </div>

          {/* Greeks and Analysis */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
              Option Greeks
            </h4>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Delta</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">0.65</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Gamma</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">0.023</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Theta</span>
                <span className="text-sm font-medium text-red-600">-0.12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Vega</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">0.18</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Rho</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">0.08</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Profit/Loss Estimate
              </h5>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Max Profit</span>
                  <span className="text-green-600 font-medium">Unlimited</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Max Loss</span>
                  <span className="text-red-600 font-medium">$400</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Breakeven</span>
                  <span className="text-gray-900 dark:text-white font-medium">$189.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Open Positions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Open Options Positions
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-4">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">AAPL Dec15 185C</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">2 Contracts • Long</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-green-600">+$320</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">+40.0%</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-4">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">TSLA Dec22 250P</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">1 Contract • Long</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-red-600">-$150</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">-25.0%</p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Total Options P&L</span>
            <span className="font-medium text-green-600">+$170</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptionsTrading;