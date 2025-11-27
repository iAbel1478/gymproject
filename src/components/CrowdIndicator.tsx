import { Activity } from 'lucide-react';
import { getCrowdColor, getCrowdMessage } from '../lib/utils';

interface CrowdIndicatorProps {
  level: 'low' | 'medium' | 'high';
  avgOccupancy: number;
}

export default function CrowdIndicator({ level, avgOccupancy }: CrowdIndicatorProps) {
  const color = getCrowdColor(level);
  const message = getCrowdMessage(level);

  const percentage = Math.min(100, (avgOccupancy / 100) * 100);

  return (
    <div className="relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-10 rounded-2xl"
        style={{ backgroundColor: color }}
      />

      <div className="relative p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full animate-pulse"
              style={{ backgroundColor: color }}
            />
            <span
              className="text-sm font-bold uppercase tracking-wider"
              style={{ color }}
            >
              {level} Occupancy
            </span>
          </div>
          <Activity className="w-6 h-6 opacity-40" style={{ color }} />
        </div>

        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold" style={{ color }}>
              {Math.round(avgOccupancy)}
            </span>
            <span className="text-2xl font-medium opacity-60">people</span>
          </div>

          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${percentage}%`,
                backgroundColor: color,
              }}
            />
          </div>
        </div>

        <p className="text-gray-600 leading-relaxed">{message}</p>
      </div>
    </div>
  );
}
