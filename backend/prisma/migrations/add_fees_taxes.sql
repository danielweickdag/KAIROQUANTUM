-- Migration to add fee and tax tracking tables

-- Fee and Tax Transactions table
CREATE TABLE IF NOT EXISTS "FeeTransaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "transactionId" TEXT,
    "type" TEXT NOT NULL, -- 'trading', 'withdrawal', 'deposit', 'payout', 'subscription'
    "subtype" TEXT, -- 'stock', 'crypto', 'ach', 'wire', etc.
    "amount" INTEGER NOT NULL, -- Original amount in cents
    "feeAmount" INTEGER NOT NULL, -- Fee charged in cents
    "taxAmount" INTEGER NOT NULL DEFAULT 0, -- Tax charged in cents
    "totalAmount" INTEGER NOT NULL, -- Total = amount + fee + tax
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "subscriptionTier" TEXT, -- User's tier at time of transaction
    "feeRate" INTEGER, -- Basis points (for percentage fees)
    "taxRate" INTEGER, -- Basis points (for percentage taxes)
    "country" TEXT, -- User's country for tax calculation
    "state" TEXT, -- User's state/province for tax calculation
    "status" TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'refunded', 'failed'
    "metadata" JSONB, -- Additional transaction metadata
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeeTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tax Information table (for users)
CREATE TABLE IF NOT EXISTS "TaxInformation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL UNIQUE,
    "taxId" TEXT, -- Tax ID / EIN / VAT number
    "taxIdType" TEXT, -- 'SSN', 'EIN', 'VAT', 'GST', etc.
    "country" TEXT NOT NULL,
    "state" TEXT,
    "postalCode" TEXT,
    "address" TEXT,
    "city" TEXT,
    "taxExempt" BOOLEAN NOT NULL DEFAULT false,
    "taxExemptReason" TEXT,
    "w9Submitted" BOOLEAN NOT NULL DEFAULT false,
    "w8Submitted" BOOLEAN NOT NULL DEFAULT false,
    "1099Eligible" BOOLEAN NOT NULL DEFAULT false,
    "stripeT

axId" TEXT, -- Stripe Tax ID if using Stripe Tax
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaxInformation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Fee Configuration Override table (for custom fees per user/tier)
CREATE TABLE IF NOT EXISTS "FeeConfigurationOverride" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "subscriptionTier" TEXT,
    "transactionType" TEXT NOT NULL,
    "feeType" TEXT NOT NULL, -- 'percentage', 'fixed', 'tiered'
    "feeValue" INTEGER NOT NULL, -- Basis points or cents
    "minFee" INTEGER,
    "maxFee" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "validFrom" TIMESTAMP(3),
    "validTo" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeeConfigurationOverride_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Payout tracking table
CREATE TABLE IF NOT EXISTS "Payout" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL, -- Amount in cents
    "feeAmount" INTEGER NOT NULL DEFAULT 0,
    "taxAmount" INTEGER NOT NULL DEFAULT 0,
    "netAmount" INTEGER NOT NULL, -- Net after fees and taxes
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "method" TEXT NOT NULL, -- 'ach', 'wire', 'crypto', 'paypal'
    "speed" TEXT NOT NULL DEFAULT 'standard', -- 'standard', 'express', 'instant'
    "status" TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed', 'cancelled'
    "destination" TEXT, -- Bank account, crypto address, etc.
    "stripePayout Id" TEXT, -- Stripe payout ID if applicable
    "processedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Withdrawal tracking table
CREATE TABLE IF NOT EXISTS "Withdrawal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "feeAmount" INTEGER NOT NULL DEFAULT 0,
    "taxAmount" INTEGER NOT NULL DEFAULT 0,
    "netAmount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "method" TEXT NOT NULL, -- 'ach', 'wire', 'crypto'
    "speed" TEXT NOT NULL DEFAULT 'standard',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "destination" TEXT NOT NULL,
    "bankName" TEXT,
    "accountLast4" TEXT,
    "processedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Withdrawal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS "FeeTransaction_userId_idx" ON "FeeTransaction"("userId");
CREATE INDEX IF NOT EXISTS "FeeTransaction_type_idx" ON "FeeTransaction"("type");
CREATE INDEX IF NOT EXISTS "FeeTransaction_createdAt_idx" ON "FeeTransaction"("createdAt");
CREATE INDEX IF NOT EXISTS "FeeTransaction_status_idx" ON "FeeTransaction"("status");

CREATE INDEX IF NOT EXISTS "Payout_userId_idx" ON "Payout"("userId");
CREATE INDEX IF NOT EXISTS "Payout_status_idx" ON "Payout"("status");
CREATE INDEX IF NOT EXISTS "Payout_createdAt_idx" ON "Payout"("createdAt");

CREATE INDEX IF NOT EXISTS "Withdrawal_userId_idx" ON "Withdrawal"("userId");
CREATE INDEX IF NOT EXISTS "Withdrawal_status_idx" ON "Withdrawal"("status");
CREATE INDEX IF NOT EXISTS "Withdrawal_createdAt_idx" ON "Withdrawal"("createdAt");

CREATE INDEX IF NOT EXISTS "FeeConfigurationOverride_userId_idx" ON "FeeConfigurationOverride"("userId");
CREATE INDEX IF NOT EXISTS "FeeConfigurationOverride_active_idx" ON "FeeConfigurationOverride"("active");
