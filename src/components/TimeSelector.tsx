import { Clock } from 'lucide-react';
import { TIME_SLOTS } from '../lib/utils';

interface TimeSelectorProps {
  selectedTime: string;
  onChange: (time: string) => void;
}

export default function TimeSelector({ selectedTime, onChange }: TimeSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-gray-700">
        <Clock className="w-5 h-5" />
        <label className="text-sm font-semibold uppercase tracking-wide">
          Select Time
        </label>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {TIME_SLOTS.map((slot) => (
          <button
            key={slot.value}
            onClick={() => onChange(slot.value)}
            className={`
              relative p-3 rounded-xl text-left transition-all duration-200
              ${
                selectedTime === slot.value
                  ? 'bg-slate-800 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-slate-50 hover:shadow-md'
              }
            `}
          >
            <div className="text-sm font-bold">{slot.label}</div>
            <div
              className={`
              text-xs mt-1
              ${selectedTime === slot.value ? 'text-slate-300' : 'text-gray-500'}
            `}
            >
              {slot.period}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
