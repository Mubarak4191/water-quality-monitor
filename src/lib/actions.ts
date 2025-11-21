'use server';

import { intelligentAlertChannelSelection, type IntelligentAlertChannelSelectionInput } from '@/ai/flows/intelligent-alert-channel-selection';
import type { AppState, UserPreferences } from './types';

interface SmartAlertParams {
  urgency: 'high' | 'medium' | 'low';
  sensorReading: string;
  userPreferences: UserPreferences;
  appContext: AppState;
}

export async function getSmartAlertChannel(params: SmartAlertParams) {
  try {
    const input: IntelligentAlertChannelSelectionInput = {
      urgency: params.urgency,
      userPreferences: {
        preferredChannel: params.userPreferences.preferredChannel,
        allowPushNotifications: params.userPreferences.allowPushNotifications,
      },
      appContext: {
        isAppOpen: params.appContext.isAppOpen,
      },
      sensorReading: params.sensorReading,
    };

    const result = await intelligentAlertChannelSelection(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error getting smart alert channel:', error);
    return { success: false, error: 'Failed to determine alert channel.' };
  }
}
