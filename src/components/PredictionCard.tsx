import { TrendingUp, Users, Clock } from 'lucide-react';
import type { PredictionResponse } from '../types';
import CrowdIndicator from './CrowdIndicator';

interface PredictionCardProps {
  prediction: PredictionResponse;
}

export default function PredictionCard({ prediction }: PredictionCardProps) {
  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white text-2xl font-bold mb-1">
              Prediction Results
            </h2>
            <div className="flex items-center gap-4 text-slate-200 text-sm">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{prediction.time}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{prediction.day_of_week}</span>
              </div>
            </div>
          </div>
          <TrendingUp className="w-8 h-8 text-slate-300" />
        </div>
      </div>

      <div className="p-6">
        <CrowdIndicator
          level={prediction.crowd_level}
          avgOccupancy={prediction.avg_occupancy}
        />

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-gray-800">
                {prediction.hour_bucket}:00
              </div>
              <div className="text-xs text-gray-600 mt-1 uppercase tracking-wide">
                Hour Bucket
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-gray-800">
                {Math.round(prediction.avg_occupancy)}
              </div>
              <div className="text-xs text-gray-600 mt-1 uppercase tracking-wide">
                Avg Occupancy
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
