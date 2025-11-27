import { useState } from 'react';
import { Dumbbell, Loader2, AlertCircle } from 'lucide-react';
import { getPrediction } from './lib/api';
import type { PredictionResponse } from './types';
import DaySelector from './components/DaySelector';
import TimeSelector from './components/TimeSelector';
import PredictionCard from './components/PredictionCard';

function App() {
  const [selectedDay, setSelectedDay] = useState('Mon');
  const [selectedTime, setSelectedTime] = useState('17:00');
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getPrediction(selectedDay, selectedTime);
      setPrediction(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get prediction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDE2YzAtMS4xLS45LTItMi0yaC0xYy0xLjEgMC0yIC45LTIgMnYxYzAgMS4xLjkgMiAyIDJoMWMxLjEgMCAyLS45IDItMnYtMXoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" />

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
              <DaySelector selectedDay={selectedDay} onChange={setSelectedDay} />
              <TimeSelector selectedTime={selectedTime} onChange={setSelectedTime} />

              <button
                onClick={handlePredict}
                disabled={loading}
                className="w-full bg-slate-800 text-white py-4 rounded-xl font-bold text-lg
                         hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200 shadow-lg hover:shadow-xl
                         flex items-center justify-center gap-2"
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

          {prediction && (
            <div className="lg:sticky lg:top-8 h-fit">
              <PredictionCard prediction={prediction} />
            </div>
          )}

          {!prediction && !loading && (
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
          <p className="font-medium mb-2">
            Build Anything - University Course Project
          </p>
          <p className="text-xs">
            Gym Occupancy Predictor API - Flask REST API, Pandas Data Pipeline,
            Docker Containerization
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
