'use client';

import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface BenchmarkComparison {
  symbol: string;
  name: string;
  returns: number;
  difference: number;
  outperformance: boolean;
}

interface ComparativeData {
  performance: {
    totalInvested: number;
    totalValue: number;
    returns: number;
    profitDollar: number;
  };
  comparison: {
    userReturns: number;
    userProfitDollar: number;
    userProfitPercent: number;
    benchmarks: BenchmarkComparison[];
    timeframe: {
      startDate: string;
      endDate: string;
      days: number;
    };
    summary: {
      bestBenchmark: string;
      worstBenchmark: string;
      averageBenchmarkReturn: number;
      userVsAverageOutperformance: number;
    };
  };
  riskMetrics: {
    sharpeRatio: number;
    interpretation: string;
  };
}

interface Props {
  className?: string;
}

export function ComparativeProfitAnalysis({ className = '' }: Props) {
  const [data, setData] = useState<ComparativeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<'monthly' | 'yearly'>('monthly');
  const [requiresUpgrade, setRequiresUpgrade] = useState(false);

  useEffect(() => {
    fetchComparativeData();
  }, [timeframe]);

  const fetchComparativeData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Authentication required');
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comparative-profit/dashboard`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.status === 403) {
        setRequiresUpgrade(true);
        const upgradeData = await response.json();
        setError(upgradeData.error || 'This feature requires a Pro or Elite subscription');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch comparative data');
      }

      const result = await response.json();
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`bg-gray-900 rounded-xl border border-gray-800 p-8 ${className}`}>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-400">Loading comparative analysis...</span>
        </div>
      </div>
    );
  }

  if (requiresUpgrade) {
    return (
      <div className={`bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-xl border border-blue-500/30 p-8 ${className}`}>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4">
            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Upgrade to Pro or Elite</h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h4 className="text-lg font-semibold text-white mb-2">Pro Plan</h4>
              <div className="text-3xl font-bold text-blue-400 mb-4">$99<span className="text-sm text-gray-400">/mo</span></div>
              <ul className="text-left text-sm text-gray-300 space-y-2 mb-4">
                <li className="flex items-center"><span className="mr-2">✓</span> Comparative Profit Analysis</li>
                <li className="flex items-center"><span className="mr-2">✓</span> 95% Profit Bot</li>
                <li className="flex items-center"><span className="mr-2">✓</span> Advanced Analytics</li>
                <li className="flex items-center"><span className="mr-2">✓</span> Priority Support</li>
              </ul>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition">
                Upgrade to Pro
              </button>
            </div>
            <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-lg p-6 border border-purple-500/50">
              <div className="inline-block bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded mb-2">BEST VALUE</div>
              <h4 className="text-lg font-semibold text-white mb-2">Elite Plan</h4>
              <div className="text-3xl font-bold text-purple-400 mb-4">$299<span className="text-sm text-gray-400">/mo</span></div>
              <ul className="text-left text-sm text-gray-300 space-y-2 mb-4">
                <li className="flex items-center"><span className="mr-2">✓</span> Everything in Pro</li>
                <li className="flex items-center"><span className="mr-2">✓</span> Custom AI Strategies</li>
                <li className="flex items-center"><span className="mr-2">✓</span> API Access</li>
                <li className="flex items-center"><span className="mr-2">✓</span> Dedicated Manager</li>
              </ul>
              <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition">
                Upgrade to Elite
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={`bg-red-900/20 rounded-xl border border-red-500/30 p-8 ${className}`}>
        <div className="text-center text-red-400">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>{error || 'Failed to load data'}</p>
          <button
            onClick={fetchComparativeData}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { performance, comparison, riskMetrics } = data;

  // Prepare chart data
  const chartData = {
    labels: comparison.benchmarks.map(b => b.symbol),
    datasets: [
      {
        label: 'Your Returns',
        data: comparison.benchmarks.map(() => comparison.userReturns),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
      },
      {
        label: 'Benchmark Returns',
        data: comparison.benchmarks.map(b => b.returns),
        borderColor: 'rgb(156, 163, 175)',
        backgroundColor: 'rgba(156, 163, 175, 0.1)',
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: 'rgb(156, 163, 175)',
        },
      },
      tooltip: {
        backgroundColor: 'rgb(17, 24, 39)',
        titleColor: 'white',
        bodyColor: 'rgb(156, 163, 175)',
        borderColor: 'rgb(75, 85, 99)',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        ticks: {
          color: 'rgb(156, 163, 175)',
          callback: (value: any) => `${value}%`,
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.2)',
        },
      },
      x: {
        ticks: {
          color: 'rgb(156, 163, 175)',
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.2)',
        },
      },
    },
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Comparative Profit Analysis</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setTimeframe('monthly')}
              className={`px-4 py-2 rounded-lg transition ${
                timeframe === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setTimeframe('yearly')}
              className={`px-4 py-2 rounded-lg transition ${
                timeframe === 'yearly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* Performance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">Total Invested</div>
            <div className="text-2xl font-bold text-white">
              ${performance.totalInvested.toLocaleString()}
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">Current Value</div>
            <div className="text-2xl font-bold text-white">
              ${performance.totalValue.toLocaleString()}
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">Total Profit</div>
            <div className={`text-2xl font-bold ${performance.profitDollar >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {performance.profitDollar >= 0 ? '+' : ''}${performance.profitDollar.toLocaleString()}
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">Returns</div>
            <div className={`text-2xl font-bold ${performance.returns >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {performance.returns >= 0 ? '+' : ''}{performance.returns.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Returns Comparison</h3>
        <div className="h-64">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Benchmarks Grid */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Benchmark Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {comparison.benchmarks.map((benchmark) => (
            <div
              key={benchmark.symbol}
              className={`bg-gray-800/50 rounded-lg p-4 border ${
                benchmark.outperformance ? 'border-green-500/30' : 'border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-semibold text-white">{benchmark.symbol}</div>
                  <div className="text-sm text-gray-400">{benchmark.name}</div>
                </div>
                {benchmark.outperformance && (
                  <div className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">
                    BEAT
                  </div>
                )}
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-sm text-gray-400">Returns</div>
                  <div className="text-xl font-bold text-white">{benchmark.returns}%</div>
                </div>
                <div className={`text-right ${benchmark.difference >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  <div className="text-sm">Difference</div>
                  <div className="text-lg font-semibold">
                    {benchmark.difference >= 0 ? '+' : ''}{benchmark.difference}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Metrics & Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Risk Metrics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Sharpe Ratio</span>
                <span className="text-xl font-bold text-white">{riskMetrics.sharpeRatio.toFixed(2)}</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    riskMetrics.sharpeRatio > 1
                      ? 'bg-green-500'
                      : riskMetrics.sharpeRatio > 0.5
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(riskMetrics.sharpeRatio * 50, 100)}%` }}
                />
              </div>
              <div className="mt-1 text-sm text-gray-400">{riskMetrics.interpretation}</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Best Benchmark:</span>
              <span className="text-white font-semibold">{comparison.summary.bestBenchmark}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Avg. Benchmark Return:</span>
              <span className="text-white font-semibold">{comparison.summary.averageBenchmarkReturn.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Your vs. Average:</span>
              <span className={`font-semibold ${comparison.summary.userVsAverageOutperformance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {comparison.summary.userVsAverageOutperformance >= 0 ? '+' : ''}
                {comparison.summary.userVsAverageOutperformance.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Timeframe:</span>
              <span className="text-white font-semibold">{comparison.timeframe.days} days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
