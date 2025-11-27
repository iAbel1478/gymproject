from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import joblib
import os
from pathlib import Path
import numpy as np

# Create the FastAPI app
app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model path - using absolute paths to avoid any confusion
BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "model" / "gym_model.pkl"
CSV_PATH = BASE_DIR / "data" / "data.csv"

class PredictionInput(BaseModel):
    day_of_week: int  # 0-6 (Monday=0, Sunday=6)
    hour: int         # 0-23
    month: int        # 1-12

@app.get("/")
async def root():
    return {"message": "Gym Occupancy Predictor API is running"}

@app.post("/predict")
async def predict(input_data: PredictionInput):
    try:
        # Check if model exists, if not train it
        if not MODEL_PATH.exists():
            train_model()
        
        # Load the model
        model = joblib.load(MODEL_PATH)
        
        # Make prediction
        prediction = model.predict([[
            input_data.day_of_week,
            input_data.hour,
            input_data.month
        ]])
        
        # Ensure prediction is between 0-100
        prediction = max(0, min(100, round(float(prediction[0]))))
        
        return {
            "prediction": prediction,
            "status": "success"
        }
    except Exception as e:
        return {
            "error": str(e),
            "status": "error"
        }

def train_model():
    """Train and save the prediction model."""
    try:
        # Create data directory if it doesn't exist
        os.makedirs(CSV_PATH.parent, exist_ok=True)
        
        # Create sample data if it doesn't exist
        if not CSV_PATH.exists():
            print(f"Creating sample data at {CSV_PATH}")
            # Create sample data
            dates = pd.date_range(start="2023-01-01", end="2023-12-31", freq="H")
            df = pd.DataFrame({
                "timestamp": dates,
                "people_count": np.random.randint(0, 101, size=len(dates))
            })
            df.to_csv(CSV_PATH, index=False)
            print(f"Sample data created at {CSV_PATH}")
        
        # Load and preprocess data
        df = pd.read_csv(CSV_PATH)
        
        # Feature engineering
        if 'timestamp' in df.columns:
            df['timestamp'] = pd.to_datetime(df['timestamp'])
            df['hour'] = df['timestamp'].dt.hour
            df['day_of_week'] = df['timestamp'].dt.dayofweek
            df['month'] = df['timestamp'].dt.month
        
        # Select features and target
        X = df[['day_of_week', 'hour', 'month']]
        y = df['people_count']
        
        # Train model
        model = RandomForestRegressor(n_estimators=100, random_state=42)
        model.fit(X, y)
        
        # Create model directory if it doesn't exist
        os.makedirs(MODEL_PATH.parent, exist_ok=True)
        
        # Save model
        joblib.dump(model, MODEL_PATH)
        print(f"Model trained and saved to {MODEL_PATH}")
        
    except Exception as e:
        print(f"Error in train_model: {str(e)}")
        raise

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)