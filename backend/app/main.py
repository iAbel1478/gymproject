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
        df = pd.read_csv(CSV_PATH)

        required_columns = {'number_people', 'day_of_week', 'hour', 'month'}
        missing = required_columns - set(df.columns)
        if missing:
            raise ValueError(f"CSV is missing required columns: {missing}")

        X = df[['day_of_week', 'hour', 'month']]
        y = df['number_people']
        
        # Train the model
        model = RandomForestRegressor(n_estimators=100, random_state=42)
        model.fit(X, y)
        
        # Save the model
        os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
        joblib.dump(model, MODEL_PATH)
        print(f"Model trained and saved to {MODEL_PATH}")
        
    except Exception as e:
        print(f"Error training model: {str(e)}")
        if 'df' in locals():
            print("Available columns:", df.columns.tolist())
            print(df.head())
        raise

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

