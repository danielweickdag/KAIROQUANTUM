'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  Code, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Play, 
  Save, 
  Upload, 
  Download,
  Eye,
  BarChart3,
  TrendingUp,
  Shield,
  Zap,
  FileText,
  Settings,
  RefreshCw,
  Clock,
  Target,
  DollarSign
} from 'lucide-react';

interface AuditResult {
  id: string;
  type: 'ERROR' | 'WARNING' | 'INFO' | 'SUCCESS';
  line?: number;
  message: string;
  suggestion?: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
}

interface BacktestResult {
  totalTrades: number;
  winRate: number;
  profitFactor: number;
  maxDrawdown: number;
  sharpeRatio: number;
  totalReturn: number;
  avgTrade: number;
  bestTrade: number;
  worstTrade: number;
}

interface PerformanceMetric {
  label: string;
  value: string;
  change?: number;
  icon: React.ReactNode;
  color: string;
}

export default function PineScriptAuditor() {
  const [scriptCode, setScriptCode] = useState('');
  const [auditResults, setAuditResults] = useState<AuditResult[]>([]);
  const [backtestResults, setBacktestResults] = useState<BacktestResult | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [isBacktesting, setIsBacktesting] = useState(false);
  const [scriptName, setScriptName] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');

  // Sample Pine Script code
  const sampleScript = `//@version=5
strategy("GainzAlgo Enhanced Strategy", overlay=true, default_qty_type=strategy.percent_of_equity, default_qty_value=10)

// Input parameters
length = input.int(14, title="RSI Length", minval=1)
rsi_oversold = input.int(30, title="RSI Oversold Level", minval=1, maxval=50)
rsi_overbought = input.int(70, title="RSI Overbought Level", minval=50, maxval=100)
use_ema = input.bool(true, title="Use EMA Filter")
ema_length = input.int(50, title="EMA Length", minval=1)

// Calculate indicators
rsi = ta.rsi(close, length)
ema = ta.ema(close, ema_length)

// Entry conditions
long_condition = rsi < rsi_oversold and (not use_ema or close > ema)
short_condition = rsi > rsi_overbought and (not use_ema or close < ema)

// Strategy execution
if long_condition
    strategy.entry("Long", strategy.long)
if short_condition
    strategy.entry("Short", strategy.short)

// Plot indicators
plot(rsi, title="RSI", color=color.blue)
hline(rsi_oversold, "Oversold", color=color.green)
hline(rsi_overbought, "Overbought", color=color.red)`;

  useEffect(() => {
    setScriptCode(sampleScript);
    setScriptName('GainzAlgo Enhanced Strategy');
  }, []);

  const performAudit = async () => {
    setIsAuditing(true);
    
    // Simulate audit process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockResults: AuditResult[] = [
      {
        id: '1',
        type: 'SUCCESS',
        message: 'Pine Script syntax is valid',
        severity: 'LOW'
      },
      {
        id: '2',
        type: 'INFO',
        line: 5,
        message: 'Consider adding input validation for RSI levels',
        suggestion: 'Add minval and maxval constraints to prevent invalid RSI thresholds',
        severity: 'LOW'
      },
      {
        id: '3',
        type: 'WARNING',
        line: 18,
        message: 'Missing stop loss and take profit levels',
        suggestion: 'Implement risk management with strategy.exit() for better risk control',
        severity: 'MEDIUM'
      },
      {
        id: '4',
        type: 'SUCCESS',
        message: 'Strategy follows GainzAlgo best practices',
        severity: 'LOW'
      },
      {
        id: '5',
        type: 'INFO',
        message: 'Performance optimization: Consider using ta.change() for efficiency',
        suggestion: 'Replace manual calculations with built-in Pine Script functions',
        severity: 'LOW'
      }
    ];
    
    setAuditResults(mockResults);
    setIsAuditing(false);
  };

  const runBacktest = async () => {
    setIsBacktesting(true);
    
    // Simulate backtest process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockBacktest: BacktestResult = {
      totalTrades: 247,
      winRate: 68.4,
      profitFactor: 1.85,
      maxDrawdown: -12.3,
      sharpeRatio: 1.42,
      totalReturn: 156.7,
      avgTrade: 2.1,
      bestTrade: 18.5,
      worstTrade: -8.2
    };
    
    setBacktestResults(mockBacktest);
    setIsBacktesting(false);
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'ERROR': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'WARNING': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'INFO': return <Eye className="w-4 h-4 text-blue-400" />;
      default: return <Eye className="w-4 h-4 text-gray-400" />;
    }
  };

  const getResultColor = (type: string) => {
    switch (type) {
      case 'SUCCESS': return 'border-green-500 bg-green-500/10';
      case 'ERROR': return 'border-red-500 bg-red-500/10';
      case 'WARNING': return 'border-yellow-500 bg-yellow-500/10';
      case 'INFO': return 'border-blue-500 bg-blue-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  const performanceMetrics: PerformanceMetric[] = backtestResults ? [
    {
      label: 'Total Return',
      value: `${backtestResults.totalReturn.toFixed(1)}%`,
      change: backtestResults.totalReturn,
      icon: <TrendingUp className="w-4 h-4" />,
      color: 'text-green-400'
    },
    {
      label: 'Win Rate',
      value: `${backtestResults.winRate.toFixed(1)}%`,
      change: backtestResults.winRate - 50,
      icon: <Target className="w-4 h-4" />,
      color: 'text-blue-400'
    },
    {
      label: 'Profit Factor',
      value: backtestResults.profitFactor.toFixed(2),
      change: (backtestResults.profitFactor - 1) * 100,
      icon: <DollarSign className="w-4 h-4" />,
      color: 'text-purple-400'
    },
    {
      label: 'Max Drawdown',
      value: `${backtestResults.maxDrawdown.toFixed(1)}%`,
      change: backtestResults.maxDrawdown,
      icon: <BarChart3 className="w-4 h-4" />,
      color: 'text-red-400'
    },
    {
      label: 'Sharpe Ratio',
      value: backtestResults.sharpeRatio.toFixed(2),
      change: (backtestResults.sharpeRatio - 1) * 100,
      icon: <Shield className="w-4 h-4" />,
      color: 'text-yellow-400'
    },
    {
      label: 'Total Trades',
      value: backtestResults.totalTrades.toString(),
      icon: <Clock className="w-4 h-4" />,
      color: 'text-gray-400'
    }
  ] : [];

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/30">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <Code className="w-5 h-5 mr-2 text-purple-400" />
              Pine Script Auditor
            </CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-1" />
                Import
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Input
              placeholder="Strategy name..."
              value={scriptName}
              onChange={(e) => setScriptName(e.target.value)}
              className="bg-slate-700/50 border-slate-600"
            />
            <select 
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-sm"
            >
              <option value="1m">1m</option>
              <option value="5m">5m</option>
              <option value="15m">15m</option>
              <option value="1h">1h</option>
              <option value="4h">4h</option>
              <option value="1D">1D</option>
            </select>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              onClick={performAudit}
              disabled={isAuditing || !scriptCode.trim()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isAuditing ? (
                <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <Shield className="w-4 h-4 mr-1" />
              )}
              {isAuditing ? 'Auditing...' : 'Audit Code'}
            </Button>
            <Button 
              onClick={runBacktest}
              disabled={isBacktesting || !scriptCode.trim()}
              variant="outline"
            >
              {isBacktesting ? (
                <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <Play className="w-4 h-4 mr-1" />
              )}
              {isBacktesting ? 'Running...' : 'Backtest'}
            </Button>
            <Button variant="outline" size="sm">
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value="editor" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800">
          <TabsTrigger value="editor">Code Editor</TabsTrigger>
          <TabsTrigger value="audit">Audit Results</TabsTrigger>
          <TabsTrigger value="backtest">Backtest</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        {/* Code Editor */}
        <TabsContent value="editor" className="mt-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-sm flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Pine Script Editor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={scriptCode}
                onChange={(e) => setScriptCode(e.target.value)}
                placeholder="Enter your Pine Script code here..."
                className="min-h-[400px] font-mono text-sm bg-slate-900/50 border-slate-600"
              />
              <div className="flex justify-between items-center mt-4 text-xs text-slate-400">
                <span>Lines: {scriptCode.split('\n').length}</span>
                <span>Characters: {scriptCode.length}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Results */}
        <TabsContent value="audit" className="mt-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-sm flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Code Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              {auditResults.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Run an audit to see code analysis results</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {auditResults.map((result) => (
                    <div key={result.id} className={`p-3 rounded-lg border ${getResultColor(result.type)}`}>
                      <div className="flex items-start space-x-3">
                        {getResultIcon(result.type)}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-sm">{result.message}</span>
                            {result.line && (
                              <Badge variant="outline" className="text-xs">
                                Line {result.line}
                              </Badge>
                            )}
                            <Badge variant="outline" className={`text-xs ${
                              result.severity === 'HIGH' ? 'border-red-500 text-red-400' :
                              result.severity === 'MEDIUM' ? 'border-yellow-500 text-yellow-400' :
                              'border-green-500 text-green-400'
                            }`}>
                              {result.severity}
                            </Badge>
                          </div>
                          {result.suggestion && (
                            <p className="text-xs text-slate-400 mt-1">{result.suggestion}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backtest Results */}
        <TabsContent value="backtest" className="mt-4">
          <div className="space-y-4">
            {backtestResults ? (
              <>
                {/* Performance Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {performanceMetrics.map((metric, index) => (
                    <Card key={index} className="bg-slate-800/50 border-slate-700">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className={metric.color}>
                            {metric.icon}
                          </div>
                          {metric.change !== undefined && (
                            <div className={`text-xs ${metric.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {metric.change >= 0 ? '+' : ''}{metric.change.toFixed(1)}%
                            </div>
                          )}
                        </div>
                        <div className="text-lg font-bold">{metric.value}</div>
                        <div className="text-xs text-slate-400">{metric.label}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Detailed Results */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-sm">Detailed Backtest Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="flex justify-between py-2 border-b border-slate-700">
                          <span className="text-slate-400">Average Trade:</span>
                          <span className={backtestResults.avgTrade >= 0 ? 'text-green-400' : 'text-red-400'}>
                            {backtestResults.avgTrade >= 0 ? '+' : ''}{backtestResults.avgTrade.toFixed(2)}%
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-700">
                          <span className="text-slate-400">Best Trade:</span>
                          <span className="text-green-400">+{backtestResults.bestTrade.toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-slate-400">Worst Trade:</span>
                          <span className="text-red-400">{backtestResults.worstTrade.toFixed(2)}%</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between py-2 border-b border-slate-700">
                          <span className="text-slate-400">Winning Trades:</span>
                          <span className="text-green-400">
                            {Math.round(backtestResults.totalTrades * backtestResults.winRate / 100)}
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-700">
                          <span className="text-slate-400">Losing Trades:</span>
                          <span className="text-red-400">
                            {backtestResults.totalTrades - Math.round(backtestResults.totalTrades * backtestResults.winRate / 100)}
                          </span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-slate-400">Timeframe:</span>
                          <span>{selectedTimeframe}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-8">
                  <div className="text-center text-slate-400">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Run a backtest to see performance results</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Optimization */}
        <TabsContent value="optimization" className="mt-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-sm flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Strategy Optimization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-slate-400">
                <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Parameter optimization coming soon</p>
                <p className="text-xs mt-2">Automatically find the best parameters for your strategy</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}