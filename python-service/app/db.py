"""
Database operations module
Handles PostgreSQL connections and CRUD operations
"""

import asyncpg
import os
import json
from datetime import datetime, date
from typing import Dict, List, Optional
from uuid import uuid4

# Database connection pool
_pool = None

async def get_pool():
    """Get or create database connection pool"""
    global _pool
    if _pool is None:
        database_url = os.getenv(
            "DATABASE_URL",
            "postgresql://username:password@localhost:5432/kairo_db"
        )
        _pool = await asyncpg.create_pool(database_url, min_size=2, max_size=10)
    return _pool

async def check_connection() -> bool:
    """Check if database connection is healthy"""
    try:
        pool = await get_pool()
        async with pool.acquire() as conn:
            await conn.fetchval("SELECT 1")
        return True
    except Exception as e:
        print(f"Database connection check failed: {e}")
        return False

async def create_trade(trade_data: Dict) -> Dict:
    """
    Create a new trade record
    """
    pool = await get_pool()
    async with pool.acquire() as conn:
        trade_id = uuid4()

        query = """
            INSERT INTO trades (
                id, user_id, symbol, side, qty, price,
                executed_at, external_id, raw, created_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING id, user_id, symbol, side, qty, price, executed_at
        """

        row = await conn.fetchrow(
            query,
            trade_id,
            trade_data["user_id"],
            trade_data["symbol"],
            trade_data["side"],
            trade_data["qty"],
            trade_data["price"],
            trade_data["executed_at"],
            trade_data.get("external_id"),
            json.dumps(trade_data.get("raw", {})),
            datetime.utcnow()
        )

        return dict(row)

async def get_user_trades(
    user_id: str,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None
) -> List[Dict]:
    """
    Get all trades for a user within a date range
    """
    pool = await get_pool()
    async with pool.acquire() as conn:
        query = """
            SELECT id, user_id, symbol, side, qty, price,
                   (qty * price) as value, executed_at, created_at
            FROM trades
            WHERE user_id = $1
        """
        params = [user_id]

        if start_date:
            query += " AND DATE(executed_at) >= $2"
            params.append(start_date)

        if end_date:
            query += f" AND DATE(executed_at) <= ${len(params) + 1}"
            params.append(end_date)

        query += " ORDER BY executed_at ASC"

        rows = await conn.fetch(query, *params)
        return [dict(row) for row in rows]

async def create_compliance_audit(audit_data: Dict) -> Dict:
    """
    Create a compliance audit record
    """
    pool = await get_pool()
    async with pool.acquire() as conn:
        audit_id = uuid4()

        query = """
            INSERT INTO compliance_audit (
                id, user_id, trade_id, check_name, status,
                reason, metadata, created_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id, check_name, status, reason
        """

        row = await conn.fetchrow(
            query,
            audit_id,
            audit_data.get("user_id"),
            audit_data.get("trade_id"),
            audit_data["check_name"],
            audit_data["status"],
            audit_data.get("reason"),
            json.dumps(audit_data.get("metadata", {})),
            datetime.utcnow()
        )

        return dict(row)

async def get_compliance_audits(
    user_id: str,
    limit: int = 100
) -> List[Dict]:
    """
    Get compliance audit history for a user
    """
    pool = await get_pool()
    async with pool.acquire() as conn:
        query = """
            SELECT id, user_id, trade_id, check_name, status,
                   reason, metadata, created_at
            FROM compliance_audit
            WHERE user_id = $1
            ORDER BY created_at DESC
            LIMIT $2
        """

        rows = await conn.fetch(query, user_id, limit)
        return [dict(row) for row in rows]

async def get_or_create_benchmark(symbol: str, date: date) -> Optional[Dict]:
    """
    Get benchmark data for a symbol on a specific date
    """
    pool = await get_pool()
    async with pool.acquire() as conn:
        query = """
            SELECT id, symbol, date, open, high, low, close, volume
            FROM benchmarks
            WHERE symbol = $1 AND date = $2
        """

        row = await conn.fetchrow(query, symbol, date)
        return dict(row) if row else None

async def upsert_benchmark(benchmark_data: Dict) -> Dict:
    """
    Insert or update benchmark data
    """
    pool = await get_pool()
    async with pool.acquire() as conn:
        query = """
            INSERT INTO benchmarks (id, symbol, date, open, high, low, close, volume, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT (symbol, date)
            DO UPDATE SET
                open = EXCLUDED.open,
                high = EXCLUDED.high,
                low = EXCLUDED.low,
                close = EXCLUDED.close,
                volume = EXCLUDED.volume
            RETURNING id, symbol, date, close
        """

        benchmark_id = uuid4()
        row = await conn.fetchrow(
            query,
            benchmark_id,
            benchmark_data["symbol"],
            benchmark_data["date"],
            benchmark_data.get("open"),
            benchmark_data.get("high"),
            benchmark_data.get("low"),
            benchmark_data["close"],
            benchmark_data.get("volume"),
            datetime.utcnow()
        )

        return dict(row)

async def get_benchmark_range(
    symbol: str,
    start_date: date,
    end_date: date
) -> List[Dict]:
    """
    Get benchmark data for a date range
    """
    pool = await get_pool()
    async with pool.acquire() as conn:
        query = """
            SELECT symbol, date, open, high, low, close, volume
            FROM benchmarks
            WHERE symbol = $1
              AND date >= $2
              AND date <= $3
            ORDER BY date ASC
        """

        rows = await conn.fetch(query, symbol, start_date, end_date)
        return [dict(row) for row in rows]

async def update_user_subscription(user_id: str, subscription_data: Dict):
    """
    Update or create user subscription record
    """
    pool = await get_pool()
    async with pool.acquire() as conn:
        query = """
            INSERT INTO user_subscriptions (
                id, user_id, stripe_subscription_id, tier,
                status, current_period_end, created_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (user_id)
            DO UPDATE SET
                stripe_subscription_id = EXCLUDED.stripe_subscription_id,
                tier = EXCLUDED.tier,
                status = EXCLUDED.status,
                current_period_end = EXCLUDED.current_period_end
            RETURNING id
        """

        sub_id = uuid4()
        await conn.fetchrow(
            query,
            sub_id,
            user_id,
            subscription_data.get("stripe_subscription_id"),
            subscription_data.get("tier"),
            subscription_data.get("status"),
            subscription_data.get("current_period_end"),
            datetime.utcnow()
        )

async def handle_stripe_event(payload: Dict) -> Dict:
    """
    Handle incoming Stripe webhook events
    """
    event_type = payload.get("type")
    data = payload.get("data", {}).get("object", {})

    if event_type == "customer.subscription.created":
        # Extract user ID from metadata
        user_id = data.get("metadata", {}).get("user_id")
        if user_id:
            await update_user_subscription(user_id, {
                "stripe_subscription_id": data.get("id"),
                "tier": data.get("metadata", {}).get("tier", "pro"),
                "status": data.get("status"),
                "current_period_end": datetime.fromtimestamp(data.get("current_period_end"))
            })

    elif event_type == "customer.subscription.updated":
        user_id = data.get("metadata", {}).get("user_id")
        if user_id:
            await update_user_subscription(user_id, {
                "stripe_subscription_id": data.get("id"),
                "tier": data.get("metadata", {}).get("tier", "pro"),
                "status": data.get("status"),
                "current_period_end": datetime.fromtimestamp(data.get("current_period_end"))
            })

    elif event_type == "customer.subscription.deleted":
        user_id = data.get("metadata", {}).get("user_id")
        if user_id:
            await update_user_subscription(user_id, {
                "stripe_subscription_id": data.get("id"),
                "tier": "free",
                "status": "canceled",
                "current_period_end": datetime.fromtimestamp(data.get("current_period_end"))
            })

    return {
        "status": "processed",
        "event_type": event_type
    }

async def close_pool():
    """Close database connection pool"""
    global _pool
    if _pool:
        await _pool.close()
        _pool = None
