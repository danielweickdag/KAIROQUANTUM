"""
Profit calculation and comparative analysis module
Calculates user returns and compares against market benchmarks
"""

import asyncio
from typing import Dict, List, Optional
from datetime import datetime, date, timedelta
import httpx
from . import db

# Alpaca API configuration
ALPACA_API_KEY = ""  # Set from environment
ALPACA_SECRET_KEY = ""  # Set from environment
ALPACA_BASE_URL = "https://data.alpaca.markets/v2"

async def get_user_metrics(user_id: str) -> Dict:
    """
    Calculate comprehensive trading metrics for a user
    """
    trades = await db.get_user_trades(user_id)

    if not trades:
        return {
            "user_id": user_id,
            "total_trades": 0,
            "total_invested": 0,
            "total_value": 0,
            "realized_pnl": 0,
            "returns_percent": 0,
            "trades": []
        }

    # Calculate metrics
    total_buy_value = sum(t["value"] for t in trades if t["side"].lower() == "buy")
    total_sell_value = sum(t["value"] for t in trades if t["side"].lower() == "sell")

    realized_pnl = total_sell_value - total_buy_value
    returns_percent = (realized_pnl / total_buy_value * 100) if total_buy_value > 0 else 0

    return {
        "user_id": user_id,
        "total_trades": len(trades),
        "total_invested": round(total_buy_value, 2),
        "total_value": round(total_sell_value, 2),
        "realized_pnl": round(realized_pnl, 2),
        "returns_percent": round(returns_percent, 2),
        "first_trade": trades[0]["executed_at"].isoformat() if trades else None,
        "last_trade": trades[-1]["executed_at"].isoformat() if trades else None
    }

async def recompute_user_metrics(user_id: str):
    """
    Recompute and cache user metrics
    This runs asynchronously after trade ingestion
    """
    try:
        metrics = await get_user_metrics(user_id)
        # TODO: Cache metrics in Redis or database for fast retrieval
        print(f"Updated metrics for user {user_id}: {metrics}")
        return metrics
    except Exception as e:
        print(f"Error recomputing metrics for user {user_id}: {e}")
        raise

async def get_user_vs_benchmark(
    user_id: str,
    benchmark: str = "SPY",
    start_date: Optional[date] = None,
    end_date: Optional[date] = None
) -> Dict:
    """
    Compare user's trading performance against a market benchmark
    """
    # Default to last year if no dates provided
    if not end_date:
        end_date = datetime.now().date()
    if not start_date:
        start_date = end_date - timedelta(days=365)

    # Get user trades in date range
    user_trades = await db.get_user_trades(user_id, start_date, end_date)

    if not user_trades:
        return {
            "error": "No trades found in specified timeframe",
            "user_id": user_id,
            "benchmark": benchmark,
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat()
        }

    # Calculate user returns
    buy_value = sum(t["value"] for t in user_trades if t["side"].lower() == "buy")
    sell_value = sum(t["value"] for t in user_trades if t["side"].lower() == "sell")

    user_profit = sell_value - buy_value
    user_profit_percent = (user_profit / buy_value * 100) if buy_value > 0 else 0

    # Get benchmark data
    benchmark_data = await get_benchmark_returns(benchmark, start_date, end_date)

    if not benchmark_data:
        # Fallback to mock data if API fails
        benchmark_data = get_mock_benchmark_returns(benchmark, start_date, end_date)

    benchmark_returns = benchmark_data["returns_percent"]
    difference = user_profit_percent - benchmark_returns

    return {
        "user_id": user_id,
        "timeframe": {
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
            "days": (end_date - start_date).days
        },
        "user_performance": {
            "buy_value": round(buy_value, 2),
            "sell_value": round(sell_value, 2),
            "profit_dollar": round(user_profit, 2),
            "profit_percent": round(user_profit_percent, 2)
        },
        "benchmark_performance": {
            "symbol": benchmark,
            "name": benchmark_data.get("name", benchmark),
            "start_price": benchmark_data.get("start_price"),
            "end_price": benchmark_data.get("end_price"),
            "returns_percent": round(benchmark_returns, 2)
        },
        "comparison": {
            "difference_percent": round(difference, 2),
            "outperformance": difference > 0,
            "status": "outperformed" if difference > 0 else "underperformed"
        }
    }

async def get_benchmark_returns(
    symbol: str,
    start_date: date,
    end_date: date
) -> Optional[Dict]:
    """
    Fetch benchmark returns from market data API
    """
    try:
        # Check if we have cached data
        cached_data = await db.get_benchmark_range(symbol, start_date, end_date)

        if cached_data and len(cached_data) >= 2:
            # Use cached data
            start_price = cached_data[0]["close"]
            end_price = cached_data[-1]["close"]
            returns = ((end_price - start_price) / start_price) * 100

            return {
                "symbol": symbol,
                "start_price": start_price,
                "end_price": end_price,
                "returns_percent": returns,
                "data_source": "cache"
            }

        # Fetch from API if not cached
        data = await fetch_benchmark_from_api(symbol, start_date, end_date)
        if data:
            return data

        return None
    except Exception as e:
        print(f"Error fetching benchmark {symbol}: {e}")
        return None

async def fetch_benchmark_from_api(
    symbol: str,
    start_date: date,
    end_date: date
) -> Optional[Dict]:
    """
    Fetch benchmark data from Alpaca Markets API
    """
    try:
        async with httpx.AsyncClient() as client:
            url = f"{ALPACA_BASE_URL}/stocks/{symbol}/bars"
            headers = {
                "APCA-API-KEY-ID": ALPACA_API_KEY,
                "APCA-API-SECRET-KEY": ALPACA_SECRET_KEY
            }
            params = {
                "start": start_date.isoformat(),
                "end": end_date.isoformat(),
                "timeframe": "1Day",
                "limit": 10000
            }

            response = await client.get(url, headers=headers, params=params, timeout=10.0)
            response.raise_for_status()

            data = response.json()
            bars = data.get("bars", [])

            if not bars or len(bars) < 2:
                return None

            start_price = bars[0]["c"]
            end_price = bars[-1]["c"]
            returns = ((end_price - start_price) / start_price) * 100

            # Cache the data
            for bar in bars:
                bar_date = datetime.fromisoformat(bar["t"].replace("Z", "+00:00")).date()
                await db.upsert_benchmark({
                    "symbol": symbol,
                    "date": bar_date,
                    "open": bar["o"],
                    "high": bar["h"],
                    "low": bar["l"],
                    "close": bar["c"],
                    "volume": bar["v"]
                })

            return {
                "symbol": symbol,
                "start_price": start_price,
                "end_price": end_price,
                "returns_percent": returns,
                "data_source": "api"
            }
    except Exception as e:
        print(f"API fetch error for {symbol}: {e}")
        return None

def get_mock_benchmark_returns(symbol: str, start_date: date, end_date: date) -> Dict:
    """
    Generate mock benchmark returns for testing/fallback
    """
    days = (end_date - start_date).days

    # Mock annual returns for different benchmarks
    annual_returns = {
        "SPY": 0.10,    # S&P 500: 10% annual
        "QQQ": 0.15,    # NASDAQ: 15% annual
        "DIA": 0.08,    # Dow: 8% annual
        "IWM": 0.09,    # Russell 2000: 9% annual
        "VTI": 0.10,    # Total Market: 10% annual
        "VOO": 0.10,    # Vanguard S&P: 10% annual
        "AGG": 0.03,    # Bonds: 3% annual
        "GLD": 0.05     # Gold: 5% annual
    }

    annual_return = annual_returns.get(symbol, 0.10)
    period_return = ((1 + annual_return) ** (days / 365)) - 1
    returns_percent = period_return * 100

    start_price = 100.0
    end_price = start_price * (1 + period_return)

    benchmark_names = {
        "SPY": "S&P 500 ETF",
        "QQQ": "NASDAQ-100 ETF",
        "DIA": "Dow Jones ETF",
        "IWM": "Russell 2000 ETF",
        "VTI": "Total Market ETF",
        "VOO": "Vanguard S&P 500 ETF",
        "AGG": "Bond Market ETF",
        "GLD": "Gold ETF"
    }

    return {
        "symbol": symbol,
        "name": benchmark_names.get(symbol, symbol),
        "start_price": start_price,
        "end_price": end_price,
        "returns_percent": returns_percent,
        "data_source": "mock"
    }

async def fetch_and_cache_benchmarks():
    """
    Background task to fetch and cache benchmark data for popular symbols
    """
    symbols = ["SPY", "QQQ", "DIA", "IWM", "VTI", "VOO", "AGG", "GLD"]
    end_date = datetime.now().date()
    start_date = end_date - timedelta(days=730)  # 2 years of data

    print(f"Fetching benchmark data for {len(symbols)} symbols...")

    tasks = [
        fetch_benchmark_from_api(symbol, start_date, end_date)
        for symbol in symbols
    ]

    results = await asyncio.gather(*tasks, return_exceptions=True)

    success_count = sum(1 for r in results if r and not isinstance(r, Exception))
    print(f"Successfully cached {success_count}/{len(symbols)} benchmarks")

    return {
        "symbols_updated": success_count,
        "total_symbols": len(symbols),
        "date_range": {
            "start": start_date.isoformat(),
            "end": end_date.isoformat()
        }
    }

async def calculate_sharpe_ratio(user_id: str, risk_free_rate: float = 0.02) -> float:
    """
    Calculate Sharpe Ratio for user's trading performance
    Sharpe Ratio = (Average Return - Risk Free Rate) / Standard Deviation
    """
    trades = await db.get_user_trades(user_id)

    if len(trades) < 2:
        return 0.0

    # Calculate daily returns
    returns = []
    for i in range(1, len(trades)):
        prev_value = trades[i-1]["value"]
        curr_value = trades[i]["value"]
        daily_return = (curr_value - prev_value) / prev_value if prev_value > 0 else 0
        returns.append(daily_return)

    if not returns:
        return 0.0

    # Calculate average return and standard deviation
    avg_return = sum(returns) / len(returns)
    variance = sum((r - avg_return) ** 2 for r in returns) / len(returns)
    std_dev = variance ** 0.5

    # Calculate Sharpe Ratio
    sharpe = (avg_return - risk_free_rate) / std_dev if std_dev > 0 else 0.0

    return round(sharpe, 2)
