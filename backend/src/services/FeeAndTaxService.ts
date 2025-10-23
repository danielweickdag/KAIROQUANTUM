import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import {
  TRANSACTION_FEES,
  TAX_CONFIG,
  calculateFee,
  calculateTax,
  SUBSCRIPTION_FEE_DISCOUNTS,
  FeeStructure
} from '../config/fees';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia' as any,
});

export interface TransactionFeeCalculation {
  amount: number; // Original amount in cents
  fee: number; // Fee in cents
  tax: number; // Tax in cents
  total: number; // Total in cents
  feeRate?: number; // Basis points
  taxRate?: number; // Basis points
  breakdown: {
    subtotal: string;
    fee: string;
    tax: string;
    total: string;
  };
}

export class FeeAndTaxService {
  /**
   * Calculate trading fee
   */
  static async calculateTradingFee(
    userId: string,
    amount: number,
    assetType: 'stock' | 'crypto' | 'options',
    quantity?: number
  ): Promise<TransactionFeeCalculation> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { subscriptionPlan: true }
    });

    const subscriptionTier = user?.subscriptionPlan || 'free';
    let feeStructure: FeeStructure;

    if (assetType === 'options' && quantity) {
      // Options have per-contract fees
      const fee = TRANSACTION_FEES.trading.options.value * quantity;
      return {
        amount,
        fee,
        tax: 0,
        total: amount + fee,
        breakdown: {
          subtotal: (amount / 100).toFixed(2),
          fee: (fee / 100).toFixed(2),
          tax: '0.00',
          total: ((amount + fee) / 100).toFixed(2)
        }
      };
    }

    feeStructure = TRANSACTION_FEES.trading[assetType] as FeeStructure;
    const fee = calculateFee(amount, feeStructure, subscriptionTier);

    // Apply subscription discount
    const discount = SUBSCRIPTION_FEE_DISCOUNTS[subscriptionTier as keyof typeof SUBSCRIPTION_FEE_DISCOUNTS]?.tradingFeeDiscount || 0;
    const discountedFee = Math.floor((fee * (10000 - discount)) / 10000);

    return {
      amount,
      fee: discountedFee,
      tax: 0, // Trading fees typically not taxed
      total: amount + discountedFee,
      feeRate: feeStructure.value,
      breakdown: {
        subtotal: (amount / 100).toFixed(2),
        fee: (discountedFee / 100).toFixed(2),
        tax: '0.00',
        total: ((amount + discountedFee) / 100).toFixed(2)
      }
    };
  }

  /**
   * Calculate withdrawal fee
   */
  static async calculateWithdrawalFee(
    userId: string,
    amount: number,
    method: 'ach' | 'wire' | 'crypto' | 'instant',
    wireDomestic?: boolean
  ): Promise<TransactionFeeCalculation> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { subscriptionPlan: true }
    });

    const subscriptionTier = user?.subscriptionPlan || 'free';
    let feeStructure: FeeStructure;

    if (method === 'wire') {
      feeStructure = wireDomestic
        ? TRANSACTION_FEES.withdrawal.wire.domestic
        : TRANSACTION_FEES.withdrawal.wire.international;
    } else if (method === 'instant') {
      feeStructure = TRANSACTION_FEES.withdrawal.instant;
    } else {
      feeStructure = TRANSACTION_FEES.withdrawal[method] as FeeStructure;
    }

    let fee = calculateFee(amount, feeStructure);

    // Apply subscription discount
    const discount = SUBSCRIPTION_FEE_DISCOUNTS[subscriptionTier as keyof typeof SUBSCRIPTION_FEE_DISCOUNTS]?.withdrawalFeeDiscount || 0;
    fee = Math.floor((fee * (10000 - discount)) / 10000);

    return {
      amount,
      fee,
      tax: 0,
      total: amount + fee,
      breakdown: {
        subtotal: (amount / 100).toFixed(2),
        fee: (fee / 100).toFixed(2),
        tax: '0.00',
        total: ((amount + fee) / 100).toFixed(2)
      }
    };
  }

  /**
   * Calculate deposit fee
   */
  static async calculateDepositFee(
    userId: string,
    amount: number,
    method: 'ach' | 'wire' | 'creditCard' | 'crypto'
  ): Promise<TransactionFeeCalculation> {
    const feeStructure = TRANSACTION_FEES.deposit[method] as FeeStructure;
    let fee = calculateFee(amount, feeStructure);

    // Credit card has additional fixed fee
    if (method === 'creditCard' && 'fixed' in TRANSACTION_FEES.deposit.creditCard) {
      fee += TRANSACTION_FEES.deposit.creditCard.fixed || 0;
    }

    return {
      amount,
      fee,
      tax: 0,
      total: amount + fee,
      breakdown: {
        subtotal: (amount / 100).toFixed(2),
        fee: (fee / 100).toFixed(2),
        tax: '0.00',
        total: ((amount + fee) / 100).toFixed(2)
      }
    };
  }

  /**
   * Calculate payout fee
   */
  static async calculatePayoutFee(
    userId: string,
    amount: number,
    speed: 'standard' | 'express' | 'instant'
  ): Promise<TransactionFeeCalculation> {
    const feeStructure = TRANSACTION_FEES.payout[speed] as FeeStructure;
    const fee = calculateFee(amount, feeStructure);

    return {
      amount,
      fee,
      tax: 0,
      total: amount - fee, // Payout fee is deducted from amount
      breakdown: {
        subtotal: (amount / 100).toFixed(2),
        fee: (fee / 100).toFixed(2),
        tax: '0.00',
        total: ((amount - fee) / 100).toFixed(2)
      }
    };
  }

  /**
   * Calculate tax using Stripe Tax (automatic) or fallback to manual calculation
   */
  static async calculateTaxWithStripe(
    userId: string,
    amount: number,
    productType: string
  ): Promise<number> {
    if (!TAX_CONFIG.enabled || !TAX_CONFIG.automaticTax) {
      return 0;
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          email: true,
          stripeCustomerId: true
        }
      });

      if (!user) throw new Error('User not found');

      // Get tax information
      const taxInfo = await prisma.taxInformation.findUnique({
        where: { userId }
      });

      // Use Stripe Tax API for automatic calculation
      const calculation = await stripe.tax.calculations.create({
        currency: 'usd',
        customer: user.stripeCustomerId || undefined,
        line_items: [
          {
            amount,
            reference: `${productType}-${userId}`,
          },
        ],
        customer_details: {
          address: taxInfo ? {
            country: taxInfo.country,
            state: taxInfo.state || undefined,
            postal_code: taxInfo.zipCode || undefined,
            city: taxInfo.city || undefined,
            line1: taxInfo.address || undefined,
          } : undefined,
          address_source: 'shipping',
        },
      });

      return calculation.tax_amount_exclusive;
    } catch (error) {
      console.error('Stripe Tax calculation error:', error);

      // Fallback to manual calculation
      const taxInfo = await prisma.taxInformation.findUnique({
        where: { userId }
      });

      if (taxInfo) {
        return calculateTax(amount, taxInfo.country, taxInfo.state || undefined);
      }

      return 0;
    }
  }

  /**
   * Record fee transaction
   */
  static async recordFeeTransaction(
    userId: string,
    transactionType: string,
    subtype: string | null,
    amount: number,
    feeAmount: number,
    taxAmount: number,
    additionalMetadata?: any
  ) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { subscriptionPlan: true }
    });

    const taxInfo = await prisma.taxInformation.findUnique({
      where: { userId }
    });

    return await prisma.feeTransaction.create({
      data: {
        userId,
        transactionType: transactionType as any,
        amount,
        fee: feeAmount,
        tax: taxAmount,
        total: amount + feeAmount + taxAmount,
        currency: 'USD',
        metadata: {
          subtype,
          subscriptionTier: user?.subscriptionPlan || 'free',
          country: taxInfo?.country || null,
          state: taxInfo?.state || null,
          status: 'completed',
          ...additionalMetadata
        }
      }
    });
  }

  /**
   * Create withdrawal
   */
  static async createWithdrawal(
    userId: string,
    amount: number,
    method: string,
    speed: string,
    destination: string,
    metadata?: any
  ) {
    const feeCalc = await this.calculateWithdrawalFee(
      userId,
      amount,
      method as any,
      method === 'wire'
    );

    const withdrawal = await prisma.withdrawal.create({
      data: {
        userId,
        amount,
        fee: feeCalc.fee,
        total: amount - feeCalc.fee - feeCalc.tax,
        method: method.toUpperCase().replace(/-/g, '_') as any,
        destination,
        status: 'PENDING',
        metadata: {
          speed,
          currency: 'USD',
          tax: feeCalc.tax,
          ...metadata
        }
      }
    });

    // Record fee transaction
    await this.recordFeeTransaction(
      userId,
      'withdrawal',
      method,
      amount,
      feeCalc.fee,
      feeCalc.tax,
      { withdrawalId: withdrawal.id, ...metadata }
    );

    return withdrawal;
  }

  /**
   * Create payout
   */
  static async createPayout(
    userId: string,
    amount: number,
    method: string,
    speed: string,
    destination: string,
    metadata?: any
  ) {
    const feeCalc = await this.calculatePayoutFee(
      userId,
      amount,
      speed as any
    );

    const payout = await prisma.payout.create({
      data: {
        userId,
        amount,
        fee: feeCalc.fee,
        total: amount - feeCalc.fee - feeCalc.tax,
        method: method.toUpperCase() as any,
        destination,
        status: 'PENDING',
        metadata: {
          speed,
          currency: 'USD',
          tax: feeCalc.tax,
          ...metadata
        }
      }
    });

    // Record fee transaction
    await this.recordFeeTransaction(
      userId,
      'payout',
      method,
      amount,
      feeCalc.fee,
      feeCalc.tax,
      { payoutId: payout.id, ...metadata }
    );

    return payout;
  }

  /**
   * Get fee summary for user
   */
  static async getUserFeeSummary(userId: string, startDate?: Date, endDate?: Date) {
    const where: any = { userId };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const transactions = await prisma.feeTransaction.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    const summary = {
      totalFees: 0,
      totalTaxes: 0,
      byType: {} as Record<string, { count: number; fees: number; taxes: number }>,
      transactions: transactions.map(t => ({
        id: t.id,
        type: t.transactionType,
        subtype: (t.metadata as any)?.subtype || null,
        amount: (t.amount / 100).toFixed(2),
        fee: (t.fee / 100).toFixed(2),
        tax: (t.tax / 100).toFixed(2),
        total: (t.total / 100).toFixed(2),
        date: t.createdAt
      }))
    };

    transactions.forEach(t => {
      summary.totalFees += t.fee;
      summary.totalTaxes += t.tax;

      if (!summary.byType[t.transactionType]) {
        summary.byType[t.transactionType] = { count: 0, fees: 0, taxes: 0 };
      }
      summary.byType[t.transactionType].count++;
      summary.byType[t.transactionType].fees += t.fee;
      summary.byType[t.transactionType].taxes += t.tax;
    });

    return {
      ...summary,
      totalFeesFormatted: (summary.totalFees / 100).toFixed(2),
      totalTaxesFormatted: (summary.totalTaxes / 100).toFixed(2),
      byType: Object.entries(summary.byType).reduce((acc, [type, data]) => {
        acc[type] = {
          ...data,
          feesFormatted: (data.fees / 100).toFixed(2),
          taxesFormatted: (data.taxes / 100).toFixed(2)
        };
        return acc;
      }, {} as any)
    };
  }
}
