'use client';

import React, { useState } from 'react';
import { useTradingMode } from '@/contexts/TradingModeContext';
import { automatedDepositWithdrawService } from '@/services/AutomatedDepositWithdrawService';
import { toast } from 'react-hot-toast';
import { DollarSign, ArrowDownRight, RefreshCw } from 'lucide-react';

type TradingActionsProps = {
  className?: string;
};

const TradingActions: React.FC<TradingActionsProps> = ({ className }) => {
  const { isPaperTrading, setIsPaperTrading, tradingMode } = useTradingMode();
  const [isDepositing, setIsDepositing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const handleEnableLiveTrading = () => {
    try {
      if (isPaperTrading) {
        setIsPaperTrading(false);
        toast.success('Live trading enabled');
      } else {
        toast.success('Live trading already enabled');
      }
    } catch (e) {
      toast.error('Failed to enable live trading');
    }
  };

  const handleDepositFunds = async () => {
    try {
      setIsDepositing(true);
      await automatedDepositWithdrawService.handleQuickDeposit({
        type: 'deposit',
        amount: 100,
      });
      toast.success('Deposit initiated');
    } catch (e) {
      toast.error('Failed to initiate deposit');
    } finally {
      setIsDepositing(false);
    }
  };

  const handleInstantWithdrawal = async () => {
    try {
      setIsWithdrawing(true);
      await automatedDepositWithdrawService.handleQuickWithdraw({
        type: 'withdrawal',
        amount: 50,
        saveAsWorkflow: true,
      });
      toast.success('Instant withdrawal enabled');
    } catch (e) {
      toast.error('Failed to enable instant withdrawal');
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className ?? ''}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Actions</h3>
      <div className="space-y-2">
        <button
          onClick={handleEnableLiveTrading}
          className={`w-full inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 transition-colors ${
            tradingMode === 'live'
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600'
          }`}
        >
          {tradingMode === 'live' ? 'Live Trading Enabled' : 'Enable Live Trading'}
        </button>

        <button
          onClick={handleDepositFunds}
          disabled={isDepositing}
          className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:from-blue-700 hover:to-blue-900 transition-colors disabled:opacity-70"
        >
          {isDepositing ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <DollarSign className="w-4 h-4 mr-2" />
          )}
          {isDepositing ? 'Depositing...' : 'Deposit Funds'}
        </button>

        <button
          onClick={handleInstantWithdrawal}
          disabled={isWithdrawing}
          className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700 transition-colors disabled:opacity-70"
        >
          {isWithdrawing ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <ArrowDownRight className="w-4 h-4 mr-2" />
          )}
          {isWithdrawing ? 'Withdrawing...' : 'Enable Withdrawal Instantly'}
        </button>
      </div>
    </div>
  );
};

export default TradingActions;