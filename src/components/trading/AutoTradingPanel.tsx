'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select } from '@/components/ui/select';
import axios from 'axios';

interface AutoTradingConfig {
  enabled: boolean;
  strategy: string;
  riskLevel: number;
  maxPositionSize: number;
  stopLoss: number;
  takeProfit: number;
  symbols: string[];
}

export function AutoTradingPanel() {
  const [config, setConfig] = useState<AutoTradingConfig>({
    enabled: false,
    strategy: 'momentum',
    riskLevel: 3,
    maxPositionSize: 10000,
    stopLoss: 2,
    takeProfit: 5,
    symbols: ['AAPL', 'MSFT', 'GOOGL']
  });

  const [isActive, setIsActive] = useState(false);
  const [stats, setStats] = useState({
    tradesExecuted: 0,
    profitLoss: 0,
    winRate: 0
  });

  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

  const strategies = [
    { value: 'momentum', label: 'Momentum Trading' },
    { value: 'meanReversion', label: 'Mean Reversion' },
    { value: 'breakout', label: 'Breakout Strategy' },
    { value: 'scalping', label: 'Scalping' },
    { value: 'swing', label: 'Swing Trading' }
  ];

  const handleToggleAutoTrading = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${apiBase}/api/autotrading/${isActive ? 'stop' : 'start'}`,
        config,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIsActive(!isActive);
      console.log('Auto-trading toggled:', response.data);
    } catch (error) {
      console.error('Failed to toggle auto-trading:', error);
    }
  };

  const handleConfigChange = (key: string, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const saveConfiguration = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${apiBase}/api/autotrading/config`,
        config,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Configuration saved successfully!');
    } catch (error) {
      console.error('Failed to save configuration:', error);
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${apiBase}/api/autotrading/stats`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    if (isActive) {
      fetchStats();
      const interval = setInterval(fetchStats, 5000);
      return () => clearInterval(interval);
    }
  }, [isActive, apiBase]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Auto Trading</h2>
            <p className="text-blue-100">Automated algorithmic trading</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-white font-semibold">
              {isActive ? 'Active' : 'Inactive'}
            </span>
            <Switch
              checked={isActive}
              onCheckedChange={handleToggleAutoTrading}
              className="data-[state=checked]:bg-green-500"
            />
          </div>
        </div>
      </Card>

      {/* Stats */}
      {isActive && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="text-sm text-gray-500">Trades Executed</div>
            <div className="text-2xl font-bold">{stats.tradesExecuted}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-500">Profit/Loss</div>
            <div className={`text-2xl font-bold ${stats.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${stats.profitLoss.toFixed(2)}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-500">Win Rate</div>
            <div className="text-2xl font-bold">{stats.winRate.toFixed(1)}%</div>
          </Card>
        </div>
      )}

      {/* Configuration */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Trading Configuration</h3>

        <div className="space-y-6">
          {/* Strategy Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Trading Strategy</label>
            <select
              value={config.strategy}
              onChange={(e) => handleConfigChange('strategy', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {strategies.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Risk Level */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Risk Level: {config.riskLevel}
            </label>
            <Slider
              value={[config.riskLevel]}
              onValueChange={(value) => handleConfigChange('riskLevel', value[0])}
              min={1}
              max={5}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Conservative</span>
              <span>Aggressive</span>
            </div>
          </div>

          {/* Max Position Size */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Max Position Size: ${config.maxPositionSize}
            </label>
            <Slider
              value={[config.maxPositionSize]}
              onValueChange={(value) => handleConfigChange('maxPositionSize', value[0])}
              min={1000}
              max={50000}
              step={1000}
              className="w-full"
            />
          </div>

          {/* Stop Loss */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Stop Loss: {config.stopLoss}%
            </label>
            <Slider
              value={[config.stopLoss]}
              onValueChange={(value) => handleConfigChange('stopLoss', value[0])}
              min={0.5}
              max={10}
              step={0.5}
              className="w-full"
            />
          </div>

          {/* Take Profit */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Take Profit: {config.takeProfit}%
            </label>
            <Slider
              value={[config.takeProfit]}
              onValueChange={(value) => handleConfigChange('takeProfit', value[0])}
              min={1}
              max={20}
              step={0.5}
              className="w-full"
            />
          </div>

          {/* Symbols */}
          <div>
            <label className="block text-sm font-medium mb-2">Symbols to Trade</label>
            <input
              type="text"
              value={config.symbols.join(', ')}
              onChange={(e) => handleConfigChange('symbols', e.target.value.split(',').map(s => s.trim()))}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="AAPL, MSFT, GOOGL"
            />
          </div>

          {/* Save Button */}
          <Button
            onClick={saveConfiguration}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Save Configuration
          </Button>
        </div>
      </Card>

      {/* Risk Warning */}
      <Card className="p-4 bg-yellow-50 border-yellow-200">
        <div className="flex items-start space-x-2">
          <span className="text-yellow-600 text-xl">⚠️</span>
          <div className="text-sm text-yellow-800">
            <strong>Risk Warning:</strong> Automated trading involves significant risk.
            Past performance does not guarantee future results. Only trade with funds you can afford to lose.
          </div>
        </div>
      </Card>
    </div>
  );
}
