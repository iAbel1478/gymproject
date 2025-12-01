import { useState } from 'react';
import { Dumbbell, Loader2, AlertCircle } from 'lucide-react';
import { predictOccupancy } from './utils/dataParser';
import { DAYS_OF_WEEK } from './lib/utils';

function App() {
  const [selectedDay, setSelectedDay] = useState('Mon');
  const [selectedTime, setSelectedTime] = useState('17:00');
  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async () => {
    setLoading(true);
    setError(null);

    try {
      // Create a date object from the selected day and time
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayIndex = days.indexOf(selectedDay);
      const [hours, minutes] = selectedTime.split(':').map(Number);
      
      const date = new Date();
      const currentDay = date.getDay();
      const diff = (dayIndex + 7 - currentDay) % 7;
      date.setDate(date.getDate() + diff);
      date.setHours(hours, minutes, 0, 0);
      
      const occupancy = await predictOccupancy(date);
      setPrediction(occupancy);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get prediction');
    } finally {
      setLoading(false);
    }
  };

  const getOccupancyLevel = (occupancy: number | null) => {
    if (occupancy === null) return 'Unknown';
    if (occupancy < 10) return 'Very Low';
    if (occupancy < 30) return 'Low';
    if (occupancy < 60) return 'Moderate';
    if (occupancy < 90) return 'High';
    return 'Very High';
  };

  const getOccupancyColor = (occupancy: number | null) => {
    if (occupancy === null) return 'bg-gray-200';
    if (occupancy < 10) return 'bg-green-100 text-green-800';
    if (occupancy < 30) return 'bg-blue-100 text-blue-800';
    if (occupancy < 60) return 'bg-yellow-100 text-yellow-800';
    if (occupancy < 90) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      <div className="relative container mx-auto px-4 py-12 max-w-6xl">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-slate-800 rounded-2xl shadow-lg">
              <Dumbbell className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-black text-slate-800 tracking-tight">
              Gym Occupancy
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Smart predictions to help you choose the best time to work out.
            Avoid the crowds and maximize your gym experience.
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              When are you planning to visit?
            </h2>

            <div className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Day of Week
                </label>
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {DAYS_OF_WEEK.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = i.toString().padStart(2, '0');
                    return [
                      <option key={`${hour}:00`} value={`${hour}:00`}>
                        {hour}:00
                      </option>,
                      <option key={`${hour}:30`} value={`${hour}:30`}>
                        {hour}:30
                      </option>,
                    ];
                  })}
                </select>
              </div>

              <button
                onClick={handlePredict}
                disabled={loading}
                className="w-full bg-slate-800 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Dumbbell className="w-5 h-5" />
                    Get Prediction
                  </>
                )}
              </button>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-red-800 font-semibold mb-1">Error</h3>
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {prediction !== null ? (
            <div className="lg:sticky lg:top-8 h-fit">
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 h-full">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">
                  Prediction Results
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Selected Time</h3>
                    <p className="text-lg font-medium">
                      {DAYS_OF_WEEK.find(day => day.value === selectedDay)?.label} at {selectedTime}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Predicted Occupancy</h3>
                    <div className="flex items-center gap-3">
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${getOccupancyColor(prediction)}`}>
                        {prediction} people
                      </span>
                      <span className="text-gray-600">
                        ({getOccupancyLevel(prediction)})
                      </span>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">What this means</h3>
                    <p className="text-gray-600 text-sm">
                      Based on historical data, the gym is typically {getOccupancyLevel(prediction).toLowerCase()} at this time.
                      {prediction < 30 ? " It's a great time to go!" : prediction < 60 ? " It's a decent time to go, but could be busy." : " It might be quite crowded."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden lg:flex items-center justify-center">
              <div className="text-center p-12 bg-white rounded-3xl shadow-xl border border-gray-100">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Dumbbell className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  No Prediction Yet
                </h3>
                <p className="text-gray-600">
                  Select a day and time, then click "Get Prediction" to see the
                  expected crowd level.
                </p>
              </div>
            </div>
          )}
        </div>

        <footer className="text-center text-gray-500 text-sm mt-16 pt-8 border-t border-gray-200">
          <p className="text-xs">
            Gym Occupancy Predictor - Using historical data to help you find the best gym times
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
