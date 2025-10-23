'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Rocket,
  DollarSign,
  Target,
  Zap,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Shield,
  Clock,
} from 'lucide-react';

interface QuickStartProps {
  onComplete: (data: OnboardingData) => void;
}

interface OnboardingData {
  startingAmount: number;
  dailyGoal: number;
  riskLevel: 'low' | 'medium' | 'high';
  autoTrading: boolean;
}

export default function QuickStart({ onComplete }: QuickStartProps) {
  const [step, setStep] = useState(1);
  const [startingAmount, setStartingAmount] = useState('1000');
  const [dailyGoal, setDailyGoal] = useState('100');
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [autoTrading, setAutoTrading] = useState(true);

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleComplete = () => {
    onComplete({
      startingAmount: parseFloat(startingAmount),
      dailyGoal: parseFloat(dailyGoal),
      riskLevel,
      autoTrading,
    });
  };

  const getSuggestedGoal = () => {
    const amount = parseFloat(startingAmount) || 1000;
    return (amount * 0.05).toFixed(0); // 5% daily goal suggestion
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-slate-800/90 border-slate-700 backdrop-blur">
        <CardContent className="p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">
                Step {step} of {totalSteps}
              </span>
              <span className="text-sm text-blue-400 font-medium">{progress.toFixed(0)}% Complete</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Step 1: Starting Amount */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full mb-4">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  How much do you want to start with?
                </h2>
                <p className="text-slate-400">
                  Don't worry, you can change this anytime
                </p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                  <Input
                    type="number"
                    value={startingAmount}
                    onChange={(e) => setStartingAmount(e.target.value)}
                    className="pl-14 bg-slate-700 border-slate-600 text-white text-3xl h-20 text-center"
                    placeholder="1000"
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {[500, 1000, 5000, 10000].map(amount => (
                    <Button
                      key={amount}
                      variant="outline"
                      onClick={() => setStartingAmount(amount.toString())}
                      className="h-16 bg-slate-700 border-slate-600 hover:bg-slate-600"
                    >
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">${amount}</div>
                        {amount === 1000 && (
                          <Badge className="mt-1 text-xs bg-blue-500/20 text-blue-400 border-blue-500/30">
                            Popular
                          </Badge>
                        )}
                      </div>
                    </Button>
                  ))}
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-start">
                    <Shield className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-blue-300 font-medium">Your funds are protected</p>
                      <p className="text-xs text-slate-400 mt-1">
                        FDIC insured • Bank-level encryption • 2FA security
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setStep(2)}
                disabled={!startingAmount || parseFloat(startingAmount) <= 0}
                className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}

          {/* Step 2: Daily Goal */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  What's your daily profit goal?
                </h2>
                <p className="text-slate-400">
                  We'll help you reach it with smart automation
                </p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                  <Input
                    type="number"
                    value={dailyGoal}
                    onChange={(e) => setDailyGoal(e.target.value)}
                    className="pl-14 bg-slate-700 border-slate-600 text-white text-3xl h-20 text-center"
                    placeholder="100"
                    autoFocus
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      per day
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {[50, 100, 250, 500].map(goal => (
                    <Button
                      key={goal}
                      variant="outline"
                      onClick={() => setDailyGoal(goal.toString())}
                      className="h-16 bg-slate-700 border-slate-600 hover:bg-slate-600"
                    >
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">${goal}</div>
                        {goal === 100 && (
                          <Badge className="mt-1 text-xs bg-purple-500/20 text-purple-400 border-purple-500/30">
                            Recommended
                          </Badge>
                        )}
                      </div>
                    </Button>
                  ))}
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start">
                      <TrendingUp className="w-5 h-5 text-purple-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-purple-300 font-medium">Suggested Goal</p>
                        <p className="text-xs text-slate-400 mt-1">
                          Based on your ${startingAmount} balance
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDailyGoal(getSuggestedGoal())}
                      className="bg-purple-500/20 border-purple-500/30 text-purple-300"
                    >
                      ${getSuggestedGoal()}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="w-1/3 h-14 text-lg bg-slate-700 border-slate-600"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!dailyGoal || parseFloat(dailyGoal) <= 0}
                  className="w-2/3 h-14 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Continue
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Risk & Auto-Trading */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Final step: Choose your style
                </h2>
                <p className="text-slate-400">
                  We'll optimize everything for you
                </p>
              </div>

              <div className="space-y-4">
                {/* Risk Level */}
                <div>
                  <label className="text-sm text-slate-400 mb-3 block">Risk Level</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'low', label: 'Low Risk', color: 'green', desc: 'Safe & Steady' },
                      { value: 'medium', label: 'Medium', color: 'blue', desc: 'Balanced' },
                      { value: 'high', label: 'High Risk', color: 'orange', desc: 'Aggressive' },
                    ].map(risk => (
                      <Button
                        key={risk.value}
                        variant="outline"
                        onClick={() => setRiskLevel(risk.value as any)}
                        className={`h-20 flex flex-col items-center justify-center ${
                          riskLevel === risk.value
                            ? `bg-${risk.color}-500/20 border-${risk.color}-500 ring-2 ring-${risk.color}-500/50`
                            : 'bg-slate-700 border-slate-600'
                        }`}
                      >
                        <span className="font-bold text-white">{risk.label}</span>
                        <span className="text-xs text-slate-400 mt-1">{risk.desc}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Auto Trading */}
                <div
                  onClick={() => setAutoTrading(!autoTrading)}
                  className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                    autoTrading
                      ? 'bg-green-500/10 border-green-500 ring-2 ring-green-500/50'
                      : 'bg-slate-700/50 border-slate-600'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      <div className={`p-2 rounded-lg mr-4 ${
                        autoTrading ? 'bg-green-500/20' : 'bg-slate-600'
                      }`}>
                        <Rocket className={`w-6 h-6 ${
                          autoTrading ? 'text-green-400' : 'text-slate-400'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg mb-1">
                          Enable Auto-Trading
                        </h3>
                        <p className="text-sm text-slate-400 mb-2">
                          Let AI trade 24/7 to reach your ${dailyGoal} daily goal
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Auto profit-taking
                          </Badge>
                          <Badge variant="outline" className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Stop-loss protection
                          </Badge>
                          <Badge variant="outline" className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            24/7 monitoring
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className={`w-12 h-6 rounded-full transition-colors ${
                      autoTrading ? 'bg-green-500' : 'bg-slate-600'
                    } relative`}>
                      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                        autoTrading ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-slate-700/50 rounded-lg p-4 space-y-2">
                  <h4 className="font-medium text-white mb-3">Your Setup Summary</h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Starting Balance</span>
                    <span className="text-white font-medium">${startingAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Daily Target</span>
                    <span className="text-green-400 font-medium">${dailyGoal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Risk Level</span>
                    <span className="text-white font-medium capitalize">{riskLevel}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Auto-Trading</span>
                    <span className={`font-medium ${autoTrading ? 'text-green-400' : 'text-slate-400'}`}>
                      {autoTrading ? 'Enabled' : 'Manual'}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-slate-600 mt-3">
                    <div className="flex items-center text-xs text-slate-400">
                      <Clock className="w-4 h-4 mr-2" />
                      Estimated time to goal: {autoTrading ? '24-48 hours' : '3-5 days'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setStep(2)}
                  variant="outline"
                  className="w-1/3 h-14 text-lg bg-slate-700 border-slate-600"
                >
                  Back
                </Button>
                <Button
                  onClick={handleComplete}
                  className="w-2/3 h-14 text-lg bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  <Rocket className="w-5 h-5 mr-2" />
                  Start Trading!
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
