import express from 'express'
import Stripe from 'stripe'
import { asyncHandler } from '../middleware/errorHandler'

const router = express.Router()

type UserPlanKey = 'free' | 'pro' | 'elite'

const userPlans: Record<UserPlanKey, { discount: number; maxEquityFee: number }> = {
  free: { discount: 0, maxEquityFee: 8.3 },
  pro: { discount: 0.2, maxEquityFee: 8.3 },
  elite: { discount: 0.5, maxEquityFee: 8.3 },
}

interface TradeInput {
  shares: number
  contracts: number
  tradeValue: number
  paperDelivery?: boolean
}

interface TradeFeeBreakdown {
  equityFee: number
  optionFee: number
  secFee: number
  paperFee: number
  subtotal: number
  discountApplied: number
  total: number
}

function calculateTradeFeeWithBreakdown(trade: TradeInput, plan: UserPlanKey = 'free'): TradeFeeBreakdown {
  const { shares, contracts, tradeValue, paperDelivery } = trade
  const userPlan = userPlans[plan] || userPlans.free

  const equityFee = Math.min(shares * 0.000166, userPlan.maxEquityFee)
  const optionFee = contracts * 0.00279
  const secFee = parseFloat(((tradeValue / 1_000_000) * 8).toFixed(2))
  const paperFee = paperDelivery ? 2 : 0

  const subtotal = equityFee + optionFee + secFee + paperFee
  const discountApplied = parseFloat((subtotal * userPlan.discount).toFixed(2))
  const total = parseFloat((subtotal - discountApplied).toFixed(2))

  return { equityFee, optionFee, secFee, paperFee, subtotal: parseFloat(subtotal.toFixed(2)), discountApplied, total }
}

function calculateTradeFee(trade: TradeInput, plan: UserPlanKey = 'free'): number {
  const { shares, contracts, tradeValue, paperDelivery } = trade
  const userPlan = userPlans[plan] || userPlans.free

  // Trading Activity Fee (TAF)
  const equityFee = Math.min(shares * 0.000166, userPlan.maxEquityFee)
  const optionFee = contracts * 0.00279

  // SEC Fee
  const secFee = parseFloat(((tradeValue / 1_000_000) * 8).toFixed(2))

  // Paper Document Fee
  const paperFee = paperDelivery ? 2 : 0

  // Total before discount
  let total = equityFee + optionFee + secFee + paperFee

  // Apply plan discount
  total = parseFloat((total * (1 - userPlan.discount)).toFixed(2))

  return total
}

router.post(
  '/bulk-trades',
  asyncHandler(async (req, res) => {
    const { customerId, trades, userPlan = 'free', dryRun = false, details = false } = req.body as {
      customerId?: string
      trades?: TradeInput[]
      userPlan?: UserPlanKey
      dryRun?: boolean
      details?: boolean
    }

    if (!trades || !Array.isArray(trades)) {
      return res.status(400).json({ error: 'Missing required field: trades' })
    }

    // Calculate fees
    let totalFee = 0
    let breakdown: TradeFeeBreakdown[] | undefined
    if (details) {
      breakdown = trades.map((t) => calculateTradeFeeWithBreakdown(t, userPlan))
      totalFee = breakdown.reduce((sum, b) => sum + b.total, 0)
    } else {
      totalFee = trades.reduce((sum, trade) => sum + calculateTradeFee(trade, userPlan), 0)
    }
    totalFee = parseFloat(totalFee.toFixed(2))

    // Support dry-run mode to compute fees without Stripe
    if (dryRun) {
      return res.json({ success: true, dryRun: true, totalFee, tradeCount: trades.length, userPlan, breakdown })
    }

    if (!customerId) {
      return res.status(400).json({ error: 'Missing required field: customerId' })
    }

    const stripeSecret = process.env['STRIPE_SECRET_KEY']
    if (!stripeSecret) {
      return res.status(500).json({ error: 'Stripe secret key not configured' })
    }
    if (stripeSecret.startsWith('pk_')) {
      return res.status(500).json({ error: 'Stripe secret key misconfigured: received a publishable (pk_) key. Use a secret (sk_) key.' })
    }

    const stripe = new Stripe(stripeSecret)

    try {
      // Create a single invoice item for total fees
      await stripe.invoiceItems.create({
        customer: customerId,
        amount: Math.round(totalFee * 100), // cents
        currency: 'usd',
        description: `Bulk trading fees (${trades.length} trades) for Kairo ${userPlan} plan`,
      })

      // Finalize and auto-charge invoice
      const invoice = await stripe.invoices.create({
        customer: customerId,
        auto_advance: true,
      })

      return res.json({ success: true, invoiceId: invoice.id, totalFee, breakdown })
    } catch (error: any) {
      console.error('Error creating invoice:', error)
      return res.status(500).json({ error: error.message || 'Stripe error' })
    }
  })
)

export default router