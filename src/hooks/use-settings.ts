'use client';

import { useState, useEffect, useCallback } from 'react';
import type { UserSettings } from '@/lib/types';
import { defaultSettings } from '@/lib/data';

const SETTINGS_KEY = 'waterQualityMonitorSettings';

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem(SETTINGS_KEY);
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      } else {
        setSettings(defaultSettings);
      }
    } catch (error) {
      console.error('Failed to load settings from localStorage:', error);
      setSettings(defaultSettings);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const updateSettings = useCallback((newSettings: Partial<UserSettings>) => {
    setSettings((prevSettings) => {
      if (!prevSettings) return null;
      const updated = {
        ...prevSettings,
        ...newSettings,
        profile: { ...prevSettings.profile, ...newSettings.profile },
        notifications: { ...prevSettings.notifications, ...newSettings.notifications },
      };
      try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save settings to localStorage:', error);
      }
      return updated;
    });
  }, []);

  return { settings, updateSettings, isLoaded };
}
