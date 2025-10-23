'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Bot, 
  Play, 
  Pause, 
  Settings, 
  Activity, 
  Clock, 
  Target, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  Zap,
  RefreshCw,
  Shield,
  DollarSign,
  Brain,
  Users,
  Globe,
  Gauge
} from 'lucide-react';
import pageAutomationService, { PageAutomation, AutomationExecution } from '@/services/pageAutomationService';

interface TradingAutomationProps {
  pageType: 'trading' | 'trading-platform';
  onAutomationChange?: (isActive: boolean) => void;
  onTradeExecuted?: (trade: any) => void;
}

interface AutoTradingConfig {
  enabled: boolean;
  maxDailyTrades: number;
  maxPositionSize: number;
  stopLossPercent: number;
  takeProfitPercent: number;
  riskPerTrade: number;
  allowedSymbols: string[];
  tradingHours: {
    start: string;
    end: string;
  };
}

interface TradingSignal {
  id: string;
  symbol: string;
  action: 'buy' | 'sell';
  confidence: number;
  price: number;
  timestamp: Date;
  reason: string;
  status: 'pending' | 'executed' | 'cancelled';
}

export default function TradingAutomation({ 
  pageType, 
  onAutomationChange, 
  onTradeExecuted 
}: TradingAutomationProps) {
  const [automations, setAutomations] = useState<PageAutomation[]>([]);
  const [executions, setExecutions] = useState<AutomationExecution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [autoTradingConfig, setAutoTradingConfig] = useState<AutoTradingConfig>({
    enabled: false,
    maxDailyTrades: 10,
    maxPositionSize: 1000,
    stopLossPercent: 2,
    takeProfitPercent: 5,
    riskPerTrade: 1,
    allowedSymbols: ['BTCUSD', 'ETHUSD', 'AAPL', 'TSLA'],
    tradingHours: {
      start: '09:30',
      end: '16:00'
    }
  });
  const [tradingSignals, setTradingSignals] = useState<TradingSignal[]>([]);
  const [activeStrategies, setActiveStrategies] = useState<string[]>([]);

  // Trading-specific automation configurations
  const tradingAutomations = [
    {
      id: 'auto-trading',
      name: 'Automated Trading',
      description: 'Execute trades automatically based on AI signals',
      category: 'trading',
      isActive: false,
      triggers: ['signal_generated', 'market_condition'],
      actions: ['execute_trade', 'update_position']
    },
    {
      id: 'risk-management',
      name: 'Risk Management',
      description: 'Automatically manage stop-loss and take-profit orders',
      category: 'risk',
      isActive: true,
      triggers: ['position_opened', 'price_change'],
      actions: ['set_stop_loss', 'set_take_profit', 'adjust_position']
    },
    {
      id: 'market-scanner',
      name: 'Market Scanner',
      description: 'Continuously scan markets for trading opportunities',
      category: 'analysis',
      isActive: true,
      triggers: ['time_based', 'market_open'],
      actions: ['scan_markets', 'generate_signals', 'send_alerts']
    },
    {
      id: 'portfolio-rebalancing',
      name: 'Portfolio Rebalancing',
      description: 'Automatically rebalance portfolio based on targets',
      category: 'portfolio',
      isActive: false,
      triggers: ['time_based', 'allocation_drift'],
      actions: ['calculate_rebalance', 'execute_rebalance']
    },
    {
      id: 'copy-trading',
      name: 'Copy Trading',
      description: 'Automatically copy trades from selected traders',
      category: 'social',
      isActive: false,
      triggers: ['trader_action', 'signal_received'],
      actions: ['copy_trade', 'adjust_size', 'apply_filters']
    }
  ];

  useEffect(() => {
    initializeAutomations();
    setupEventListeners();
    generateMockSignals();
    
    return () => {
      pageAutomationService.removeAllListeners();
    };
  }, []);

  const initializeAutomations = async () => {
    try {
      const pageRoute = pageType === 'trading' ? '/trading' : '/trading-platform';
      const existingAutomations = pageAutomationService.getAutomationsForPage(pageRoute);
      setAutomations(existingAutomations);
      
      const recentExecutions = pageAutomationService.getExecutions()
        .filter(e => e.pageRoute === pageRoute)
        .slice(0, 10);
      setExecutions(recentExecutions);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to initialize trading automations:', error);
      setIsLoading(false);
    }
  };

  const setupEventListeners = () => {
    pageAutomationService.on('automation:created', handleAutomationUpdate);
    pageAutomationService.on('automation:updated', handleAutomationUpdate);
    pageAutomationService.on('execution:completed', handleExecutionUpdate);
    pageAutomationService.on('execution:failed', handleExecutionUpdate);
  };

  const handleAutomationUpdate = () => {
    const pageRoute = pageType === 'trading' ? '/trading' : '/trading-platform';
    const updatedAutomations = pageAutomationService.getAutomationsForPage(pageRoute);
    setAutomations(updatedAutomations);
  };

  const handleExecutionUpdate = (execution: AutomationExecution) => {
    const pageRoute = pageType === 'trading' ? '/trading' : '/trading-platform';
    if (execution.pageRoute === pageRoute) {
      setExecutions(prev => [execution, ...prev.slice(0, 9)]);
    }
  };

  const generateMockSignals = () => {
    const symbols = ['BTCUSD', 'ETHUSD', 'AAPL', 'TSLA', 'GOOGL'];
    const signals: TradingSignal[] = symbols.map((symbol, index) => ({
      id: `signal-${index}`,
      symbol,
      action: Math.random() > 0.5 ? 'buy' : 'sell',
      confidence: Math.floor(Math.random() * 40) + 60, // 60-100%
      price: Math.random() * 1000 + 100,
      timestamp: new Date(Date.now() - Math.random() * 3600000), // Last hour
      reason: 'Technical analysis breakout detected',
      status: 'pending'
    }));
    setTradingSignals(signals);
  };

  const toggleAutomation = async (automationId: string, isActive: boolean) => {
    try {
      pageAutomationService.updateAutomation(automationId, { isActive });
      
      if (onAutomationChange) {
        const activeCount = automations.filter(a => a.isActive).length;
        onAutomationChange(activeCount > 0);
      }
    } catch (error) {
      console.error('Failed to toggle automation:', error);
    }
  };

  const executeSignal = async (signal: TradingSignal) => {
    try {
      // Simulate trade execution
      const trade = {
        id: `trade-${Date.now()}`,
        symbol: signal.symbol,
        action: signal.action,
        price: signal.price,
        quantity: Math.floor(autoTradingConfig.maxPositionSize / signal.price),
        timestamp: new Date(),
        status: 'executed'
      };

      // Update signal status
      setTradingSignals(prev => 
        prev.map(s => s.id === signal.id ? { ...s, status: 'executed' } : s)
      );

      if (onTradeExecuted) {
        onTradeExecuted(trade);
      }

      // Create automation execution record
      await pageAutomationService.executeAutomation('auto-trading', {
        source: 'signal',
        timestamp: new Date(),
        data: { signal, trade }
      });

    } catch (error) {
      console.error('Failed to execute signal:', error);
    }
  };

  const updateAutoTradingConfig = (updates: Partial<AutoTradingConfig>) => {
    setAutoTradingConfig(prev => ({ ...prev, ...updates }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'trading':
        return <Bot className="h-4 w-4" />;
      case 'risk':
        return <Shield className="h-4 w-4" />;
      case 'analysis':
        return <BarChart3 className="h-4 w-4" />;
      case 'portfolio':
        return <Target className="h-4 w-4" />;
      case 'social':
        return <Users className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading trading automations...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Trading Automation
            </CardTitle>
            <CardDescription>
              Automate your trading strategies with intelligent workflows
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={autoTradingConfig.enabled ? 'default' : 'secondary'}>
              {autoTradingConfig.enabled ? 'Auto Trading ON' : 'Manual Mode'}
            </Badge>
            <Switch
              checked={autoTradingConfig.enabled}
              onCheckedChange={(checked) => updateAutoTradingConfig({ enabled: checked })}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value="automations" onValueChange={() => {}} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="automations">Automations</TabsTrigger>
            <TabsTrigger value="signals">Signals</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="automations" className="space-y-4">
            <div className="grid gap-4">
              {automations.map((automation) => (
                <Card key={automation.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getCategoryIcon('trading')}
                        <div>
                          <h4 className="font-medium">{automation.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {automation.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={automation.isActive ? 'default' : 'secondary'}>
                          {automation.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Switch
                          checked={automation.isActive}
                          onCheckedChange={(checked) => toggleAutomation(automation.id, checked)}
                        />
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Executions: {automation.executionCount}</span>
                      <span>Success Rate: {automation.successRate.toFixed(1)}%</span>
                      {automation.lastExecuted && (
                        <span>Last: {automation.lastExecuted.toLocaleTimeString()}</span>
                      )}
                    </div>
                    
                    {automation.isActive && (
                      <Progress 
                        value={automation.successRate} 
                        className="mt-2 h-2"
                      />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="signals" className="space-y-4">
            <div className="space-y-2">
              {tradingSignals.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Brain className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">No trading signals available</p>
                  </CardContent>
                </Card>
              ) : (
                tradingSignals.map((signal) => (
                  <Card key={signal.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            signal.action === 'buy' ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                          <div>
                            <h4 className="font-medium">{signal.symbol}</h4>
                            <p className="text-sm text-muted-foreground">
                              {signal.action.toUpperCase()} at ${signal.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={signal.confidence > 80 ? 'default' : 'secondary'}>
                            {signal.confidence}% confidence
                          </Badge>
                          <Badge variant={
                            signal.status === 'executed' ? 'default' : 
                            signal.status === 'cancelled' ? 'destructive' : 'secondary'
                          }>
                            {signal.status}
                          </Badge>
                          {signal.status === 'pending' && autoTradingConfig.enabled && (
                            <Button
                              size="sm"
                              onClick={() => executeSignal(signal)}
                            >
                              <Play className="h-4 w-4 mr-1" />
                              Execute
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-2 text-sm text-muted-foreground">
                        <p>{signal.reason}</p>
                        <p>Generated: {signal.timestamp.toLocaleTimeString()}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="config" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Auto Trading Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="maxTrades">Max Daily Trades</Label>
                    <Input
                      id="maxTrades"
                      type="number"
                      value={autoTradingConfig.maxDailyTrades}
                      onChange={(e) => updateAutoTradingConfig({ 
                        maxDailyTrades: parseInt(e.target.value) 
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxPosition">Max Position Size ($)</Label>
                    <Input
                      id="maxPosition"
                      type="number"
                      value={autoTradingConfig.maxPositionSize}
                      onChange={(e) => updateAutoTradingConfig({ 
                        maxPositionSize: parseInt(e.target.value) 
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="stopLoss">Stop Loss (%)</Label>
                    <Input
                      id="stopLoss"
                      type="number"
                      step="0.1"
                      value={autoTradingConfig.stopLossPercent}
                      onChange={(e) => updateAutoTradingConfig({ 
                        stopLossPercent: parseFloat(e.target.value) 
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="takeProfit">Take Profit (%)</Label>
                    <Input
                      id="takeProfit"
                      type="number"
                      step="0.1"
                      value={autoTradingConfig.takeProfitPercent}
                      onChange={(e) => updateAutoTradingConfig({ 
                        takeProfitPercent: parseFloat(e.target.value) 
                      })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Trading Hours</Label>
                  <div className="flex gap-2">
                    <Input
                      type="time"
                      value={autoTradingConfig.tradingHours.start}
                      onChange={(e) => updateAutoTradingConfig({
                        tradingHours: { 
                          ...autoTradingConfig.tradingHours, 
                          start: e.target.value 
                        }
                      })}
                    />
                    <Input
                      type="time"
                      value={autoTradingConfig.tradingHours.end}
                      onChange={(e) => updateAutoTradingConfig({
                        tradingHours: { 
                          ...autoTradingConfig.tradingHours, 
                          end: e.target.value 
                        }
                      })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <div className="space-y-2">
              {executions.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Activity className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">No recent automation activity</p>
                  </CardContent>
                </Card>
              ) : (
                executions.map((execution) => (
                  <Card key={execution.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(execution.status)}
                          <div>
                            <h4 className="font-medium">
                              {automations.find(a => a.id === execution.automationId)?.name || 'Unknown'}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Triggered by {execution.triggeredBy} • {execution.startTime.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={execution.status === 'completed' ? 'default' : 'destructive'}>
                            {execution.status}
                          </Badge>
                          {execution.duration && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {execution.duration}ms
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}