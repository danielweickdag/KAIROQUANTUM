'use client';

import React, { useState } from 'react';
import { Target, DollarSign, Percent, TrendingUp, Save, BarChart3, AlertCircle } from 'lucide-react';

const ProfitTargetSettings = () => {
  const [targetType, setTargetType] = useState('percentage');
  const [riskRewardRatio, setRiskRewardRatio] = useState('2:1');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Profit Target Settings
          </h2>
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-green-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Risk Management</span>
          </div>
        </div>

        {/* Current Portfolio Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Portfolio Value</span>
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">$125,450</p>
            <p className="text-sm text-green-600">+$2,340 today</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Daily P&L</span>
            </div>
            <p className="text-lg font-semibold text-green-600">+$1,890</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">+1.51%</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Target Hit Rate</span>
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">68%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Last 30 days</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <BarChart3 className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Avg. R:R Ratio</span>
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">2.3:1</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Risk:Reward</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profit Target Configuration */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Profit Target Configuration
          </h3>
          
          <div className="space-y-4">
            {/* Target Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Target Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'percentage', label: 'Percentage', icon: Percent },
                  { id: 'dollar', label: 'Dollar Amount', icon: DollarSign },
                  { id: 'ratio', label: 'Risk:Reward', icon: Target }
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setTargetType(type.id)}
                    className={`flex items-center justify-center space-x-2 p-3 rounded-lg border transition-colors ${
                      targetType === type.id
                        ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300'
                        : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <type.icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Target Value Input */}
            {targetType === 'percentage' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Profit Target (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  defaultValue="2.5"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Target: $3,136 profit (2.5% of portfolio)
                </p>
              </div>
            )}

            {targetType === 'dollar' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Profit Target ($)
                </label>
                <input
                  type="number"
                  step="10"
                  defaultValue="3000"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Target: 2.39% of portfolio value
                </p>
              </div>
            )}

            {targetType === 'ratio' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Risk:Reward Ratio
                </label>
                <select 
                  value={riskRewardRatio}
                  onChange={(e) => setRiskRewardRatio(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="1:1">1:1 (Conservative)</option>
                  <option value="1.5:1">1.5:1 (Moderate)</option>
                  <option value="2:1">2:1 (Balanced)</option>
                  <option value="3:1">3:1 (Aggressive)</option>
                  <option value="4:1">4:1 (Very Aggressive)</option>
                </select>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  For every $1 risked, target $2 profit
                </p>
              </div>
            )}

            {/* Stop Loss Configuration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Stop Loss (%)
              </label>
              <input
                type="number"
                step="0.1"
                defaultValue="1.0"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Maximum loss: $1,255 (1.0% of portfolio)
              </p>
            </div>

            {/* Auto-close Options */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="auto-close-profit"
                  defaultChecked
                  className="rounded border-gray-300 dark:border-gray-600"
                />
                <label htmlFor="auto-close-profit" className="text-sm text-gray-700 dark:text-gray-300">
                  Auto-close positions at profit target
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="auto-close-loss"
                  defaultChecked
                  className="rounded border-gray-300 dark:border-gray-600"
                />
                <label htmlFor="auto-close-loss" className="text-sm text-gray-700 dark:text-gray-300">
                  Auto-close positions at stop loss
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="trailing-stop"
                  className="rounded border-gray-300 dark:border-gray-600"
                />
                <label htmlFor="trailing-stop" className="text-sm text-gray-700 dark:text-gray-300">
                  Enable trailing stop loss
                </label>
              </div>
            </div>

            <button className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
              <Save className="h-4 w-4" />
              <span>Save Settings</span>
            </button>
          </div>
        </div>

        {/* Performance Analytics */}
        <div className="space-y-6">
          {/* Target Performance */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Target Performance (Last 30 Days)
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div>
                  <p className="font-medium text-green-900 dark:text-green-100">Targets Hit</p>
                  <p className="text-sm text-green-700 dark:text-green-300">Successfully reached profit target</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-green-600">23</p>
                  <p className="text-sm text-green-600">68% success rate</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div>
                  <p className="font-medium text-red-900 dark:text-red-100">Stop Losses Hit</p>
                  <p className="text-sm text-red-700 dark:text-red-300">Positions closed at stop loss</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-red-600">8</p>
                  <p className="text-sm text-red-600">24% of trades</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Manual Closes</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Manually closed positions</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">3</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">8% of trades</p>
                </div>
              </div>
            </div>
          </div>

          {/* Risk Metrics */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Risk Metrics
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Sharpe Ratio</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">1.85</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Max Drawdown</span>
                <span className="text-sm font-medium text-red-600">-3.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Win Rate</span>
                <span className="text-sm font-medium text-green-600">68%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Avg. Win</span>
                <span className="text-sm font-medium text-green-600">+$420</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Avg. Loss</span>
                <span className="text-sm font-medium text-red-600">-$180</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Profit Factor</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">2.33</span>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              AI Recommendations
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Optimize Risk:Reward Ratio
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    Consider increasing to 2.5:1 based on your 68% win rate
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                    Enable Trailing Stops
                  </p>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                    Could increase profits by 15% based on historical data
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <AlertCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">
                    Strong Performance
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                    Your current settings are performing well
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfitTargetSettings;