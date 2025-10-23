'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  CreditCard,
  Building2,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import EasyBankConnect from '@/components/banking/EasyBankConnect';
import QuickCashflow from '@/components/banking/QuickCashflow';

export default function BankingPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<'connect' | 'cashflow'>('cashflow');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button
              onClick={() => router.push('/simple-trade')}
              variant="outline"
              className="mr-4 bg-slate-800 border-slate-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                  Banking & Cashflow
                </h1>
                <Badge className="bg-gradient-to-r from-blue-500/20 to-green-500/20 border-blue-500/30 text-blue-400">
                  Instant Transfers
                </Badge>
              </div>
              <p className="text-slate-400 text-sm mt-1">
                Connect your bank and move money instantly
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="max-w-5xl mx-auto mb-6">
        <div className="bg-gradient-to-r from-blue-500/10 to-green-500/10 border border-blue-500/30 rounded-lg p-4">
          <div className="grid grid-cols-3 gap-6">
            <div className="flex items-start">
              <div className="p-2 rounded-lg bg-blue-500/20 mr-3">
                <CreditCard className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Connected Banks</p>
                <p className="text-xl font-bold text-blue-400">1</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="p-2 rounded-lg bg-green-500/20 mr-3">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Available to Withdraw</p>
                <p className="text-xl font-bold text-green-400">$12,450</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="p-2 rounded-lg bg-purple-500/20 mr-3">
                <DollarSign className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Total Deposited</p>
                <p className="text-xl font-bold text-purple-400">$10,000</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="max-w-5xl mx-auto mb-6">
        <div className="flex gap-3">
          <Button
            onClick={() => setActiveSection('cashflow')}
            variant={activeSection === 'cashflow' ? 'default' : 'outline'}
            className={`flex-1 h-12 ${
              activeSection === 'cashflow'
                ? 'bg-gradient-to-r from-blue-600 to-green-600'
                : 'bg-slate-800 border-slate-700'
            }`}
          >
            <DollarSign className="w-5 h-5 mr-2" />
            Deposit & Withdraw
          </Button>
          <Button
            onClick={() => setActiveSection('connect')}
            variant={activeSection === 'connect' ? 'default' : 'outline'}
            className={`flex-1 h-12 ${
              activeSection === 'connect'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600'
                : 'bg-slate-800 border-slate-700'
            }`}
          >
            <Building2 className="w-5 h-5 mr-2" />
            Connect Bank
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto">
        {activeSection === 'cashflow' ? (
          <QuickCashflow />
        ) : (
          <EasyBankConnect />
        )}
      </div>
    </div>
  );
}
