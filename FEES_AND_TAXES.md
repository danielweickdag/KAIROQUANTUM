# KAIRO QUANTUM - Fees and Taxes Documentation

Complete fee structure and tax handling for all transactions, withdrawals, and payouts.

---

## 📊 Fee Structure Overview

### Trading Fees

#### Stock Trading
- **Base Rate**: 0.25% of trade value
- **Minimum**: $1.00
- **Maximum**: $100.00
- **Pro Discount**: 20% off (0.20% effective)
- **Elite Discount**: 50% off (0.125% effective)
- **Enterprise**: FREE

#### Crypto Trading
- **Base Rate**: 0.50% of trade value
- **Minimum**: $2.00
- **Maximum**: None
- **Discounts**: Same as stock trading

#### Options Trading
- **Per Contract**: $0.65
- **No minimum/maximum**
- **Discounts apply based on tier**

---

### Withdrawal Fees

#### ACH (Bank Transfer)
- **Fee**: FREE
- **Processing Time**: 3-5 business days
- **Limits**: $10 minimum, $50,000 maximum per day

#### Wire Transfer (Domestic)
- **Fee**: $25.00
- **Processing Time**: Same business day
- **Limits**: $1,000 minimum, $250,000 maximum

#### Wire Transfer (International)
- **Fee**: $45.00
- **Processing Time**: 1-2 business days
- **Limits**: $5,000 minimum

#### Crypto Withdrawal
- **Fee**: 1% of amount
- **Minimum**: $5.00
- **Maximum**: $50.00
- **Processing Time**: 10-30 minutes

#### Instant Withdrawal (Same Day ACH)
- **Fee**: 1.5% of amount
- **Minimum**: $3.00
- **Maximum**: None
- **Processing Time**: Within 2 hours

**Tier Discounts on Withdrawals:**
- **Pro**: 50% off all withdrawal fees
- **Elite**: FREE withdrawals
- **Enterprise**: FREE withdrawals

---

### Deposit Fees

#### ACH Deposit
- **Fee**: FREE
- **Processing**: 3-5 business days

#### Wire Deposit
- **Fee**: FREE
- **Processing**: Same day

#### Credit/Debit Card
- **Fee**: 2.9% + $0.30
- **Processing**: Instant
- **Note**: Standard payment processing fees

#### Crypto Deposit
- **Fee**: 0.5% of amount
- **Minimum**: $1.00
- **Processing**: After 3 confirmations

---

### Payout Fees (For Creators/Affiliates)

#### Standard Payout
- **Fee**: FREE
- **Processing**: 7-10 business days
- **Minimum**: $50.00

#### Express Payout
- **Fee**: 1% of amount
- **Minimum Fee**: $2.00
- **Maximum Fee**: $20.00
- **Processing**: 1-3 business days
- **Minimum Payout**: $100.00

#### Instant Payout
- **Fee**: 1.5% of amount
- **Minimum Fee**: $3.00
- **Maximum Fee**: $50.00
- **Processing**: Same day
- **Minimum Payout**: $500.00

---

### Copy Trading Fees

#### For Copiers
- **Fee**: FREE
- **Note**: Only pay standard trading fees

#### For Creators (from profit share)
- **Platform Fee**: 20% of your profit share
- **Example**: If you earn $100 from a copier's profit, you receive $80

---

### Subscription Fees

| Plan | Monthly | Annual | Stripe Fee* |
|------|---------|--------|-------------|
| Free | $0 | $0 | N/A |
| Pro | $49 | $490 | 2.9% + $0.30 |
| Elite | $299 | $2,990 | 2.9% + $0.30 |
| Enterprise | $199+ | Custom | 2.9% + $0.30 |

*Stripe fees are included in the price you pay

---

### Inactivity Fee

- **Amount**: $10.00 per month
- **Triggered After**: 12 months of no activity
- **Grace Period**: 365 days
- **How to Avoid**: Make any trade, deposit, or withdrawal

---

## 💰 Tax Handling

### Automatic Tax Calculation

KAIRO QUANTUM uses **Stripe Tax** for automatic, compliant tax calculation based on:
- Your location (country, state/province)
- Product type
- Current tax rates
- Tax exemptions (if applicable)

### Tax Rates by Region

#### United States (Sales Tax)
| State | Rate |
|-------|------|
| California | 7.25% |
| New York | 4.00% |
| Texas | 6.25% |
| Florida | 6.00% |
| *Varies by state* | *See full list in settings* |

#### European Union (VAT)
| Country | Rate |
|---------|------|
| Germany | 19% |
| France | 20% |
| UK | 20% |
| *Varies by country* | *See full list* |

#### Canada (GST/HST)
| Province | Rate |
|----------|------|
| Ontario (HST) | 13% |
| British Columbia (GST+PST) | 12% |
| Quebec (GST+QST) | 14.98% |

### Tax-Exempt Users

If you are tax-exempt:
1. Go to Settings → Tax Information
2. Upload proof of tax exemption
3. Enter your tax exemption ID
4. Wait for verification (1-2 business days)

---

## 🔍 Fee Transparency

### How to View Fees

1. **Before Transaction**: Fees are shown in the confirmation dialog
2. **Transaction History**: View all fees paid in Dashboard → Fees
3. **Monthly Statement**: Detailed breakdown emailed monthly
4. **API Access**: Query `/api/fees/summary` for programmatic access

### Fee Breakdown Example

**$1,000 Stock Trade (Pro Member)**:
```
Trade Amount:        $1,000.00
Trading Fee (0.20%): $    2.00
Tax (if applicable): $    0.00
─────────────────────────────
Total:               $1,002.00
```

**$5,000 Withdrawal (Pro Member, Instant)**:
```
Withdrawal Amount:   $5,000.00
Instant Fee (1.5%):  $   75.00
50% Tier Discount:   $  -37.50
Tax:                 $    0.00
─────────────────────────────
Total Fee:           $   37.50
You Receive:         $4,962.50
```

---

## 📈 Fee Reduction Strategies

### 1. Upgrade Your Tier
- **Pro**: Save 20% on trading, 50% on withdrawals
- **Elite**: Save 50% on trading, FREE withdrawals
- **Enterprise**: FREE trading, FREE withdrawals

### 2. Use ACH Instead of Wire
- ACH is always FREE vs $25-$45 for wire

### 3. Plan Your Withdrawals
- Use standard (FREE) instead of instant (1.5%)
- Elite members get FREE instant withdrawals

### 4. Batch Transactions
- Fewer large trades = fewer minimum fees

### 5. Annual Subscription
- Save 25% vs monthly payments

---

## 🧾 Tax Reporting

### 1099 Forms (US Users)

If you earn $600+ in a year from:
- Copy trading (as creator)
- Affiliate commissions
- Referral bonuses

You will receive a **1099-MISC** or **1099-K** form by January 31st.

### Tax Information Required

Before payouts, you must provide:
- **US Citizens**: W-9 form (SSN or EIN)
- **Non-US**: W-8BEN form
- **Businesses**: W-9 with EIN

Go to Settings → Tax Information to submit.

### Trading Tax Forms

- **Form 1099-B**: For stock/options trades (if $20K+ volume)
- **Crypto Tax Report**: CSV export available for crypto trades

### International Users

Tax treaties may apply. Consult with a tax professional in your country.

---

## 🔧 API Endpoints

### Calculate Fees

```http
POST /api/fees/calculate/trading
Content-Type: application/json
Authorization: Bearer {token}

{
  "amount": 1000.00,
  "assetType": "stock"
}

Response:
{
  "success": true,
  "calculation": {
    "amount": 100000,
    "fee": 200,
    "tax": 0,
    "total": 100200,
    "breakdown": {
      "subtotal": "1000.00",
      "fee": "2.00",
      "tax": "0.00",
      "total": "1002.00"
    }
  }
}
```

### Get Fee Schedule

```http
GET /api/fees/schedule
Authorization: Bearer {token}

Response: Complete fee schedule with your tier discounts
```

### Get Fee Summary

```http
GET /api/fees/summary?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer {token}

Response: All fees paid in date range
```

---

## ❓ FAQs

### Are fees charged on failed transactions?
No. Fees are only charged on successful transactions.

### Can I get a refund on fees?
Fees are non-refundable except in cases of system error.

### Do you charge for deposits?
ACH and wire deposits are FREE. Credit cards have standard processing fees.

### How are crypto fees calculated?
Based on the USD value at the time of transaction.

### Do subscription discounts apply retroactively?
Yes. Upgrade today and get discounts on all future transactions.

### Where do my fees go?
Fees cover:
- Payment processing (Stripe, banks)
- Platform maintenance
- Customer support
- Security and compliance
- Feature development

### Can I see a full history of fees paid?
Yes. Go to Dashboard → Fees → History or use the API endpoint `/api/fees/summary`.

---

## 📞 Support

Questions about fees or taxes?
- **Email**: fees@kairoquantum.com
- **Phone**: 1-800-KAIRO-TAX
- **Live Chat**: Available 24/7 in app
- **FAQ**: https://docs.kairoquantum.com/fees

---

**Last Updated**: 2025-10-23
**Version**: 1.0.0
**Effective Date**: 2025-11-01

**Note**: Fees and rates are subject to change with 30 days notice. All registered users will be notified via email of any fee changes.
