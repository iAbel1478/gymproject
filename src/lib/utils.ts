export const DAYS_OF_WEEK = [
  { value: 'Mon', label: 'Monday' },
  { value: 'Tue', label: 'Tuesday' },
  { value: 'Wed', label: 'Wednesday' },
  { value: 'Thu', label: 'Thursday' },
  { value: 'Fri', label: 'Friday' },
  { value: 'Sat', label: 'Saturday' },
  { value: 'Sun', label: 'Sunday' },
];

export const TIME_SLOTS = [
  { value: '06:00', label: '6:00 AM', period: 'Early Morning' },
  { value: '07:00', label: '7:00 AM', period: 'Early Morning' },
  { value: '08:00', label: '8:00 AM', period: 'Morning' },
  { value: '09:00', label: '9:00 AM', period: 'Morning' },
  { value: '10:00', label: '10:00 AM', period: 'Morning' },
  { value: '11:00', label: '11:00 AM', period: 'Late Morning' },
  { value: '12:00', label: '12:00 PM', period: 'Noon' },
  { value: '13:00', label: '1:00 PM', period: 'Afternoon' },
  { value: '14:00', label: '2:00 PM', period: 'Afternoon' },
  { value: '15:00', label: '3:00 PM', period: 'Afternoon' },
  { value: '16:00', label: '4:00 PM', period: 'Late Afternoon' },
  { value: '17:00', label: '5:00 PM', period: 'Evening' },
  { value: '18:00', label: '6:00 PM', period: 'Evening' },
  { value: '19:00', label: '7:00 PM', period: 'Evening' },
  { value: '20:00', label: '8:00 PM', period: 'Night' },
  { value: '21:00', label: '9:00 PM', period: 'Night' },
  { value: '22:00', label: '10:00 PM', period: 'Night' },
];

export function getCrowdColor(level: 'low' | 'medium' | 'high'): string {
  switch (level) {
    case 'low':
      return '#10b981';
    case 'medium':
      return '#f59e0b';
    case 'high':
      return '#ef4444';
  }
}

export function getCrowdEmoji(level: 'low' | 'medium' | 'high'): string {
  switch (level) {
    case 'low':
      return '😊';
    case 'medium':
      return '😐';
    case 'high':
      return '😰';
  }
}

export function getCrowdMessage(level: 'low' | 'medium' | 'high'): string {
  switch (level) {
    case 'low':
      return 'Great time to work out! Plenty of space available.';
    case 'medium':
      return 'Moderately busy. You might wait for some equipment.';
    case 'high':
      return 'Peak hours! Expect crowds and wait times.';
  }
}
