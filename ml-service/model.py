import pandas as pd
import numpy as np
from statsmodels.tsa.arima.model import ARIMA
import warnings
warnings.filterwarnings('ignore')

def run_forecast(prices: list, days: int = 14):
    df = pd.DataFrame(prices)
    df['date'] = pd.to_datetime(df['date'])
    df = df.sort_values('date').set_index('date')
    df['close'] = pd.to_numeric(df['close'])

    series = df['close']

    if len(series) < 10:
        raise ValueError("Not enough data. Need at least 10 price points.")

    model = ARIMA(series, order=(1, 1, 1))
    fitted = model.fit()

    forecast_result = fitted.get_forecast(steps=days)
    forecast_mean = forecast_result.predicted_mean
    conf_int = forecast_result.conf_int(alpha=0.2)

    last_date = series.index[-1]
    future_dates = pd.bdate_range(start=last_date, periods=days + 1)[1:]

    forecast_output = []
    for i, date in enumerate(future_dates):
        forecast_output.append({
            "date": date.strftime("%Y-%m-%d"),
            "predicted": round(float(forecast_mean.iloc[i]), 2),
            "lower_ci": round(float(conf_int.iloc[i, 0]), 2),
            "upper_ci": round(float(conf_int.iloc[i, 1]), 2),
        })

    return forecast_output