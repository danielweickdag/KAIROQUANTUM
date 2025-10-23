'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Zap,
  Shield,
  ArrowRight,
  Search,
  Link as LinkIcon,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

interface BankAccount {
  id: string;
  bankName: string;
  accountType: 'checking' | 'savings';
  accountNumber: string;
  balance: number;
  connected: boolean;
  logo: string;
}

export default function EasyBankConnect() {
  const [searchQuery, setSearchQuery] = useState('');
  const [connectedAccounts, setConnectedAccounts] = useState<BankAccount[]>([]);
  const [showConnectFlow, setShowConnectFlow] = useState(false);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);

  // Popular banks list
  const popularBanks = [
    { name: 'Chase', logo: '🏦', users: '2.5M' },
    { name: 'Bank of America', logo: '🏛️', users: '2.1M' },
    { name: 'Wells Fargo', logo: '🐴', users: '1.8M' },
    { name: 'Citi', logo: '🏢', users: '1.5M' },
    { name: 'Capital One', logo: '💳', users: '1.2M' },
    { name: 'US Bank', logo: '🏦', users: '980K' },
    { name: 'TD Bank', logo: '🍃', users: '850K' },
    { name: 'PNC Bank', logo: '🔷', users: '720K' },
    { name: 'Truist', logo: '💜', users: '680K' },
    { name: 'Fifth Third', logo: '⭐', users: '450K' },
    { name: 'Discover', logo: '🔍', users: '420K' },
    { name: 'Ally Bank', logo: '🤝', users: '380K' },
  ];

  const handleConnectBank = (bankName: string) => {
    setSelectedBank(bankName);
    setShowConnectFlow(true);
  };

  const handleCompleteConnection = () => {
    // Simulate bank account connection
    const newAccount: BankAccount = {
      id: `acc-${Date.now()}`,
      bankName: selectedBank || 'Unknown Bank',
      accountType: 'checking',
      accountNumber: '****' + Math.floor(Math.random() * 10000),
      balance: Math.random() * 10000 + 5000,
      connected: true,
      logo: popularBanks.find(b => b.name === selectedBank)?.logo || '🏦',
    };

    setConnectedAccounts([...connectedAccounts, newAccount]);
    setShowConnectFlow(false);
    setSelectedBank(null);
  };

  const filteredBanks = popularBanks.filter(bank =>
    bank.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (showConnectFlow && selectedBank) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center">
            <LinkIcon className="w-5 h-5 mr-2 text-blue-400" />
            Connect {selectedBank}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Security Notice */}
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="flex items-start">
                <Shield className="w-5 h-5 text-blue-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-300 font-medium">Bank-Level Security</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Your credentials are encrypted with 256-bit AES encryption. We never store
                    your banking username or password. Powered by Plaid.
                  </p>
                </div>
              </div>
            </div>

            {/* Simulated Login Form */}
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-400 mb-2 block">
                  {selectedBank} Username
                </label>
                <Input
                  type="text"
                  placeholder="Enter your username"
                  className="bg-slate-700 border-slate-600"
                />
              </div>

              <div>
                <label className="text-sm text-slate-400 mb-2 block">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  className="bg-slate-700 border-slate-600"
                />
              </div>
            </div>

            {/* What We'll Access */}
            <div className="p-4 bg-slate-700/50 rounded-lg">
              <h4 className="text-sm font-medium text-white mb-3">What we'll access:</h4>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-400 mr-2" />
                  <span className="text-slate-300">Account balance</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-400 mr-2" />
                  <span className="text-slate-300">Account details (for deposits/withdrawals)</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-400 mr-2" />
                  <span className="text-slate-300">Transaction history (for verification)</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={() => setShowConnectFlow(false)}
                variant="outline"
                className="flex-1 bg-slate-700 border-slate-600"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCompleteConnection}
                className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              >
                <LinkIcon className="w-4 h-4 mr-2" />
                Connect Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connected Accounts */}
      {connectedAccounts.length > 0 && (
        <Card className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border-green-500/30">
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <CheckCircle2 className="w-5 h-5 mr-2 text-green-400" />
              Connected Bank Accounts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {connectedAccounts.map((account) => (
                <div
                  key={account.id}
                  className="p-4 bg-slate-700/50 rounded-lg flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div className="text-3xl mr-4">{account.logo}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-white">{account.bankName}</p>
                        <Badge className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                          Connected
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-400 mt-1">
                        {account.accountType} •••• {account.accountNumber}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Available</p>
                    <p className="text-xl font-bold text-green-400">
                      ${account.balance.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Connect New Account */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-blue-400" />
                Connect Your Bank
              </CardTitle>
              <p className="text-sm text-slate-400 mt-1">
                Choose from 10,000+ banks and credit unions
              </p>
            </div>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              <Zap className="w-3 h-3 mr-1" />
              Instant
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for your bank..."
                className="pl-11 bg-slate-700 border-slate-600 h-12 text-lg"
              />
            </div>
          </div>

          {/* Popular Banks Grid */}
          <div>
            <h3 className="text-sm font-medium text-slate-400 mb-3">
              {searchQuery ? 'Search Results' : 'Popular Banks'}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {filteredBanks.map((bank) => (
                <Button
                  key={bank.name}
                  onClick={() => handleConnectBank(bank.name)}
                  variant="outline"
                  className="h-auto p-4 bg-slate-700 border-slate-600 hover:bg-slate-600 hover:border-blue-500 transition-all"
                >
                  <div className="flex items-center w-full">
                    <div className="text-3xl mr-3">{bank.logo}</div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-white">{bank.name}</p>
                      <p className="text-xs text-slate-400">{bank.users} users</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                </Button>
              ))}
            </div>

            {filteredBanks.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No banks found matching "{searchQuery}"</p>
                <p className="text-sm mt-2">Try searching with a different name</p>
              </div>
            )}
          </div>

          {/* Trust Badges */}
          <div className="mt-6 pt-6 border-t border-slate-700">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <Shield className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="text-xs text-slate-400">256-bit Encryption</p>
              </div>
              <div>
                <CheckCircle2 className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <p className="text-xs text-slate-400">FDIC Insured</p>
              </div>
              <div>
                <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <p className="text-xs text-slate-400">Instant Verification</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Benefits */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/30">
        <CardContent className="py-4">
          <div className="flex items-start">
            <DollarSign className="w-6 h-6 text-green-400 mr-3 mt-1" />
            <div>
              <p className="font-medium text-white mb-2">Why Connect Your Bank?</p>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex items-start">
                  <TrendingUp className="w-4 h-4 text-green-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-green-400 font-medium">Instant Deposits</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Fund your account in seconds, not days
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <DollarSign className="w-4 h-4 text-blue-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-blue-400 font-medium">Quick Withdrawals</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Get your profits same-day
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CreditCard className="w-4 h-4 text-purple-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-purple-400 font-medium">Auto-Transfer</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Set up automatic profit withdrawals
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
