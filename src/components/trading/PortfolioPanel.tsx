'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Wallet, 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PlusCircle, 
  MinusCircle,
  Building2,
  Link,
  Unlink,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  ArrowUpRight,
  ArrowDownLeft,
  PieChart,
  BarChart3
} from 'lucide-react';

interface BankAccount {
  id: string;
  bankName: string;
  accountType: string;
  accountNumber: string;
  routingNumber: string;
  balance: number;
  isConnected: boolean;
  isVerified: boolean;
}

interface BrokerAccount {
  id: string;
  brokerName: string;
  accountNumber: string;
  accountType: string;
  balance: number;
  buyingPower: number;
  isConnected: boolean;
  status: 'active' | 'pending' | 'suspended';
}

interface Holding {
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  marketValue: number;
  unrealizedPL: number;
  unrealizedPLPercent: number;
  dayChange: number;
  dayChangePercent: number;
}

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'buy' | 'sell' | 'dividend';
  amount: number;
  symbol?: string;
  quantity?: number;
  price?: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

export default function PortfolioPanel() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAccountNumbers, setShowAccountNumbers] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedBankAccount, setSelectedBankAccount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - replace with real API calls
  const [portfolioValue, setPortfolioValue] = useState(125750.50);
  const [totalPL, setTotalPL] = useState(8750.50);
  const [totalPLPercent, setTotalPLPercent] = useState(7.48);
  const [dayChange, setDayChange] = useState(1250.75);
  const [dayChangePercent, setDayChangePercent] = useState(1.01);
  const [cashBalance, setCashBalance] = useState(15250.00);
  const [buyingPower, setBuyingPower] = useState(45750.00);

  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    {
      id: '1',
      bankName: 'Chase Bank',
      accountType: 'Checking',
      accountNumber: '****1234',
      routingNumber: '021000021',
      balance: 25000.00,
      isConnected: true,
      isVerified: true
    },
    {
      id: '2',
      bankName: 'Bank of America',
      accountType: 'Savings',
      accountNumber: '****5678',
      routingNumber: '026009593',
      balance: 50000.00,
      isConnected: false,
      isVerified: false
    }
  ]);

  const [brokerAccounts, setBrokerAccounts] = useState<BrokerAccount[]>([
    {
      id: '1',
      brokerName: 'Alpaca Markets',
      accountNumber: 'ALPC****1234',
      accountType: 'Individual',
      balance: 125750.50,
      buyingPower: 251501.00,
      isConnected: true,
      status: 'active'
    },
    {
      id: '2',
      brokerName: 'Interactive Brokers',
      accountNumber: 'IB****5678',
      accountType: 'Margin',
      balance: 0,
      buyingPower: 0,
      isConnected: false,
      status: 'pending'
    }
  ]);

  const [holdings, setHoldings] = useState<Holding[]>([
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      quantity: 50,
      avgPrice: 175.25,
      currentPrice: 182.50,
      marketValue: 9125.00,
      unrealizedPL: 362.50,
      unrealizedPLPercent: 4.14,
      dayChange: 125.00,
      dayChangePercent: 1.39
    },
    {
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      quantity: 25,
      avgPrice: 245.80,
      currentPrice: 238.90,
      marketValue: 5972.50,
      unrealizedPL: -172.50,
      unrealizedPLPercent: -2.81,
      dayChange: -87.50,
      dayChangePercent: -1.44
    },
    {
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
      quantity: 30,
      avgPrice: 420.15,
      currentPrice: 445.75,
      marketValue: 13372.50,
      unrealizedPL: 768.00,
      unrealizedPLPercent: 6.09,
      dayChange: 267.00,
      dayChangePercent: 2.04
    }
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'deposit',
      amount: 5000.00,
      date: '2024-01-15',
      status: 'completed'
    },
    {
      id: '2',
      type: 'buy',
      amount: 4375.00,
      symbol: 'AAPL',
      quantity: 25,
      price: 175.00,
      date: '2024-01-14',
      status: 'completed'
    },
    {
      id: '3',
      type: 'withdrawal',
      amount: 2000.00,
      date: '2024-01-13',
      status: 'pending'
    }
  ]);

  const handleConnectBroker = async (brokerId: string) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setBrokerAccounts(prev => 
        prev.map(broker => 
          broker.id === brokerId 
            ? { ...broker, isConnected: true, status: 'active' as const }
            : broker
        )
      );
      setIsLoading(false);
    }, 2000);
  };

  const handleDisconnectBroker = (brokerId: string) => {
    setBrokerAccounts(prev => 
      prev.map(broker => 
        broker.id === brokerId 
          ? { ...broker, isConnected: false, status: 'pending' as const }
          : broker
      )
    );
  };

  const handleConnectBank = async (bankId: string) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setBankAccounts(prev => 
        prev.map(bank => 
          bank.id === bankId 
            ? { ...bank, isConnected: true, isVerified: true }
            : bank
        )
      );
      setIsLoading(false);
    }, 2000);
  };

  const handleDeposit = async () => {
    if (!depositAmount || !selectedBankAccount) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const amount = parseFloat(depositAmount);
      setCashBalance(prev => prev + amount);
      setBuyingPower(prev => prev + amount * 2); // 2:1 margin
      
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'deposit',
        amount: amount,
        date: new Date().toISOString().split('T')[0],
        status: 'completed'
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      setDepositAmount('');
      setIsLoading(false);
    }, 2000);
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || !selectedBankAccount) return;
    
    const amount = parseFloat(withdrawAmount);
    if (amount > cashBalance) {
      alert('Insufficient cash balance');
      return;
    }
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setCashBalance(prev => prev - amount);
      setBuyingPower(prev => prev - amount * 2);
      
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'withdrawal',
        amount: amount,
        date: new Date().toISOString().split('T')[0],
        status: 'pending'
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      setWithdrawAmount('');
      setIsLoading(false);
    }, 2000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="holdings">Holdings</TabsTrigger>
          <TabsTrigger value="banking">Banking</TabsTrigger>
          <TabsTrigger value="brokers">Brokers</TabsTrigger>
        </TabsList>

        {/* Portfolio Overview */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-300 flex items-center">
                  <PieChart className="w-4 h-4 mr-2" />
                  Portfolio Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(portfolioValue)}</div>
                <div className={`text-sm flex items-center ${totalPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {totalPL >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                  {formatCurrency(Math.abs(totalPL))} ({formatPercent(totalPLPercent)})
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-300 flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Day Change
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${dayChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatCurrency(dayChange)}
                </div>
                <div className={`text-sm ${dayChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatPercent(dayChangePercent)}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-300 flex items-center">
                  <Wallet className="w-4 h-4 mr-2" />
                  Cash Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(cashBalance)}</div>
                <div className="text-sm text-slate-400">Available for trading</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-300 flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Buying Power
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(buyingPower)}</div>
                <div className="text-sm text-slate-400">Including margin</div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        transaction.type === 'deposit' ? 'bg-green-500/20 text-green-400' :
                        transaction.type === 'withdrawal' ? 'bg-red-500/20 text-red-400' :
                        transaction.type === 'buy' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>
                        {transaction.type === 'deposit' && <ArrowUpRight className="w-4 h-4" />}
                        {transaction.type === 'withdrawal' && <ArrowDownLeft className="w-4 h-4" />}
                        {transaction.type === 'buy' && <PlusCircle className="w-4 h-4" />}
                        {transaction.type === 'sell' && <MinusCircle className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="font-medium capitalize">{transaction.type}</div>
                        <div className="text-sm text-slate-400">
                          {transaction.symbol && `${transaction.quantity} shares of ${transaction.symbol}`}
                          {!transaction.symbol && transaction.date}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(transaction.amount)}</div>
                      <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Holdings */}
        <TabsContent value="holdings" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Current Holdings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {holdings.map((holding) => (
                  <div key={holding.symbol} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{holding.symbol}</div>
                      <div className="text-sm text-slate-400">{holding.name}</div>
                      <div className="text-sm text-slate-400">{holding.quantity} shares @ {formatCurrency(holding.avgPrice)}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(holding.marketValue)}</div>
                      <div className={`text-sm ${holding.unrealizedPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {formatCurrency(holding.unrealizedPL)} ({formatPercent(holding.unrealizedPLPercent)})
                      </div>
                      <div className={`text-xs ${holding.dayChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        Day: {formatCurrency(holding.dayChange)} ({formatPercent(holding.dayChangePercent)})
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Banking */}
        <TabsContent value="banking" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Bank Accounts */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center justify-between">
                  Bank Accounts
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAccountNumbers(!showAccountNumbers)}
                  >
                    {showAccountNumbers ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {bankAccounts.map((account) => (
                  <div key={account.id} className="p-3 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        <span className="font-medium">{account.bankName}</span>
                        {account.isVerified && <CheckCircle className="w-4 h-4 text-green-400" />}
                      </div>
                      <Button
                        variant={account.isConnected ? "destructive" : "default"}
                        size="sm"
                        onClick={() => account.isConnected ? null : handleConnectBank(account.id)}
                        disabled={isLoading}
                      >
                        {account.isConnected ? (
                          <>
                            <Unlink className="w-3 h-3 mr-1" />
                            Connected
                          </>
                        ) : (
                          <>
                            <Link className="w-3 h-3 mr-1" />
                            Connect
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="text-sm text-slate-400">
                      <div>{account.accountType}</div>
                      <div>
                        {showAccountNumbers ? account.accountNumber.replace('****', account.routingNumber.slice(-4)) : account.accountNumber}
                      </div>
                      <div className="font-medium text-white mt-1">
                        Balance: {formatCurrency(account.balance)}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Fund Management */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Fund Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Deposit Funds */}
                <div className="space-y-3">
                  <Label htmlFor="deposit-amount">Deposit Funds</Label>
                  <div className="space-y-2">
                    <Input
                      id="deposit-amount"
                      type="number"
                      placeholder="Enter amount"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="bg-slate-700 border-slate-600"
                    />
                    <select
                      value={selectedBankAccount}
                      onChange={(e) => setSelectedBankAccount(e.target.value)}
                      className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                    >
                      <option value="">Select bank account</option>
                      {bankAccounts.filter(acc => acc.isConnected).map((account) => (
                        <option key={account.id} value={account.id}>
                          {account.bankName} - {account.accountType}
                        </option>
                      ))}
                    </select>
                    <Button
                      onClick={handleDeposit}
                      disabled={!depositAmount || !selectedBankAccount || isLoading}
                      className="w-full"
                    >
                      {isLoading ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <PlusCircle className="w-4 h-4 mr-2" />
                      )}
                      Deposit Funds
                    </Button>
                  </div>
                </div>

                {/* Withdraw Funds */}
                <div className="space-y-3">
                  <Label htmlFor="withdraw-amount">Withdraw Funds</Label>
                  <div className="space-y-2">
                    <Input
                      id="withdraw-amount"
                      type="number"
                      placeholder="Enter amount"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="bg-slate-700 border-slate-600"
                    />
                    <div className="text-sm text-slate-400">
                      Available: {formatCurrency(cashBalance)}
                    </div>
                    <Button
                      onClick={handleWithdraw}
                      disabled={!withdrawAmount || !selectedBankAccount || isLoading}
                      variant="outline"
                      className="w-full"
                    >
                      {isLoading ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <MinusCircle className="w-4 h-4 mr-2" />
                      )}
                      Withdraw Funds
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Brokers */}
        <TabsContent value="brokers" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Broker Accounts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {brokerAccounts.map((broker) => (
                <div key={broker.id} className="p-4 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-500/20 rounded-full">
                        <Building2 className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <div className="font-medium">{broker.brokerName}</div>
                        <div className="text-sm text-slate-400">{broker.accountType} Account</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={broker.status === 'active' ? 'default' : 'secondary'}
                        className={
                          broker.status === 'active' ? 'bg-green-500/20 text-green-400' :
                          broker.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }
                      >
                        {broker.status}
                      </Badge>
                      <Button
                        variant={broker.isConnected ? "destructive" : "default"}
                        size="sm"
                        onClick={() => broker.isConnected ? handleDisconnectBroker(broker.id) : handleConnectBroker(broker.id)}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                        ) : broker.isConnected ? (
                          <Unlink className="w-3 h-3 mr-1" />
                        ) : (
                          <Link className="w-3 h-3 mr-1" />
                        )}
                        {broker.isConnected ? 'Disconnect' : 'Connect'}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-slate-400">Account Number</div>
                      <div className="font-medium">{broker.accountNumber}</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Balance</div>
                      <div className="font-medium">{formatCurrency(broker.balance)}</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Buying Power</div>
                      <div className="font-medium">{formatCurrency(broker.buyingPower)}</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Status</div>
                      <div className="flex items-center space-x-1">
                        {broker.isConnected ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-yellow-400" />
                        )}
                        <span className="capitalize">{broker.isConnected ? 'Connected' : 'Not Connected'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}