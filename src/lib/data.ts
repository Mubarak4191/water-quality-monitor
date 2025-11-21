import type { SensorReading, SensorType, UserSettings } from './types';

// Generates mock historical data for a sensor
export function generateHistoricalData(
  days: number,
  pointsPerDay: number,
  range: [number, number]
): SensorReading[] {
  const data: SensorReading[] = [];
  const now = Date.now();
  const totalPoints = days * pointsPerDay;

  for (let i = 0; i < totalPoints; i++) {
    const timestamp = now - (totalPoints - i) * ( (24 * 60 * 60 * 1000) / pointsPerDay);
    const value = Math.random() * (range[1] - range[0]) + range[0] + Math.sin(i / 50) * (range[1] - range[0]) / 10;
    data.push({ timestamp, value: parseFloat(value.toFixed(2)) });
  }
  return data;
}

// Default user settings
export const defaultSettings: UserSettings = {
  profile: {
    name: 'Alex Doe',
    email: 'alex.doe@example.com',
  },
  notifications: {
    preferredChannel: 'push',
    allowPushNotifications: true,
    thresholds: {
      pH: [6.5, 8.5],
      Temperature: [10, 25],
      TDS: [0, 500],
      Turbidity: [0, 5],
    },
  },
};
