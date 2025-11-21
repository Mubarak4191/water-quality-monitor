'use server';

/**
 * @fileOverview An AI agent that intelligently selects the most appropriate notification channel.
 *
 * - intelligentAlertChannelSelection - A function that selects the best notification channel.
 * - IntelligentAlertChannelSelectionInput - The input type for the intelligentAlertChannelSelection function.
 * - IntelligentAlertChannelSelectionOutput - The return type for the intelligentAlertChannelSelection function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntelligentAlertChannelSelectionInputSchema = z.object({
  urgency: z
    .enum(['high', 'medium', 'low'])
    .describe('The urgency level of the alert.'),
  userPreferences: z
    .object({
      preferredChannel: z.enum(['push', 'email']).describe('The user preferred channel.'),
      allowPushNotifications: z.boolean().describe('Whether the user allows push notifications.'),
    })
    .describe('The user communication preferences.'),
  appContext: z
    .object({
      isAppOpen: z.boolean().describe('Whether the app is currently open.'),
    })
    .describe('The current context of the application.'),
  sensorReading: z.string().describe('The sensor reading that triggered the alert.'),
});
export type IntelligentAlertChannelSelectionInput = z.infer<
  typeof IntelligentAlertChannelSelectionInputSchema
>;

const IntelligentAlertChannelSelectionOutputSchema = z.object({
  channel: z.enum(['push', 'email']).describe('The selected notification channel.'),
  reason: z.string().describe('The reasoning behind the channel selection.'),
});
export type IntelligentAlertChannelSelectionOutput = z.infer<
  typeof IntelligentAlertChannelSelectionOutputSchema
>;

export async function intelligentAlertChannelSelection(
  input: IntelligentAlertChannelSelectionInput
): Promise<IntelligentAlertChannelSelectionOutput> {
  return intelligentAlertChannelSelectionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'intelligentAlertChannelSelectionPrompt',
  input: {schema: IntelligentAlertChannelSelectionInputSchema},
  output: {schema: IntelligentAlertChannelSelectionOutputSchema},
  prompt: `You are an expert system for determining the best notification channel for water quality alerts.

  Given the following information, determine whether to send a push notification or an email.

  Urgency: {{urgency}}
  User Preferences: Preferred channel is {{userPreferences.preferredChannel}}, allows push notifications: {{userPreferences.allowPushNotifications}}
  App Context: App is open: {{appContext.isAppOpen}}
  Sensor Reading: {{sensorReading}}

  Consider the urgency of the alert, user preferences, and the current context to select the most appropriate channel.

  If the app is open, prioritize push notifications unless the user has explicitly disallowed them.
  For critical alerts when the app is closed, use email to ensure the user receives the notification.

  Return the selected channel and the reason for your choice.
  `,
});

const intelligentAlertChannelSelectionFlow = ai.defineFlow(
  {
    name: 'intelligentAlertChannelSelectionFlow',
    inputSchema: IntelligentAlertChannelSelectionInputSchema,
    outputSchema: IntelligentAlertChannelSelectionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
