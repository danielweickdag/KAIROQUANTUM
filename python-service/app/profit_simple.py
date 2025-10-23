"""
Simple profit calculation module
Clean pandas-based approach for comparative analysis
Based on user's implementation pattern
"""

import pandas as pd
from typing import Dict, Optional
from datetime import datetime, date
from . import db


async def get_user_vs_benchmark(
    user_id: str,
    benchmark_symbol: str = "SPY",
    start_date: Optional[date] = None,
    end_date: Optional[date] = None
) -> Dict:
    """
    Compare user trading performance vs benchmark
    Clean pandas-based calculation

    Args:
        user_id: User's unique identifier
        benchmark_symbol: Benchmark ticker (SPY, QQQ, etc.)
        start_date: Optional start date filter
        end_date: Optional end date filter

    Returns:
        Dict with user PnL, returns, and comparison vs benchmark
    """
    # Fetch user trades
    trades_list = await db.get_user_trades(user_id, start_date, end_date)

    if not trades_list:
        return {"error": "no_trades"}

    # Convert to pandas DataFrame
    trades = pd.DataFrame(trades_list)

    # Compute realized pnl per symbol (simplified)
    trades['signed_value'] = trades.apply(
        lambda r: r['qty'] * r['price'] * (1 if r['side'].lower() == 'sell' else -1),
        axis=1
    )

    # PnL by symbol
    pnl = trades.groupby('symbol')['signed_value'].sum().to_dict()
    total_user_pnl = float(trades['signed_value'].sum())

    # Compute user return percent vs invested
    buy_trades = trades[trades['side'].str.lower() == 'buy']
    invested = float(buy_trades['value'].sum()) if not buy_trades.empty else 0

    user_return_pct = (total_user_pnl / invested * 100) if invested > 0 else 0.0

    # Determine date range from trades if not provided
    if trades['executed_at'].dtype == 'object':
        trades['executed_at'] = pd.to_datetime(trades['executed_at'])

    actual_start = trades['executed_at'].min().date()
    actual_end = trades['executed_at'].max().date()

    # Benchmark return: pull from cached benchmarks
    bench_df_list = await db.fetch_benchmark_range(benchmark_symbol, actual_start, actual_end)

    if not bench_df_list:
        bench_return_pct = None
    else:
        bench_df = pd.DataFrame(bench_df_list)
        if bench_df.empty or len(bench_df) < 2:
            bench_return_pct = None
        else:
            first_close = float(bench_df.iloc[0]['close'])
            last_close = float(bench_df.iloc[-1]['close'])
            bench_return_pct = ((last_close - first_close) / first_close) * 100

    # Calculate difference
    difference_pct = None
    if bench_return_pct is not None:
        difference_pct = user_return_pct - bench_return_pct

    return {
        "user_pnl": round(total_user_pnl, 2),
        "user_return_pct": round(user_return_pct, 2),
        "benchmark_symbol": benchmark_symbol,
        "benchmark_return_pct": round(bench_return_pct, 2) if bench_return_pct is not None else None,
        "difference_pct": round(difference_pct, 2) if difference_pct is not None else None,
        "per_symbol_pnl": {k: round(v, 2) for k, v in pnl.items()},
        "timeframe": {
            "start": actual_start.isoformat(),
            "end": actual_end.isoformat(),
            "days": (actual_end - actual_start).days
        },
        "invested": round(invested, 2)
    }


async def recompute_user_metrics(user_id: str) -> Dict:
    """
    Schedule a job to recompute cached metrics
    """
    # Get metrics using simplified calculation
    metrics = await get_user_vs_benchmark(user_id)

    # Cache the results
    await db.cache_user_metrics(user_id, metrics)

    return metrics


async def get_portfolio_summary(user_id: str) -> Dict:
    """
    Get comprehensive portfolio summary
    Includes per-symbol breakdown and overall stats
    """
    trades_list = await db.fetch_trades_for_user(user_id)

    if not trades_list:
        return {
            "user_id": user_id,
            "total_trades": 0,
            "symbols_traded": [],
            "total_invested": 0,
            "total_realized": 0,
            "net_pnl": 0,
            "return_pct": 0
        }

    trades = pd.DataFrame(trades_list)

    # Calculate signed values
    trades['signed_value'] = trades.apply(
        lambda r: r['qty'] * r['price'] * (1 if r['side'].lower() == 'sell' else -1),
        axis=1
    )

    # Overall stats
    buy_value = trades[trades['side'].str.lower() == 'buy']['value'].sum()
    sell_value = trades[trades['side'].str.lower() == 'sell']['value'].sum()
    net_pnl = sell_value - buy_value
    return_pct = (net_pnl / buy_value * 100) if buy_value > 0 else 0

    # Per-symbol breakdown
    symbol_stats = []
    for symbol in trades['symbol'].unique():
        symbol_trades = trades[trades['symbol'] == symbol]
        symbol_pnl = symbol_trades['signed_value'].sum()
        symbol_buys = symbol_trades[symbol_trades['side'].str.lower() == 'buy']
        symbol_invested = symbol_buys['value'].sum() if not symbol_buys.empty else 0
        symbol_return = (symbol_pnl / symbol_invested * 100) if symbol_invested > 0 else 0

        symbol_stats.append({
            "symbol": symbol,
            "trades": len(symbol_trades),
            "invested": round(symbol_invested, 2),
            "pnl": round(symbol_pnl, 2),
            "return_pct": round(symbol_return, 2)
        })

    # Sort by PnL descending
    symbol_stats.sort(key=lambda x: x['pnl'], reverse=True)

    return {
        "user_id": user_id,
        "total_trades": len(trades),
        "symbols_traded": len(trades['symbol'].unique()),
        "total_invested": round(buy_value, 2),
        "total_realized": round(sell_value, 2),
        "net_pnl": round(net_pnl, 2),
        "return_pct": round(return_pct, 2),
        "top_performers": symbol_stats[:5],
        "all_symbols": symbol_stats
    }


async def calculate_win_rate(user_id: str) -> Dict:
    """
    Calculate win rate and trading statistics
    """
    trades_list = await db.fetch_trades_for_user(user_id)

    if not trades_list:
        return {"win_rate": 0, "total_trades": 0}

    trades = pd.DataFrame(trades_list)
    trades['signed_value'] = trades.apply(
        lambda r: r['qty'] * r['price'] * (1 if r['side'].lower() == 'sell' else -1),
        axis=1
    )

    # Group by symbol and calculate per-symbol PnL
    symbol_pnls = trades.groupby('symbol')['signed_value'].sum()

    winning_trades = (symbol_pnls > 0).sum()
    losing_trades = (symbol_pnls < 0).sum()
    total_symbols = len(symbol_pnls)

    win_rate = (winning_trades / total_symbols * 100) if total_symbols > 0 else 0

    return {
        "win_rate": round(win_rate, 2),
        "winning_trades": int(winning_trades),
        "losing_trades": int(losing_trades),
        "total_symbols_traded": int(total_symbols),
        "average_win": round(symbol_pnls[symbol_pnls > 0].mean(), 2) if winning_trades > 0 else 0,
        "average_loss": round(symbol_pnls[symbol_pnls < 0].mean(), 2) if losing_trades > 0 else 0
    }
