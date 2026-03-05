from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from model import run_forecast

app = FastAPI(
    title="SokoMetrics ML Service",
    description="ARIMA forecasting microservice for NSE stock data",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class PricePoint(BaseModel):
    date: str
    close: float

class ForecastRequest(BaseModel):
    ticker: str
    prices: List[PricePoint]
    days: int = 14

@app.get("/")
def root():
    return {
        "service": "SokoMetrics ML Microservice 🧠",
        "status": "running",
        "endpoints": {
            "forecast": "POST /forecast"
        }
    }

@app.post("/forecast")
def forecast(request: ForecastRequest):
    try:
        prices_list = [{"date": p.date, "close": p.close} for p in request.prices]
        result = run_forecast(prices_list, days=request.days)
        return {
            "ticker": request.ticker,
            "horizon_days": request.days,
            "forecast": result,
            "is_educational": True,
            "disclaimer": "Forecasts are probabilistic and for educational purposes only."
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Forecast failed: {str(e)}")