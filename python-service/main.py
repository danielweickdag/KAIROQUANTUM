from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from uuid import UUID
import datetime
from app import compliance, profit, db

app = FastAPI(
    title="KAIRO Compliance + Comparative Profit API",
    description="Python microservice for trading compliance and profit analysis",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure based on environment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TradeIn(BaseModel):
    user_id: UUID
    symbol: str
    side: str  # 'buy' or 'sell'
    qty: float
    price: float
    executed_at: datetime.datetime
    external_id: str = None
    raw: dict = {}

class BenchmarkRequest(BaseModel):
    user_id: UUID
    benchmark: str = "SPY"
    start_date: datetime.date = None
    end_date: datetime.date = None

@app.get("/")
async def root():
    return {
        "service": "KAIRO Python Analytics Service",
        "status": "running",
        "version": "1.0.0",
        "endpoints": {
            "trades": "/trades",
            "comparative": "/users/{user_id}/comparative",
            "compliance": "/users/{user_id}/compliance",
            "webhooks": "/webhooks/stripe"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    db_healthy = await db.check_connection()
    return {
        "status": "healthy" if db_healthy else "unhealthy",
        "database": "connected" if db_healthy else "disconnected",
        "timestamp": datetime.datetime.utcnow()
    }

@app.post("/trades", status_code=201)
async def ingest_trade(trade: TradeIn, background_tasks: BackgroundTasks):
    """
    Ingest a new trade and run compliance checks + profit recalculation
    """
    try:
        # Create trade in database
        t = await db.create_trade(trade.dict())

        # Run compliance checks asynchronously
        background_tasks.add_task(compliance.run_checks_for_trade, t)

        # Recalculate user metrics asynchronously
        background_tasks.add_task(profit.recompute_user_metrics, str(trade.user_id))

        return {
            "id": t["id"],
            "status": "accepted",
            "message": "Trade ingested successfully. Compliance checks and metrics update in progress."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to ingest trade: {str(e)}")

@app.get("/users/{user_id}/comparative")
async def get_comparative(
    user_id: UUID,
    benchmark: str = "SPY",
    start_date: datetime.date = None,
    end_date: datetime.date = None
):
    """
    Get comparative profit analysis for a user against a benchmark
    """
    try:
        result = await profit.get_user_vs_benchmark(
            str(user_id),
            benchmark,
            start_date,
            end_date
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get comparative data: {str(e)}")

@app.get("/users/{user_id}/compliance")
async def get_compliance_status(user_id: UUID, limit: int = 100):
    """
    Get compliance check history for a user
    """
    try:
        audits = await compliance.get_user_compliance_history(str(user_id), limit)
        return {
            "user_id": str(user_id),
            "total_checks": len(audits),
            "audits": audits
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get compliance data: {str(e)}")

@app.get("/users/{user_id}/metrics")
async def get_user_metrics(user_id: UUID):
    """
    Get comprehensive user trading metrics
    """
    try:
        metrics = await profit.get_user_metrics(str(user_id))
        return metrics
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get user metrics: {str(e)}")

@app.post("/benchmarks/update")
async def update_benchmarks(background_tasks: BackgroundTasks):
    """
    Trigger benchmark data update (admin only - should add auth)
    """
    background_tasks.add_task(profit.fetch_and_cache_benchmarks)
    return {
        "status": "accepted",
        "message": "Benchmark update task scheduled"
    }

@app.post("/webhooks/stripe")
async def stripe_webhook(payload: dict):
    """
    Handle Stripe webhook events
    """
    try:
        result = await db.handle_stripe_event(payload)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Webhook processing failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
