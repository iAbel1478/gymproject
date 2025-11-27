export interface PredictionRequest {
  day_of_week: string;
  time: string;
}

export interface PredictionResponse {
  day_of_week: string;
  time: string;
  hour_bucket: number;
  avg_occupancy: number;
  crowd_level: 'low' | 'medium' | 'high';
}

export interface HealthResponse {
  status: string;
  service: string;
}
