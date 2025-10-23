/**
 * Fee and Tax Configuration for KAIRO QUANTUM
 * All fees are in basis points (1 bp = 0.01%) unless otherwise specified
 */

export interface FeeStructure {
  type: 'percentage' | 'fixed' | 'tiered'
  value: number // For percentage: basis points (100 = 1%), for fixed: cents
  min?: number // Minimum fee in cents
  max?: number // Maximum fee in cents
  tiers?: {
    from: number
    to: number
    rate: number // basis points
  }[]
}

export interface TaxConfig {
  enabled: boolean
  automaticTax: boolean // Use Stripe Tax for automatic calculation
  defaultRate: number // Default tax rate in basis points
  taxIdRequired: boolean
}

// Transaction Fee Configuration
export const TRANSACTION_FEES = {
  // Trading Fees
  trading: {
    // Stock trading fees
    stock: {
      type: 'percentage' as const,
      value: 25, // 0.25%
      min: 100, // $1.00 minimum
      max: 10000 // $100 maximum
    },
    // Crypto trading fees
    crypto: {
      type: 'percentage' as const,
      value: 50, // 0.50%
      min: 200, // $2.00 minimum
      max: null // No maximum
    },
    // Options trading fees
    options: {
      type: 'fixed' as const,
      value: 65 // $0.65 per contract
    }
  },

  // Withdrawal Fees
  withdrawal: {
    // Bank transfer (ACH)
    ach: {
      type: 'fixed' as const,
      value: 0 // Free for ACH
    },
    // Wire transfer
    wire: {
      domestic: {
        type: 'fixed' as const,
        value: 2500 // $25.00
      },
      international: {
        type: 'fixed' as const,
        value: 4500 // $45.00
      }
    },
    // Crypto withdrawal
    crypto: {
      type: 'percentage' as const,
      value: 100, // 1%
      min: 500, // $5.00 minimum
      max: 5000 // $50.00 maximum
    },
    // Instant withdrawal (same day)
    instant: {
      type: 'percentage' as const,
      value: 150, // 1.5%
      min: 300, // $3.00 minimum
      max: null
    }
  },

  // Deposit Fees
  deposit: {
    // ACH deposit
    ach: {
      type: 'fixed' as const,
      value: 0 // Free
    },
    // Wire deposit
    wire: {
      type: 'fixed' as const,
      value: 0 // Free
    },
    // Credit card deposit
    creditCard: {
      type: 'percentage' as const,
      value: 290, // 2.9% + $0.30
      fixed: 30
    },
    // Crypto deposit
    crypto: {
      type: 'percentage' as const,
      value: 50, // 0.5%
      min: 100
    }
  },

  // Subscription Fees (in addition to Stripe's fees)
  subscription: {
    // Platform fee on top of Stripe fees
    platform: {
      type: 'percentage' as const,
      value: 0 // No additional platform fee
    }
  },

  // Payout Fees (for creators/affiliates)
  payout: {
    // Standard payout (7-10 days)
    standard: {
      type: 'fixed' as const,
      value: 0 // Free
    },
    // Express payout (1-3 days)
    express: {
      type: 'percentage' as const,
      value: 100, // 1%
      min: 200, // $2.00 minimum
      max: 2000 // $20.00 maximum
    },
    // Instant payout (same day)
    instant: {
      type: 'percentage' as const,
      value: 150, // 1.5%
      min: 300, // $3.00 minimum
      max: 5000 // $50.00 maximum
    }
  },

  // Copy Trading Fees
  copyTrading: {
    // Fee charged to copier
    copier: {
      type: 'percentage' as const,
      value: 0 // Free for copier (creator pays)
    },
    // Fee charged to creator (from profit share)
    creator: {
      type: 'percentage' as const,
      value: 2000, // 20% of profit share
      min: 0
    }
  },

  // Inactivity Fee
  inactivity: {
    // Monthly fee after 12 months of inactivity
    monthly: {
      type: 'fixed' as const,
      value: 1000, // $10.00 per month
      gracePeriod: 365 // days before fee starts
    }
  }
}

// Tax Configuration
export const TAX_CONFIG: TaxConfig = {
  enabled: true,
  automaticTax: true, // Use Stripe Tax
  defaultRate: 0, // 0% default (Stripe Tax will calculate)
  taxIdRequired: false // Don't require tax ID initially
}

// Fee Tier Configuration based on subscription
export const SUBSCRIPTION_FEE_DISCOUNTS = {
  free: {
    tradingFeeDiscount: 0, // 0% discount
    withdrawalFeeDiscount: 0
  },
  pro: {
    tradingFeeDiscount: 2000, // 20% discount (20% of 0.25% = 0.20% effective fee)
    withdrawalFeeDiscount: 5000 // 50% discount
  },
  elite: {
    tradingFeeDiscount: 5000, // 50% discount (50% of 0.25% = 0.125% effective fee)
    withdrawalFeeDiscount: 10000 // 100% discount (free withdrawals)
  },
  enterprise: {
    tradingFeeDiscount: 10000, // 100% discount (free trading)
    withdrawalFeeDiscount: 10000 // 100% discount (free withdrawals)
  }
}

// Geographic Tax Rates (fallback if Stripe Tax not available)
export const GEO_TAX_RATES = {
  US: {
    federal: 0, // No federal sales tax
    states: {
      CA: 725, // 7.25%
      NY: 400, // 4%
      TX: 625, // 6.25%
      FL: 600, // 6%
      // Add more states as needed
    }
  },
  EU: {
    VAT: 2000, // 20% standard VAT (varies by country)
    countries: {
      DE: 1900, // Germany 19%
      FR: 2000, // France 20%
      UK: 2000, // UK 20%
      // Add more countries
    }
  },
  CA: {
    GST: 500, // 5% federal GST
    provinces: {
      ON: 1300, // Ontario HST 13%
      BC: 1200, // BC GST+PST 12%
      QC: 1498, // Quebec GST+QST 14.98%
    }
  }
}

// Fee Calculation Helpers
export const calculateFee = (
  amount: number, // in cents
  feeStructure: FeeStructure,
  subscriptionTier?: string
): number => {
  let fee = 0

  if (feeStructure.type === 'percentage') {
    fee = Math.floor((amount * feeStructure.value) / 10000)

    // Apply subscription discount if applicable
    if (subscriptionTier && SUBSCRIPTION_FEE_DISCOUNTS[subscriptionTier as keyof typeof SUBSCRIPTION_FEE_DISCOUNTS]) {
      const discount = SUBSCRIPTION_FEE_DISCOUNTS[subscriptionTier as keyof typeof SUBSCRIPTION_FEE_DISCOUNTS].tradingFeeDiscount
      fee = Math.floor((fee * (10000 - discount)) / 10000)
    }
  } else if (feeStructure.type === 'fixed') {
    fee = feeStructure.value
  } else if (feeStructure.type === 'tiered' && feeStructure.tiers) {
    // Find applicable tier
    const tier = feeStructure.tiers.find(t => amount >= t.from && amount <= t.to)
    if (tier) {
      fee = Math.floor((amount * tier.rate) / 10000)
    }
  }

  // Apply min/max constraints
  if (feeStructure.min && fee < feeStructure.min) {
    fee = feeStructure.min
  }
  if (feeStructure.max && fee > feeStructure.max) {
    fee = feeStructure.max
  }

  return fee
}

export const calculateTax = (
  amount: number, // in cents
  country: string,
  state?: string
): number => {
  if (!TAX_CONFIG.enabled) return 0

  let taxRate = TAX_CONFIG.defaultRate

  // Use geographic tax rates as fallback
  if (country === 'US' && state && GEO_TAX_RATES.US.states[state as keyof typeof GEO_TAX_RATES.US.states]) {
    taxRate = GEO_TAX_RATES.US.states[state as keyof typeof GEO_TAX_RATES.US.states]
  } else if (country in GEO_TAX_RATES.EU.countries) {
    taxRate = GEO_TAX_RATES.EU.countries[country as keyof typeof GEO_TAX_RATES.EU.countries] || GEO_TAX_RATES.EU.VAT
  } else if (country === 'CA' && state && GEO_TAX_RATES.CA.provinces[state as keyof typeof GEO_TAX_RATES.CA.provinces]) {
    taxRate = GEO_TAX_RATES.CA.provinces[state as keyof typeof GEO_TAX_RATES.CA.provinces]
  }

  return Math.floor((amount * taxRate) / 10000)
}

// Transaction summary helper
export const getTransactionSummary = (
  amount: number,
  type: string,
  subscriptionTier?: string,
  country?: string,
  state?: string
) => {
  let fee = 0
  let tax = 0

  // Calculate fee based on transaction type
  // This would be expanded based on all fee types

  // Calculate tax
  if (country) {
    tax = calculateTax(amount, country, state)
  }

  const total = amount + fee + tax

  return {
    subtotal: amount,
    fee,
    tax,
    total,
    breakdown: {
      amount: (amount / 100).toFixed(2),
      fee: (fee / 100).toFixed(2),
      tax: (tax / 100).toFixed(2),
      total: (total / 100).toFixed(2)
    }
  }
}
