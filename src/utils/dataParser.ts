import Papa from 'papaparse';

interface GymData {
  time: string;
  number: number;
  dayOfWeek: number;
  isWeekend: number;
  isHoliday: number;
  temperature: number;
  isStartOfSemester: number;
  isDuringSemester: number;
  month: number;
  dayOfMonth: number;
  hour: number;
  minute: number;
  peopleCount: number;
  timestamp: string;
}

export const parseCSV = async (): Promise<GymData[]> => {
  try {
    const response = await fetch('/data.csv');
    const csvData = await response.text();
    
    return new Promise((resolve) => {
      Papa.parse(csvData, {
        header: false,
        skipEmptyLines: true,
        complete: (results) => {
          const parsedData = results.data
            .filter((row: any) => row.length >= 2) // Ensure we have at least time and people count
            .map((row: any) => {
              // Split the row into parts
              const [timePart, ...rest] = row[0].split(',');
              const [hour, minute] = timePart.split(':').map(Number);
              const peopleCount = parseInt(rest.pop()?.split(':')[1] || '0', 10);
              const timestamp = rest.pop() || '';
              
              // Extract the numeric values from the row
              const [
                number = 0,
                dayOfWeek = 0,
                isWeekend = 0,
                isHoliday = 0,
                temperature = 0,
                isStartOfSemester = 0,
                isDuringSemester = 0,
                month = 0,
                dayOfMonth = 0
              ] = rest.map(Number);

              return {
                time: timePart,
                number,
                dayOfWeek,
                isWeekend,
                isHoliday,
                temperature,
                isStartOfSemester,
                isDuringSemester,
                month,
                dayOfMonth,
                hour,
                minute,
                peopleCount,
                timestamp
              };
            });
          
          resolve(parsedData);
        },
        error: (error: Error) => {
          console.error('Error parsing CSV:', error);
          resolve([]);
        }
      });
    });
  } catch (error) {
    console.error('Error loading CSV file:', error);
    return [];
  }
};

export const predictOccupancy = async (date: Date): Promise<number> => {
  const dayOfWeek = date.getDay();
  const hour = date.getHours();
  const month = date.getMonth() + 1;
  
  const data = await parseCSV();
  
  // Filter data for similar conditions (same day of week, hour, and month)
  const similarData = data.filter(entry => 
    entry.dayOfWeek === dayOfWeek && 
    entry.hour === hour && 
    entry.month === month
  );
  
  if (similarData.length === 0) {
    // If no exact matches, try with just day and hour
    const fallbackData = data.filter(entry => 
      entry.dayOfWeek === dayOfWeek && 
      entry.hour === hour
    );
    
    if (fallbackData.length > 0) {
      const total = fallbackData.reduce((sum, entry) => sum + entry.peopleCount, 0);
      return Math.round(total / fallbackData.length);
    }
    
    // If still no data, return a default value
    return 30; // Default estimate
  }
  
  // Calculate average occupancy for similar conditions
  const total = similarData.reduce((sum, entry) => sum + entry.peopleCount, 0);
  return Math.round(total / similarData.length);
};
