'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  X, 
  Edit3, 
  Target, 
  Shield,
  DollarSign,
  Clock,
  BarChart3
} from 'lucide-react';

interface Position {
  id: string;
  symbol: string;
  side: 'long' | 'short';
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  stopLoss?: number;
  takeProfit?: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  openTime: string;
  value: number;
}

export default function PositionsPanel() {
  const [positions] = useState<Position[]>([
    {
      id: '1',
      symbol: 'AAPL',
      side: 'long',
      quantity: 100,
      entryPrice: 172.50,
      currentPrice: 175.43,
      stopLoss: 168.00,
      takeProfit: 180.00,
      unrealizedPnL: 293.00,
      unrealizedPnLPercent: 1.70,
      openTime: '2024-01-15 09:30',
      value: 17543
    },
    {
      id: '2',
      symbol: 'TSLA',
      side: 'long',
      quantity: 50,
      entryPrice: 248.75,
      currentPrice: 245.20,
      stopLoss: 240.00,
      takeProfit: 260.00,
      unrealizedPnL: -177.50,
      unrealizedPnLPercent: -1.43,
      openTime: '2024-01-15 10:15',
      value: 12260
    },
    {
      id: '3',
      symbol: 'NVDA',
      side: 'short',
      quantity: 25,
      entryPrice: 875.30,
      currentPrice: 862.15,
      stopLoss: 890.00,
      takeProfit: 850.00,
      unrealizedPnL: 328.75,
      unrealizedPnLPercent: 1.50,
      openTime: '2024-01-15 11:00',
      value: 21553
    }
  ]);

  const totalUnrealizedPnL = positions.reduce((sum, pos) => sum + pos.unrealizedPnL, 0);
  const totalValue = positions.reduce((sum, pos) => sum + pos.value, 0);

  const handleClosePosition = (positionId: string) => {
    console.log('Closing position:', positionId);
    // Close position logic would go here
  };

  const handleModifyPosition = (positionId: string) => {
    console.log('Modifying position:', positionId);
    // Modify position logic would go here
  };

  const getProgressToTarget = (position: Position) => {
    if (!position.takeProfit) return 0;
    
    const totalDistance = Math.abs(position.takeProfit - position.entryPrice);
    const currentDistance = Math.abs(position.currentPrice - position.entryPrice);
    
    return Math.min((currentDistance / totalDistance) * 100, 100);
  };

  const getProgressToStop = (position: Position) => {
    if (!position.stopLoss) return 0;
    
    const totalDistance = Math.abs(position.entryPrice - position.stopLoss);
    const currentDistance = Math.abs(position.entryPrice - position.currentPrice);
    
    return Math.min((currentDistance / totalDistance) * 100, 100);
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
            Open Positions ({positions.length})
          </div>
          <Badge 
            variant="outline" 
            className={totalUnrealizedPnL >= 0 ? 'border-green-500 text-green-400' : 'border-red-500 text-red-400'}
          >
            {totalUnrealizedPnL >= 0 ? '+' : ''}${totalUnrealizedPnL.toFixed(2)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Portfolio Summary */}
        <div className="grid grid-cols-2 gap-4 p-3 bg-slate-700/20 rounded-lg">
          <div>
            <div className="text-xs text-slate-400">Total Value</div>
            <div className="font-semibold">${totalValue.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Unrealized P&L</div>
            <div className={`font-semibold ${totalUnrealizedPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalUnrealizedPnL >= 0 ? '+' : ''}${totalUnrealizedPnL.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Positions List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {positions.map((position) => (
            <div key={position.id} className="p-3 bg-slate-700/30 rounded-lg border border-slate-600">
              {/* Position Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">{position.symbol}</span>
                  <Badge 
                    variant="outline" 
                    className={position.side === 'long' ? 'border-green-500 text-green-400' : 'border-red-500 text-red-400'}
                  >
                    {position.side === 'long' ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {position.side.toUpperCase()}
                  </Badge>
                  <span className="text-sm text-slate-400">{position.quantity} shares</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleModifyPosition(position.id)}
                    className="h-6 w-6 p-0"
                  >
                    <Edit3 className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleClosePosition(position.id)}
                    className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {/* Position Details */}
              <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                <div>
                  <div className="text-slate-400">Entry</div>
                  <div className="font-medium">${position.entryPrice.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-slate-400">Current</div>
                  <div className="font-medium">${position.currentPrice.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-slate-400">P&L</div>
                  <div className={`font-medium ${position.unrealizedPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {position.unrealizedPnL >= 0 ? '+' : ''}${position.unrealizedPnL.toFixed(2)}
                    <div className="text-xs">
                      ({position.unrealizedPnL >= 0 ? '+' : ''}{position.unrealizedPnLPercent.toFixed(2)}%)
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Management Levels */}
              {(position.stopLoss || position.takeProfit) && (
                <div className="space-y-2">
                  {position.takeProfit && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400 flex items-center">
                          <Target className="w-3 h-3 mr-1" />
                          Take Profit: ${position.takeProfit.toFixed(2)}
                        </span>
                        <span className="text-green-400">{getProgressToTarget(position).toFixed(0)}%</span>
                      </div>
                      <Progress 
                        value={getProgressToTarget(position)} 
                        className="h-1 bg-slate-600"
                      />
                    </div>
                  )}
                  
                  {position.stopLoss && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400 flex items-center">
                          <Shield className="w-3 h-3 mr-1" />
                          Stop Loss: ${position.stopLoss.toFixed(2)}
                        </span>
                        <span className="text-red-400">{getProgressToStop(position).toFixed(0)}%</span>
                      </div>
                      <Progress 
                        value={getProgressToStop(position)} 
                        className="h-1 bg-slate-600"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Position Meta */}
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-600">
                <div className="flex items-center text-xs text-slate-400">
                  <Clock className="w-3 h-3 mr-1" />
                  {position.openTime}
                </div>
                <div className="flex items-center text-xs text-slate-400">
                  <DollarSign className="w-3 h-3 mr-1" />
                  ${position.value.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {positions.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No open positions</p>
            <p className="text-sm">Place your first trade to get started</p>
          </div>
        )}

        {/* Quick Actions */}
        {positions.length > 0 && (
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-600">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => console.log('Close all profitable positions')}
            >
              Close All Profitable
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs text-red-400 border-red-500 hover:bg-red-500/10"
              onClick={() => console.log('Close all positions')}
            >
              Close All Positions
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}