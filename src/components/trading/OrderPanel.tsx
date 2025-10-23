'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  Shield, 
  Calculator,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface OrderPanelProps {
  symbol: string;
}

export default function OrderPanel({ symbol }: OrderPanelProps) {
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop'>('market');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [useStopLoss, setUseStopLoss] = useState(true);
  const [useTakeProfit, setUseTakeProfit] = useState(true);
  const [riskAmount, setRiskAmount] = useState('500');
  
  const currentPrice = 175.43; // Mock current price
  const accountBalance = 25000;
  
  // Calculate order details
  const orderValue = parseFloat(quantity) * (orderType === 'market' ? currentPrice : parseFloat(price) || currentPrice);
  const riskRewardRatio = useTakeProfit && useStopLoss && parseFloat(takeProfit) && parseFloat(stopLoss) 
    ? Math.abs(parseFloat(takeProfit) - currentPrice) / Math.abs(currentPrice - parseFloat(stopLoss))
    : 0;

  const handlePlaceOrder = () => {
    // Order placement logic would go here
    console.log('Placing order:', {
      symbol,
      side,
      orderType,
      quantity,
      price: orderType === 'market' ? currentPrice : price,
      stopLoss: useStopLoss ? stopLoss : null,
      takeProfit: useTakeProfit ? takeProfit : null
    });
  };

  const calculatePositionSize = () => {
    if (!useStopLoss || !parseFloat(stopLoss) || !parseFloat(riskAmount)) return '';
    
    const riskPerShare = Math.abs(currentPrice - parseFloat(stopLoss));
    const maxShares = parseFloat(riskAmount) / riskPerShare;
    return Math.floor(maxShares).toString();
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <DollarSign className="w-5 h-5 mr-2 text-green-400" />
          Place Order - {symbol}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Buy/Sell Toggle */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={side === 'buy' ? 'default' : 'outline'}
            onClick={() => setSide('buy')}
            className={side === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'border-green-500 text-green-400 hover:bg-green-500/10'}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            BUY
          </Button>
          <Button
            variant={side === 'sell' ? 'default' : 'outline'}
            onClick={() => setSide('sell')}
            className={side === 'sell' ? 'bg-red-600 hover:bg-red-700' : 'border-red-500 text-red-400 hover:bg-red-500/10'}
          >
            <TrendingDown className="w-4 h-4 mr-2" />
            SELL
          </Button>
        </div>

        {/* Order Type */}
        <Tabs value={orderType} onValueChange={(value) => setOrderType(value as any)}>
          <TabsList className="grid w-full grid-cols-3 bg-slate-700">
            <TabsTrigger value="market">Market</TabsTrigger>
            <TabsTrigger value="limit">Limit</TabsTrigger>
            <TabsTrigger value="stop">Stop</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Current Price */}
        <div className="p-3 bg-slate-700/30 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-400">Current Price</span>
            <span className="font-semibold text-blue-400">${currentPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Quantity */}
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <div className="flex space-x-2">
            <Input
              id="quantity"
              type="number"
              placeholder="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="bg-slate-700 border-slate-600"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuantity(calculatePositionSize())}
              className="whitespace-nowrap"
            >
              <Calculator className="w-4 h-4 mr-1" />
              Auto
            </Button>
          </div>
        </div>

        {/* Price (for limit/stop orders) */}
        {orderType !== 'market' && (
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              placeholder={currentPrice.toString()}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="bg-slate-700 border-slate-600"
            />
          </div>
        )}

        {/* Risk Management */}
        <div className="space-y-3 p-3 bg-slate-700/20 rounded-lg border border-slate-600">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="font-medium">Risk Management</span>
          </div>

          {/* Risk Amount */}
          <div className="space-y-2">
            <Label htmlFor="risk">Risk Amount ($)</Label>
            <Input
              id="risk"
              type="number"
              placeholder="500"
              value={riskAmount}
              onChange={(e) => setRiskAmount(e.target.value)}
              className="bg-slate-700 border-slate-600"
            />
          </div>

          {/* Stop Loss */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="stopLoss">Stop Loss</Label>
              <Switch
                checked={useStopLoss}
                onCheckedChange={setUseStopLoss}
                className="data-[state=checked]:bg-red-600"
              />
            </div>
            {useStopLoss && (
              <Input
                id="stopLoss"
                type="number"
                placeholder={side === 'buy' ? (currentPrice * 0.95).toFixed(2) : (currentPrice * 1.05).toFixed(2)}
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                className="bg-slate-700 border-slate-600"
              />
            )}
          </div>

          {/* Take Profit */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="takeProfit">Take Profit</Label>
              <Switch
                checked={useTakeProfit}
                onCheckedChange={setUseTakeProfit}
                className="data-[state=checked]:bg-green-600"
              />
            </div>
            {useTakeProfit && (
              <Input
                id="takeProfit"
                type="number"
                placeholder={side === 'buy' ? (currentPrice * 1.05).toFixed(2) : (currentPrice * 0.95).toFixed(2)}
                value={takeProfit}
                onChange={(e) => setTakeProfit(e.target.value)}
                className="bg-slate-700 border-slate-600"
              />
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-2 p-3 bg-slate-700/20 rounded-lg">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Order Value:</span>
            <span className="font-semibold">${orderValue.toFixed(2) || '0.00'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Available Balance:</span>
            <span className="font-semibold text-green-400">${accountBalance.toLocaleString()}</span>
          </div>
          {riskRewardRatio > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Risk/Reward Ratio:</span>
              <Badge 
                variant="outline" 
                className={riskRewardRatio >= 2 ? 'border-green-500 text-green-400' : 'border-yellow-500 text-yellow-400'}
              >
                1:{riskRewardRatio.toFixed(2)}
              </Badge>
            </div>
          )}
        </div>

        {/* Validation Messages */}
        {quantity && orderValue > accountBalance && (
          <div className="flex items-center space-x-2 p-2 bg-red-900/20 border border-red-500/30 rounded">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-400">Insufficient balance</span>
          </div>
        )}

        {riskRewardRatio > 0 && riskRewardRatio < 1 && (
          <div className="flex items-center space-x-2 p-2 bg-yellow-900/20 border border-yellow-500/30 rounded">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-yellow-400">Poor risk/reward ratio</span>
          </div>
        )}

        {riskRewardRatio >= 2 && (
          <div className="flex items-center space-x-2 p-2 bg-green-900/20 border border-green-500/30 rounded">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-400">Good risk/reward ratio</span>
          </div>
        )}

        {/* Place Order Button */}
        <Button
          onClick={handlePlaceOrder}
          disabled={!quantity || (orderType !== 'market' && !price) || orderValue > accountBalance}
          className={`w-full ${
            side === 'buy' 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          <Target className="w-4 h-4 mr-2" />
          Place {side.toUpperCase()} Order
        </Button>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuantity('10')}
            className="text-xs"
          >
            10 Shares
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuantity('50')}
            className="text-xs"
          >
            50 Shares
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuantity('100')}
            className="text-xs"
          >
            100 Shares
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}