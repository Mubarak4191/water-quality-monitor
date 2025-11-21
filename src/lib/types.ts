export type SensorType = 'pH' | 'Temperature' | 'TDS' | 'Turbidity';

export type SensorReading = {
  timestamp: number;
  value: number;
};

export interface Sensor {
  type: SensorType;
  unit: string;
  value: number;
  status: 'safe' | 'warning' | 'danger';
  history: SensorReading[];
}

export type Thresholds = Record<SensorType, [number, number]>;

export type UserPreferences = {
  preferredChannel: 'push' | 'email';
  allowPushNotifications: boolean;
};

export type UserSettings = {
  profile: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
  notifications: UserPreferences & {
    thresholds: Thresholds;
  };
};

export type AppState = {
  isAppOpen: boolean;
};
