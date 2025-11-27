import Papa from 'papaparse';

interface GymData {
  number_people: number;
  date: string;
  timestamp: string;
  day_of_week: number;
  is_weekend: number;
  is_holiday: number;
  temperature: number;
  is_start_of_semester: number;
  is_during_semester: number;
  month: number;
  hour: number;
}

export const parseCSV = async (): Promise<GymData[]> => {
  try {
    const response = await fetch('/data.csv');
    const csvData = await response.text();

    return new Promise((resolve) => {
      Papa.parse<GymData>(csvData, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (results) => {
          const rows = (results.data || []).filter(
            (row) =>
              typeof row.number_people === 'number' &&
              typeof row.day_of_week === 'number' &&
              typeof row.hour === 'number' &&
              typeof row.month === 'number'
          );
          resolve(rows);
        },
        error: (error: Error) => {
          console.error('Error parsing CSV:', error);
          resolve([]);
        },
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

  const similarData = data.filter(
    (entry) =>
      entry.day_of_week === dayOfWeek &&
      entry.hour === hour &&
      entry.month === month
  );

  if (similarData.length === 0) {
    const fallbackData = data.filter(
      (entry) => entry.day_of_week === dayOfWeek && entry.hour === hour
    );

    if (fallbackData.length > 0) {
      const total = fallbackData.reduce((sum, entry) => sum + entry.number_people, 0);
      return Math.round(total / fallbackData.length);
    }

    return 30;
  }

  const total = similarData.reduce((sum, entry) => sum + entry.number_people, 0);
  return Math.round(total / similarData.length);
};


