import { Calendar } from 'lucide-react';
import { DAYS_OF_WEEK } from '../lib/utils';

interface DaySelectorProps {
  selectedDay: string;
  onChange: (day: string) => void;
}

export default function DaySelector({ selectedDay, onChange }: DaySelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-gray-700">
        <Calendar className="w-5 h-5" />
        <label className="text-sm font-semibold uppercase tracking-wide">
          Select Day
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        {DAYS_OF_WEEK.map((day) => (
          <button
            key={day.value}
            onClick={() => onChange(day.value)}
            className={`
              px-6 py-3 rounded-xl font-semibold transition-all duration-200
              ${
                selectedDay === day.value
                  ? 'bg-slate-800 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-slate-50 hover:shadow-md'
              }
            `}
          >
            {day.label}
          </button>
        ))}
      </div>
    </div>
  );
}
