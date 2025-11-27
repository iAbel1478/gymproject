import { useEffect, useState } from 'react';
import { predictOccupancy } from '../utils/dataParser';

const GymOccupancyPredictor = () => {
  const [currentOccupancy, setCurrentOccupancy] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());
  const [predictedOccupancy, setPredictedOccupancy] = useState<number | null>(null);

  useEffect(() => {
    const fetchCurrentOccupancy = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch this from your API
        // For now, we'll use the prediction for the current time
        const now = new Date();
        const occupancy = await predictOccupancy(now);
        setCurrentOccupancy(occupancy);
        setSelectedTime(now);
        setPredictedOccupancy(occupancy);
      } catch (err) {
        setError('Failed to load occupancy data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentOccupancy();
  }, []);

  const handleTimeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDateTime = new Date(e.target.value);
    setSelectedTime(newDateTime);
    
    try {
      const occupancy = await predictOccupancy(newDateTime);
      setPredictedOccupancy(occupancy);
    } catch (err) {
      setError('Failed to predict occupancy');
      console.error(err);
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

  if (loading) {
    return <div className="p-4 text-center">Loading occupancy data...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Gym Occupancy Predictor</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Check occupancy for:
        </label>
        <input
          type="datetime-local"
          value={selectedTime.toISOString().slice(0, 16)}
          onChange={handleTimeChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-700">Current Occupancy:</h3>
          <div className="mt-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getOccupancyColor(currentOccupancy)}`}>
              {currentOccupancy !== null ? `${currentOccupancy} people (${getOccupancyLevel(currentOccupancy)})` : 'N/A'}
            </span>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-700">Predicted Occupancy for {selectedTime.toLocaleString()}:</h3>
          <div className="mt-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getOccupancyColor(predictedOccupancy)}`}>
              {predictedOccupancy !== null ? `${predictedOccupancy} people (${getOccupancyLevel(predictedOccupancy)})` : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-800">Tips:</h4>
        <ul className="mt-2 text-sm text-blue-700 list-disc pl-5 space-y-1">
          <li>Mornings (6-10 AM) are usually less crowded</li>
          <li>Evenings (5-9 PM) tend to be the busiest times</li>
          <li>Weekends are generally busier than weekdays</li>
        </ul>
      </div>
    </div>
  );
};

export default GymOccupancyPredictor;
