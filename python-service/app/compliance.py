"""
Compliance checking module
Implements various trading compliance rules and regulations
"""

import asyncio
from typing import Dict, List
from datetime import datetime, timedelta
from . import db

# Compliance check rules
class ComplianceRules:
    """Trading compliance rules and thresholds"""

    # Pattern Day Trading (PDT) Rule
    PDT_TRADE_THRESHOLD = 4  # 4 day trades in 5 business days
    PDT_DAYS = 5
    PDT_MIN_EQUITY = 25000  # $25,000 minimum equity for PDT

    # Position sizing limits
    MAX_POSITION_SIZE_PERCENT = 20  # Max 20% of portfolio in single position
    MAX_LEVERAGE = 4  # 4x maximum leverage

    # Wash sale rule
    WASH_SALE_DAYS = 30  # 30 days before and after

    # Concentration limits
    MAX_SECTOR_CONCENTRATION = 40  # Max 40% in single sector

async def run_checks_for_trade(trade: Dict):
    """
    Run all compliance checks for a trade
    """
    user_id = str(trade.get("user_id"))
    trade_id = str(trade.get("id"))

    checks = [
        check_pattern_day_trading(user_id, trade),
        check_position_size_limit(user_id, trade),
        check_wash_sale(user_id, trade),
        check_leverage_limit(user_id, trade),
    ]

    results = await asyncio.gather(*checks, return_exceptions=True)

    # Store all audit results
    for check_result in results:
        if isinstance(check_result, Exception):
            print(f"Compliance check error: {check_result}")
            continue

        if check_result:
            audit_data = {
                "user_id": user_id,
                "trade_id": trade_id,
                **check_result
            }
            await db.create_compliance_audit(audit_data)

async def check_pattern_day_trading(user_id: str, trade: Dict) -> Dict:
    """
    Check for Pattern Day Trading violations (PDT Rule)

    A pattern day trader is someone who executes 4 or more day trades
    within 5 business days.
    """
    # Get recent trades
    end_date = datetime.now().date()
    start_date = end_date - timedelta(days=ComplianceRules.PDT_DAYS)

    trades = await db.get_user_trades(user_id, start_date, end_date)

    # Count day trades (buy and sell of same symbol on same day)
    day_trades = 0
    trade_dates = {}

    for t in trades:
        symbol = t["symbol"]
        trade_date = t["executed_at"].date()
        key = f"{symbol}_{trade_date}"

        if key not in trade_dates:
            trade_dates[key] = {"buy": False, "sell": False}

        if t["side"].lower() == "buy":
            trade_dates[key]["buy"] = True
        elif t["side"].lower() == "sell":
            trade_dates[key]["sell"] = True

        # If both buy and sell on same day, it's a day trade
        if trade_dates[key]["buy"] and trade_dates[key]["sell"]:
            day_trades += 1

    # Check if threshold exceeded
    if day_trades >= ComplianceRules.PDT_TRADE_THRESHOLD:
        return {
            "check_name": "pattern_day_trading",
            "status": "flag",
            "reason": f"Pattern Day Trading detected: {day_trades} day trades in {ComplianceRules.PDT_DAYS} days. Minimum equity of ${ComplianceRules.PDT_MIN_EQUITY:,} required.",
            "metadata": {
                "day_trades_count": day_trades,
                "threshold": ComplianceRules.PDT_TRADE_THRESHOLD,
                "period_days": ComplianceRules.PDT_DAYS
            }
        }

    return {
        "check_name": "pattern_day_trading",
        "status": "pass",
        "reason": f"{day_trades} day trades in {ComplianceRules.PDT_DAYS} days (threshold: {ComplianceRules.PDT_TRADE_THRESHOLD})",
        "metadata": {
            "day_trades_count": day_trades,
            "threshold": ComplianceRules.PDT_TRADE_THRESHOLD
        }
    }

async def check_position_size_limit(user_id: str, trade: Dict) -> Dict:
    """
    Check if position size exceeds portfolio percentage limit
    """
    # This would require portfolio value data
    # For now, implement basic check

    position_value = trade["qty"] * trade["price"]

    # TODO: Get actual portfolio value from database
    # For demonstration, using a placeholder
    portfolio_value = 100000  # $100,000 placeholder

    position_percent = (position_value / portfolio_value) * 100

    if position_percent > ComplianceRules.MAX_POSITION_SIZE_PERCENT:
        return {
            "check_name": "position_size_limit",
            "status": "flag",
            "reason": f"Position size {position_percent:.1f}% exceeds limit of {ComplianceRules.MAX_POSITION_SIZE_PERCENT}%",
            "metadata": {
                "position_value": position_value,
                "portfolio_value": portfolio_value,
                "position_percent": round(position_percent, 2),
                "limit_percent": ComplianceRules.MAX_POSITION_SIZE_PERCENT
            }
        }

    return {
        "check_name": "position_size_limit",
        "status": "pass",
        "reason": f"Position size {position_percent:.1f}% within limit",
        "metadata": {
            "position_percent": round(position_percent, 2),
            "limit_percent": ComplianceRules.MAX_POSITION_SIZE_PERCENT
        }
    }

async def check_wash_sale(user_id: str, trade: Dict) -> Dict:
    """
    Check for potential wash sale violations

    A wash sale occurs when you sell a security at a loss and purchase
    the same or substantially identical security within 30 days before or after the sale.
    """
    if trade["side"].lower() != "sell":
        # Wash sale only applies to sell transactions
        return {
            "check_name": "wash_sale",
            "status": "pass",
            "reason": "Not applicable (not a sell transaction)",
            "metadata": {}
        }

    symbol = trade["symbol"]
    trade_date = trade["executed_at"].date()

    # Get trades 30 days before and after
    start_date = trade_date - timedelta(days=ComplianceRules.WASH_SALE_DAYS)
    end_date = trade_date + timedelta(days=ComplianceRules.WASH_SALE_DAYS)

    trades = await db.get_user_trades(user_id, start_date, end_date)

    # Look for buy transactions of the same symbol within wash sale period
    wash_sale_buys = []
    for t in trades:
        if (t["symbol"] == symbol and
            t["side"].lower() == "buy" and
            t["id"] != trade["id"]):

            days_diff = abs((t["executed_at"].date() - trade_date).days)
            if days_diff <= ComplianceRules.WASH_SALE_DAYS:
                wash_sale_buys.append({
                    "date": t["executed_at"].date().isoformat(),
                    "qty": t["qty"],
                    "price": t["price"],
                    "days_from_sale": days_diff
                })

    if wash_sale_buys:
        return {
            "check_name": "wash_sale",
            "status": "flag",
            "reason": f"Potential wash sale detected: {len(wash_sale_buys)} buy transaction(s) of {symbol} within {ComplianceRules.WASH_SALE_DAYS} days of sale",
            "metadata": {
                "symbol": symbol,
                "wash_sale_period_days": ComplianceRules.WASH_SALE_DAYS,
                "related_buys": wash_sale_buys
            }
        }

    return {
        "check_name": "wash_sale",
        "status": "pass",
        "reason": f"No wash sale detected for {symbol}",
        "metadata": {"symbol": symbol}
    }

async def check_leverage_limit(user_id: str, trade: Dict) -> Dict:
    """
    Check if leverage exceeds regulatory limits
    """
    # This would require margin account data
    # For now, basic implementation

    # TODO: Get actual account value and margin used
    account_value = 100000  # Placeholder
    position_value = trade["qty"] * trade["price"]

    # Simplified leverage calculation
    leverage = position_value / account_value

    if leverage > ComplianceRules.MAX_LEVERAGE:
        return {
            "check_name": "leverage_limit",
            "status": "fail",
            "reason": f"Leverage {leverage:.2f}x exceeds maximum of {ComplianceRules.MAX_LEVERAGE}x",
            "metadata": {
                "leverage": round(leverage, 2),
                "max_leverage": ComplianceRules.MAX_LEVERAGE,
                "position_value": position_value,
                "account_value": account_value
            }
        }

    return {
        "check_name": "leverage_limit",
        "status": "pass",
        "reason": f"Leverage {leverage:.2f}x within limit",
        "metadata": {
            "leverage": round(leverage, 2),
            "max_leverage": ComplianceRules.MAX_LEVERAGE
        }
    }

async def get_user_compliance_history(user_id: str, limit: int = 100) -> List[Dict]:
    """
    Get compliance audit history for a user
    """
    audits = await db.get_compliance_audits(user_id, limit)

    # Categorize by status
    passed = sum(1 for a in audits if a["status"] == "pass")
    flagged = sum(1 for a in audits if a["status"] == "flag")
    failed = sum(1 for a in audits if a["status"] == "fail")

    return {
        "summary": {
            "total_checks": len(audits),
            "passed": passed,
            "flagged": flagged,
            "failed": failed
        },
        "audits": audits
    }

async def get_compliance_summary(user_id: str) -> Dict:
    """
    Get a summary of compliance status for a user
    """
    audits = await db.get_compliance_audits(user_id, 1000)

    # Group by check name
    by_check = {}
    for audit in audits:
        check_name = audit["check_name"]
        if check_name not in by_check:
            by_check[check_name] = {
                "total": 0,
                "pass": 0,
                "flag": 0,
                "fail": 0,
                "last_check": None
            }

        by_check[check_name]["total"] += 1
        by_check[check_name][audit["status"]] += 1

        if not by_check[check_name]["last_check"] or audit["created_at"] > by_check[check_name]["last_check"]:
            by_check[check_name]["last_check"] = audit["created_at"]

    return {
        "user_id": user_id,
        "compliance_checks": by_check,
        "total_audits": len(audits)
    }
