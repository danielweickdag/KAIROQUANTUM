"""
Simple compliance rules engine
Minimal, focused checks with JSON-extensible rules
Based on user's cleaner implementation pattern
"""

from typing import Dict, List, Tuple
from . import db


class SimpleComplianceRules:
    """Simplified compliance rule thresholds"""
    LARGE_TRADE_LIMIT = 1_000_000  # $1M
    WASH_TRADE_WINDOW_MINUTES = 1  # 1 minute for quick detection


async def run_checks_for_trade(trade_row: Dict) -> List[Tuple[str, str, str]]:
    """
    Run minimal compliance checks for a trade

    Args:
        trade_row: Trade dictionary with keys: id, user_id, symbol, side, qty, price

    Returns:
        List of tuples: (check_name, status, reason)
    """
    user_id = trade_row["user_id"]
    trade_id = trade_row["id"]
    checks = []

    # 1) Simple size limit check
    trade_value = float(trade_row["qty"]) * float(trade_row["price"])
    if trade_value > SimpleComplianceRules.LARGE_TRADE_LIMIT:
        checks.append((
            "large_trade_limit",
            "flag",
            f"trade exceeds ${SimpleComplianceRules.LARGE_TRADE_LIMIT:,}"
        ))
    else:
        checks.append(("large_trade_limit", "pass", None))

    # 2) Wash trade basic detection: buy and sell same symbol inside 1 minute
    recent = await db.get_recent_trades(
        user_id,
        trade_row["symbol"],
        minutes=SimpleComplianceRules.WASH_TRADE_WINDOW_MINUTES
    )

    wash_trade_detected = False
    for r in recent:
        if r["side"] != trade_row["side"]:
            checks.append((
                "wash_trade_check",
                "flag",
                f"opposite side within {SimpleComplianceRules.WASH_TRADE_WINDOW_MINUTES} minute"
            ))
            wash_trade_detected = True
            break

    if not wash_trade_detected:
        checks.append(("wash_trade_check", "pass", None))

    # Persist audits
    for name, status, reason in checks:
        await db.insert_compliance_audit(
            user_id,
            trade_id,
            name,
            status,
            reason,
            metadata={}
        )

    return checks


async def add_custom_check(
    trade_row: Dict,
    rule_config: Dict
) -> Tuple[str, str, str]:
    """
    Add custom compliance check from JSON configuration

    Example rule_config:
    {
        "name": "crypto_size_limit",
        "check_type": "max_value",
        "threshold": 50000,
        "symbols": ["BTC", "ETH"],
        "message": "Crypto trade exceeds $50k limit"
    }
    """
    check_name = rule_config.get("name", "custom_check")
    check_type = rule_config.get("check_type")
    threshold = rule_config.get("threshold", 0)
    symbols = rule_config.get("symbols", [])
    message = rule_config.get("message", "Custom check failed")

    # Symbol filter
    if symbols and trade_row["symbol"] not in symbols:
        return (check_name, "pass", "Symbol not in scope")

    # Check type: max_value
    if check_type == "max_value":
        trade_value = float(trade_row["qty"]) * float(trade_row["price"])
        if trade_value > threshold:
            return (check_name, "flag", message)
        return (check_name, "pass", None)

    # Check type: max_quantity
    elif check_type == "max_quantity":
        if float(trade_row["qty"]) > threshold:
            return (check_name, "flag", message)
        return (check_name, "pass", None)

    # Unknown check type
    return (check_name, "pass", "Check type not implemented")


# Example: JSON rule storage (can be loaded from database or file)
CUSTOM_RULES = [
    {
        "name": "crypto_size_limit",
        "check_type": "max_value",
        "threshold": 50000,
        "symbols": ["BTC", "ETH", "DOGE"],
        "message": "Crypto trade exceeds $50k limit"
    },
    {
        "name": "penny_stock_quantity_limit",
        "check_type": "max_quantity",
        "threshold": 100000,
        "symbols": [],  # Apply to all
        "message": "Excessive quantity for single trade"
    }
]


async def run_all_checks(trade_row: Dict) -> List[Tuple[str, str, str]]:
    """
    Run both standard and custom checks
    """
    # Run standard checks
    checks = await run_checks_for_trade(trade_row)

    # Run custom checks from JSON rules
    for rule in CUSTOM_RULES:
        try:
            custom_check = await add_custom_check(trade_row, rule)
            checks.append(custom_check)

            # Persist custom check
            await db.insert_compliance_audit(
                trade_row["user_id"],
                trade_row["id"],
                custom_check[0],
                custom_check[1],
                custom_check[2],
                metadata=rule
            )
        except Exception as e:
            print(f"Error running custom check {rule.get('name')}: {e}")

    return checks
