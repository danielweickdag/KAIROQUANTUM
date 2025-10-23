'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calculator,
  Info,
  CheckCircle,
  AlertCircle,
  Crown
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface FeeCalculation {
  amount: number
  fee: number
  tax: number
  total: number
  breakdown: {
    subtotal: string
    fee: string
    tax: string
    total: string
  }
}

export const FeeCalculator: React.FC = () => {
  const [transactionType, setTransactionType] = useState<string>('trading')
  const [amount, setAmount] = useState<string>('1000')
  const [method, setMethod] = useState<string>('stock')
  const [calculation, setCalculation] = useState<FeeCalculation | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const calculateFee = async () => {
    if (!amount || isNaN(parseFloat(amount))) {
      setError('Please enter a valid amount')
      return
    }

    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL

      let endpoint = ''
      let body: any = { amount: parseFloat(amount) }

      switch (transactionType) {
        case 'trading':
          endpoint = '/api/fees/calculate/trading'
          body.assetType = method
          break
        case 'withdrawal':
          endpoint = '/api/fees/calculate/withdrawal'
          body.method = method
          break
        case 'deposit':
          endpoint = '/api/fees/calculate/deposit'
          body.method = method
          break
        case 'payout':
          endpoint = '/api/fees/calculate/payout'
          body.speed = method
          break
      }

      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      })

      const data = await response.json()

      if (data.success) {
        setCalculation(data.calculation)
      } else {
        setError(data.error || 'Failed to calculate fee')
      }
    } catch (err) {
      console.error('Fee calculation error:', err)
      setError('Failed to calculate fee. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      const debounce = setTimeout(() => {
        calculateFee()
      }, 500)
      return () => clearTimeout(debounce)
    }
  }, [amount, transactionType, method])

  const getMethodOptions = () => {
    switch (transactionType) {
      case 'trading':
        return [
          { value: 'stock', label: 'Stock/ETF' },
          { value: 'crypto', label: 'Cryptocurrency' },
          { value: 'options', label: 'Options' }
        ]
      case 'withdrawal':
        return [
          { value: 'ach', label: 'ACH (Free)' },
          { value: 'wire', label: 'Wire Transfer' },
          { value: 'crypto', label: 'Crypto' },
          { value: 'instant', label: 'Instant (Same Day)' }
        ]
      case 'deposit':
        return [
          { value: 'ach', label: 'ACH (Free)' },
          { value: 'wire', label: 'Wire Transfer (Free)' },
          { value: 'creditCard', label: 'Credit/Debit Card' },
          { value: 'crypto', label: 'Cryptocurrency' }
        ]
      case 'payout':
        return [
          { value: 'standard', label: 'Standard (Free, 7-10 days)' },
          { value: 'express', label: 'Express (1-3 days)' },
          { value: 'instant', label: 'Instant (Same day)' }
        ]
      default:
        return []
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="w-5 h-5" />
              <span>Fee Calculator</span>
            </CardTitle>
            <CardDescription>
              Calculate fees before you transact
            </CardDescription>
          </div>
          <Badge variant="secondary" className="flex items-center space-x-1">
            <Crown className="w-3 h-3" />
            <span>Pro members save up to 50%</span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Transaction Type */}
        <div className="space-y-2">
          <Label htmlFor="transaction-type">Transaction Type</Label>
          <Select value={transactionType} onValueChange={setTransactionType}>
            <SelectTrigger id="transaction-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trading">Trading</SelectItem>
              <SelectItem value="withdrawal">Withdrawal</SelectItem>
              <SelectItem value="deposit">Deposit</SelectItem>
              <SelectItem value="payout">Payout (Creators)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Amount */}
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (USD)</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-10"
              placeholder="1000.00"
              step="0.01"
              min="0"
            />
          </div>
        </div>

        {/* Method/Asset Type */}
        <div className="space-y-2">
          <Label htmlFor="method">
            {transactionType === 'trading' ? 'Asset Type' :
             transactionType === 'payout' ? 'Speed' : 'Method'}
          </Label>
          <Select value={method} onValueChange={setMethod}>
            <SelectTrigger id="method">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {getMethodOptions().map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Calculation Result */}
        {calculation && (
          <div className="border rounded-lg p-4 space-y-3 bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">${calculation.breakdown.subtotal}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Fee:</span>
              <span className={cn(
                "font-medium",
                parseFloat(calculation.breakdown.fee) === 0 ? "text-green-600" : "text-orange-600"
              )}>
                {parseFloat(calculation.breakdown.fee) === 0 ? 'FREE' : `$${calculation.breakdown.fee}`}
              </span>
            </div>

            {parseFloat(calculation.breakdown.tax) > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Tax:</span>
                <span className="font-medium">${calculation.breakdown.tax}</span>
              </div>
            )}

            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">
                  {transactionType === 'withdrawal' || transactionType === 'payout'
                    ? 'You Receive:'
                    : 'Total:'}
                </span>
                <span className="text-2xl font-bold text-gray-900">
                  ${calculation.breakdown.total}
                </span>
              </div>
            </div>

            {/* Savings Indicator */}
            {parseFloat(calculation.breakdown.fee) === 0 && (
              <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 p-2 rounded">
                <CheckCircle className="w-4 h-4" />
                <span>No fees! You're saving money.</span>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="flex items-center space-x-2 text-sm text-red-600 bg-red-50 p-3 rounded">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Info Box */}
        <div className="flex items-start space-x-2 text-sm text-gray-600 bg-gray-50 p-3 rounded">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p>
            Fees vary based on your subscription tier. Upgrade to Pro or Elite to save up to 50% on trading fees and get FREE withdrawals.
          </p>
        </div>

        {/* CTA Button */}
        <Button
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          onClick={() => window.location.href = '/pricing'}
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Upgrade to Save on Fees
        </Button>
      </CardContent>
    </Card>
  )
}

export default FeeCalculator
