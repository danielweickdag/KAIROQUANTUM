'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  DollarSign,
  Zap,
  Clock,
  CheckCircle2,
  TrendingUp,
  Shield,
  Calendar,
  Repeat,
} from 'lucide-react';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  status: 'pending' | 'completed' | 'processing';
  timestamp: Date;
  bankName: string;
}

export default function QuickCashflow() {
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdrawal'>('deposit');
  const [amount, setAmount] = useState('');
  const [autoWithdrawEnabled, setAutoWithdrawEnabled] = useState(false);
  const [autoWithdrawThreshold, setAutoWithdrawThreshold] = useState('1000');
  const [recentTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'deposit',
      amount: 5000,
      status: 'completed',
      timestamp: new Date(Date.now() - 3600000 * 2),
      bankName: 'Chase',
    },
    {
      id: '2',
      type: 'withdrawal',
      amount: 850,
      status: 'completed',
      timestamp: new Date(Date.now() - 3600000 * 5),
      bankName: 'Chase',
    },
  ]);

  const tradingBalance = 12450.75;
  const todayProfit = 547.30;
  const weekProfit = 2150.80;

  const handleQuickAction = (presetAmount: number) => {
    setAmount(presetAmount.toString());
  };

  const handleDeposit = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    alert(`Depositing $${amount} - This will be instant!`);
    setAmount('');
  };

  const handleWithdrawal = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    if (parseFloat(amount) > tradingBalance) {
      alert('Insufficient balance');
      return;
    }
    alert(`Withdrawing $${amount} - Funds will arrive in 1-2 business days`);
    setAmount('');
  };

  const quickAmounts = activeTab === 'deposit'
    ? [100, 500, 1000, 5000]
    : [todayProfit, weekProfit, tradingBalance / 2, tradingBalance];

  return (
    <div className="space-y-6">
      {/* Quick Action Card */}
      <Card className="bg-gradient-to-br from-blue-500/10 to-green-500/10 border-blue-500/30">
        <CardContent className="py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Quick Cash Flow</h3>
              <p className="text-sm text-slate-400">Move money in seconds</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">Trading Balance</p>
              <p className="text-2xl font-bold text-white">${tradingBalance.toFixed(2)}</p>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex gap-2 mb-6">
            <Button
              onClick={() => setActiveTab('deposit')}
              className={`flex-1 h-12 ${
                activeTab === 'deposit'
                  ? 'bg-gradient-to-r from-blue-600 to-green-600'
                  : 'bg-slate-700 hover:bg-slate-600'
              }`}
            >
              <ArrowDownToLine className="w-5 h-5 mr-2" />
              Deposit
            </Button>
            <Button
              onClick={() => setActiveTab('withdrawal')}
              className={`flex-1 h-12 ${
                activeTab === 'withdrawal'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                  : 'bg-slate-700 hover:bg-slate-600'
              }`}
            >
              <ArrowUpFromLine className="w-5 h-5 mr-2" />
              Withdraw
            </Button>
          </div>

          {/* Amount Input */}
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-400 mb-2 block">
                {activeTab === 'deposit' ? 'Deposit Amount' : 'Withdrawal Amount'}
              </label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="pl-14 bg-slate-700 border-slate-600 text-white text-2xl h-16 text-center"
                />
              </div>
            </div>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {quickAmounts.map((preset, index) => (
                <Button
                  key={index}
                  onClick={() => handleQuickAction(preset)}
                  variant="outline"
                  className="bg-slate-700 border-slate-600 hover:bg-slate-600"
                  size="sm"
                >
                  <div className="text-center">
                    <p className="text-xs text-slate-400">
                      {activeTab === 'deposit'
                        ? preset === 100 ? 'Min' : preset === 5000 ? 'Max' : ''
                        : index === 0 ? 'Today' : index === 1 ? 'Week' : index === 2 ? 'Half' : 'All'}
                    </p>
                    <p className="font-bold text-white">
                      ${preset > 1000 ? (preset / 1000).toFixed(1) + 'K' : preset.toFixed(0)}
                    </p>
                  </div>
                </Button>
              ))}
            </div>

            {/* Action Button */}
            <Button
              onClick={activeTab === 'deposit' ? handleDeposit : handleWithdrawal}
              disabled={!amount || parseFloat(amount) <= 0}
              className={`w-full h-14 text-lg font-bold ${
                activeTab === 'deposit'
                  ? 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
              }`}
            >
              {activeTab === 'deposit' ? (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  Instant Deposit
                </>
              ) : (
                <>
                  <ArrowUpFromLine className="w-5 h-5 mr-2" />
                  Withdraw to Bank
                </>
              )}
            </Button>

            {/* Info Badge */}
            <div className={`flex items-center justify-center gap-2 text-xs ${
              activeTab === 'deposit' ? 'text-blue-400' : 'text-purple-400'
            }`}>
              <Clock className="w-4 h-4" />
              <span>
                {activeTab === 'deposit'
                  ? 'Funds available immediately'
                  : 'Arrives in 1-2 business days'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Auto-Withdrawal Card */}
      {activeTab === 'withdrawal' && (
        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Repeat className="w-5 h-5 mr-2 text-purple-400" />
              Auto-Withdraw Profits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                <div className="flex items-start">
                  <div className={`p-2 rounded-lg mr-3 ${
                    autoWithdrawEnabled ? 'bg-purple-500/20' : 'bg-slate-600'
                  }`}>
                    <TrendingUp className={`w-5 h-5 ${
                      autoWithdrawEnabled ? 'text-purple-400' : 'text-slate-400'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium text-white">Automatic Withdrawals</p>
                    <p className="text-sm text-slate-400 mt-1">
                      Auto-transfer profits to your bank when threshold is reached
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => setAutoWithdrawEnabled(!autoWithdrawEnabled)}
                  variant={autoWithdrawEnabled ? "default" : "outline"}
                  size="sm"
                  className={autoWithdrawEnabled ? 'bg-purple-600' : ''}
                >
                  {autoWithdrawEnabled ? 'ON' : 'OFF'}
                </Button>
              </div>

              {autoWithdrawEnabled && (
                <div className="space-y-3 animate-in fade-in duration-300">
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">
                      Auto-Withdraw When Balance Reaches
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        type="number"
                        value={autoWithdrawThreshold}
                        onChange={(e) => setAutoWithdrawThreshold(e.target.value)}
                        className="pl-11 bg-slate-700 border-slate-600"
                        placeholder="1000"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <div className="flex items-start">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 mr-2 mt-0.5" />
                      <div className="text-xs text-slate-300">
                        <p className="font-medium text-purple-300 mb-1">How it works:</p>
                        <p>When your trading balance reaches ${autoWithdrawThreshold}, we'll automatically
                          transfer the amount above ${autoWithdrawThreshold} to your connected bank account.
                          This keeps your profits safe while maintaining your trading capital.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Profit Withdrawal */}
      {activeTab === 'withdrawal' && (
        <Card className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border-green-500/30">
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
              Quick Profit Withdrawal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-slate-400">Today's Profit</p>
                  <Badge className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                    Available
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-green-400 mb-3">
                  ${todayProfit.toFixed(2)}
                </p>
                <Button
                  onClick={() => {
                    setAmount(todayProfit.toString());
                    handleWithdrawal();
                  }}
                  size="sm"
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <ArrowUpFromLine className="w-4 h-4 mr-2" />
                  Withdraw
                </Button>
              </div>

              <div className="p-4 bg-slate-700/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-slate-400">This Week's Profit</p>
                  <Badge className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/30">
                    Available
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-blue-400 mb-3">
                  ${weekProfit.toFixed(2)}
                </p>
                <Button
                  onClick={() => {
                    setAmount(weekProfit.toString());
                    handleWithdrawal();
                  }}
                  size="sm"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <ArrowUpFromLine className="w-4 h-4 mr-2" />
                  Withdraw
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Transactions */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="p-3 bg-slate-700/50 rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div className={`p-2 rounded-full mr-3 ${
                    transaction.type === 'deposit'
                      ? 'bg-blue-500/20'
                      : 'bg-purple-500/20'
                  }`}>
                    {transaction.type === 'deposit' ? (
                      <ArrowDownToLine className="w-4 h-4 text-blue-400" />
                    ) : (
                      <ArrowUpFromLine className="w-4 h-4 text-purple-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-white capitalize">
                        {transaction.type}
                      </p>
                      <Badge variant="outline" className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                        {transaction.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-400 mt-1">
                      {transaction.bankName} • {transaction.timestamp.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className={`text-lg font-bold ${
                  transaction.type === 'deposit' ? 'text-blue-400' : 'text-purple-400'
                }`}>
                  {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="bg-blue-500/10 border-blue-500/30">
        <CardContent className="py-4">
          <div className="flex items-start">
            <Shield className="w-5 h-5 text-blue-400 mr-3 mt-0.5" />
            <div className="text-sm text-slate-300">
              <p className="font-medium text-blue-300 mb-1">Secure Transfers</p>
              <p className="text-xs">
                All transactions are encrypted and protected by bank-level security.
                Deposits are instant. Withdrawals typically arrive in 1-2 business days.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
