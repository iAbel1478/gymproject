import type { PredictionResponse, HealthResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export async function checkHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) {
    throw new Error('Health check failed');
  }
  return response.json();
}

export async function getPrediction(
  dayOfWeek: string,
  time: string
): Promise<PredictionResponse> {
  const params = new URLSearchParams({
    day_of_week: dayOfWeek,
    time: time,
  });

  const response = await fetch(`${API_BASE_URL}/predict?${params}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Prediction failed');
  }

  return response.json();
}
