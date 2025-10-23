'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Shield, 
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle,
  Circle
} from 'lucide-react';

interface TradingChartProps {
  symbol: string;
}

interface TradingSignal {
  id: string;
  type: 'BUY' | 'SELL';
  price: number;
  stopLoss: number;
  takeProfit: number;
  confidence: number;
  timestamp: Date;
  status: 'active' | 'filled' | 'cancelled';
}

interface ChartData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export default function TradingChart({ symbol }: TradingChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [currentPrice, setCurrentPrice] = useState(175.43);
  const [isLoading, setIsLoading] = useState(true);

  // GainzAlgo Features Status
  const [gainzAlgoStatus, setGainzAlgoStatus] = useState({
    multiMarketSupport: true,
    highWinRate: 78.5,
    realTimeAlerts: true,
    noRepainting: true,
    stopLossTakeProfit: true,
    profitFactor: 1.73,
    lowDrawdown: 3.2,
    continuousSignals: true,
    riskManagement: true,
    performanceOptimization: true
  });

  // Generate mock chart data
  useEffect(() => {
    const generateChartData = () => {
      const data: ChartData[] = [];
      let price = 170 + Math.random() * 10;
      
      for (let i = 0; i < 100; i++) {
        const time = new Date(Date.now() - (100 - i) * 60000).toISOString();
        const open = price;
        const change = (Math.random() - 0.5) * 4;
        const close = open + change;
        const high = Math.max(open, close) + Math.random() * 2;
        const low = Math.min(open, close) - Math.random() * 2;
        const volume = Math.floor(Math.random() * 1000000) + 500000;
        
        data.push({ time, open, high, low, close, volume });
        price = close;
      }
      
      setChartData(data);
      setCurrentPrice(data[data.length - 1].close);
      setIsLoading(false);
    };

    generateChartData();

    // Generate trading signals
    const generateSignals = () => {
      const newSignals: TradingSignal[] = [
        {
          id: '1',
          type: 'BUY',
          price: 174.20,
          stopLoss: 172.50,
          takeProfit: 178.90,
          confidence: 95,
          timestamp: new Date(Date.now() - 300000),
          status: 'active'
        },
        {
          id: '2',
          type: 'SELL',
          price: 176.80,
          stopLoss: 178.20,
          takeProfit: 173.40,
          confidence: 87,
          timestamp: new Date(Date.now() - 600000),
          status: 'filled'
        }
      ];
      setSignals(newSignals);
    };

    generateSignals();

    // Update price every 2 seconds
    const priceInterval = setInterval(() => {
      setCurrentPrice(prev => prev + (Math.random() - 0.5) * 0.5);
    }, 2000);

    return () => clearInterval(priceInterval);
  }, [symbol]);

  // Render candlestick chart (simplified SVG version)
  const renderChart = () => {
    if (chartData.length === 0) return null;

    const width = 800;
    const height = 400;
    const padding = 40;
    
    const prices = chartData.map(d => [d.high, d.low, d.open, d.close]).flat();
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;
    
    const xScale = (index: number) => padding + (index * (width - 2 * padding)) / chartData.length;
    const yScale = (price: number) => height - padding - ((price - minPrice) / priceRange) * (height - 2 * padding);

    return (
      <svg width={width} height={height} className="w-full h-full">
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#374151" strokeWidth="0.5" opacity="0.3"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Price levels */}
        {[0.25, 0.5, 0.75].map((ratio, i) => {
          const y = padding + ratio * (height - 2 * padding);
          const price = maxPrice - ratio * priceRange;
          return (
            <g key={i}>
              <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#4B5563" strokeWidth="0.5" />
              <text x={width - padding + 5} y={y + 4} fill="#9CA3AF" fontSize="12">
                ${price.toFixed(2)}
              </text>
            </g>
          );
        })}
        
        {/* Candlesticks */}
        {chartData.map((candle, index) => {
          const x = xScale(index);
          const openY = yScale(candle.open);
          const closeY = yScale(candle.close);
          const highY = yScale(candle.high);
          const lowY = yScale(candle.low);
          const isGreen = candle.close > candle.open;
          const color = isGreen ? '#10B981' : '#EF4444';
          const candleWidth = 6;
          
          return (
            <g key={index}>
              {/* Wick */}
              <line x1={x} y1={highY} x2={x} y2={lowY} stroke={color} strokeWidth="1" />
              {/* Body */}
              <rect
                x={x - candleWidth / 2}
                y={Math.min(openY, closeY)}
                width={candleWidth}
                height={Math.abs(closeY - openY) || 1}
                fill={color}
                opacity={isGreen ? 0.8 : 1}
              />
            </g>
          );
        })}
        
        {/* Trading signals */}
        {signals.map((signal) => {
          const signalIndex = Math.floor(Math.random() * chartData.length * 0.8) + 10;
          const x = xScale(signalIndex);
          const y = yScale(signal.price);
          const color = signal.type === 'BUY' ? '#10B981' : '#EF4444';
          
          return (
            <g key={signal.id}>
              {/* Signal marker */}
              <circle cx={x} cy={y} r="8" fill={color} opacity="0.9" />
              <text x={x} y={y + 4} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
                {signal.type === 'BUY' ? '↑' : '↓'}
              </text>
              
              {/* Stop Loss line */}
              <line 
                x1={x - 20} 
                y1={yScale(signal.stopLoss)} 
                x2={x + 20} 
                y2={yScale(signal.stopLoss)} 
                stroke="#EF4444" 
                strokeWidth="2" 
                strokeDasharray="5,5" 
                opacity="0.7"
              />
              
              {/* Take Profit line */}
              <line 
                x1={x - 20} 
                y1={yScale(signal.takeProfit)} 
                x2={x + 20} 
                y2={yScale(signal.takeProfit)} 
                stroke="#10B981" 
                strokeWidth="2" 
                strokeDasharray="5,5" 
                opacity="0.7"
              />
            </g>
          );
        })}
        
        {/* Current price line */}
        <line 
          x1={padding} 
          y1={yScale(currentPrice)} 
          x2={width - padding} 
          y2={yScale(currentPrice)} 
          stroke="#3B82F6" 
          strokeWidth="2" 
          strokeDasharray="3,3"
        />
        <text 
          x={width - padding + 5} 
          y={yScale(currentPrice) + 4} 
          fill="#3B82F6" 
          fontSize="12" 
          fontWeight="bold"
        >
          ${currentPrice.toFixed(2)}
        </text>
      </svg>
    );
  };

  if (isLoading) {
    return (
      <Card className="h-full bg-slate-800/50 border-slate-700">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <Activity className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-400" />
            <p className="text-slate-400">Loading chart data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="h-full space-y-4">
      {/* GainzAlgo Status Bar */}
      <Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-500/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Zap className="w-5 h-5 mr-2 text-purple-400" />
            GainzAlgo V2 - Multi-Market Trading Engine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <CheckCircle className="w-4 h-4 text-green-400 mr-1" />
                <span className="text-sm font-medium">Multi-Market</span>
              </div>
              <Badge variant="outline" className="border-green-500 text-green-400">
                All Markets
              </Badge>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Target className="w-4 h-4 text-blue-400 mr-1" />
                <span className="text-sm font-medium">Win Rate</span>
              </div>
              <Badge variant="outline" className="border-blue-500 text-blue-400">
                {gainzAlgoStatus.highWinRate}%
              </Badge>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Shield className="w-4 h-4 text-purple-400 mr-1" />
                <span className="text-sm font-medium">Profit Factor</span>
              </div>
              <Badge variant="outline" className="border-purple-500 text-purple-400">
                {gainzAlgoStatus.profitFactor}
              </Badge>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <AlertTriangle className="w-4 h-4 text-yellow-400 mr-1" />
                <span className="text-sm font-medium">Drawdown</span>
              </div>
              <Badge variant="outline" className="border-yellow-500 text-yellow-400">
                {gainzAlgoStatus.lowDrawdown}%
              </Badge>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Activity className="w-4 h-4 text-green-400 mr-1" />
                <span className="text-sm font-medium">Real-time</span>
              </div>
              <Badge variant="outline" className="border-green-500 text-green-400">
                No Lag
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Chart */}
      <Card className="flex-1 bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-400" />
              {symbol} - Advanced Chart Analysis
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="border-green-500 text-green-400">
                <Circle className="w-2 h-2 mr-1 fill-current" />
                Live Data
              </Badge>
              <Badge variant="outline" className="border-blue-500 text-blue-400">
                All Timeframes
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="h-96">
          <div ref={chartRef} className="w-full h-full bg-slate-900/50 rounded-lg overflow-hidden">
            {renderChart()}
          </div>
        </CardContent>
      </Card>

      {/* Active Signals */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Target className="w-5 h-5 mr-2 text-green-400" />
            Active Trading Signals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {signals.map((signal) => (
              <div 
                key={signal.id}
                className={`p-3 rounded-lg border ${
                  signal.type === 'BUY' 
                    ? 'bg-green-900/20 border-green-500/30' 
                    : 'bg-red-900/20 border-red-500/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant="outline" 
                      className={signal.type === 'BUY' ? 'border-green-500 text-green-400' : 'border-red-500 text-red-400'}
                    >
                      {signal.type === 'BUY' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                      {signal.type}
                    </Badge>
                    <span className="font-semibold">${signal.price.toFixed(2)}</span>
                  </div>
                  <Badge variant="outline" className="border-purple-500 text-purple-400">
                    {signal.confidence}% Confidence
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Stop Loss:</span>
                    <div className="font-semibold text-red-400">${signal.stopLoss.toFixed(2)}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Take Profit:</span>
                    <div className="font-semibold text-green-400">${signal.takeProfit.toFixed(2)}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Status:</span>
                    <div className={`font-semibold capitalize ${
                      signal.status === 'active' ? 'text-blue-400' :
                      signal.status === 'filled' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {signal.status}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}