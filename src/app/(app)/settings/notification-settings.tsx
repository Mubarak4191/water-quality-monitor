'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import type { UserSettings, SensorType } from "@/lib/types";

interface NotificationSettingsProps {
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
}

const sensorRanges: Record<SensorType, { min: number; max: number; step: number }> = {
    pH: { min: 0, max: 14, step: 0.1 },
    Temperature: { min: 0, max: 50, step: 0.5 },
    TDS: { min: 0, max: 1000, step: 10 },
    Turbidity: { min: 0, max: 50, step: 0.1 },
};

export default function NotificationSettings({ settings, updateSettings }: NotificationSettingsProps) {
  const { notifications } = settings;

  const handleThresholdChange = (sensor: SensorType, value: [number, number]) => {
    updateSettings({
      notifications: {
        ...notifications,
        thresholds: {
          ...notifications.thresholds,
          [sensor]: value,
        },
      },
    });
  };

  const handlePreferencesChange = (key: string, value: any) => {
    updateSettings({
        notifications: {
            ...notifications,
            [key]: value,
        }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Customize how and when you receive alerts.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
            <h3 className="font-medium">Alert Thresholds</h3>
            <div className="space-y-6">
                {Object.entries(notifications.thresholds).map(([sensor, range]) => {
                    const sensorType = sensor as SensorType;
                    const config = sensorRanges[sensorType];
                    return (
                        <div key={sensor} className="grid gap-2">
                            <Label>{sensorType} Safe Range</Label>
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-mono w-12 text-center">{range[0].toFixed(1)}</span>
                                <Slider
                                    value={range}
                                    min={config.min}
                                    max={config.max}
                                    step={config.step}
                                    onValueChange={(value) => handleThresholdChange(sensorType, value)}
                                />
                                <span className="text-sm font-mono w-12 text-center">{range[1].toFixed(1)}</span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>

        <div className="space-y-4">
            <h3 className="font-medium">Communication Preferences</h3>
             <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label>Allow Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive alerts directly on your devices.</p>
                </div>
                <Switch
                    checked={notifications.allowPushNotifications}
                    onCheckedChange={(checked) => handlePreferencesChange('allowPushNotifications', checked)}
                />
            </div>
            <div className="rounded-lg border p-4 space-y-2">
                <Label>Preferred Channel</Label>
                <p className="text-sm text-muted-foreground">Choose your primary method for receiving non-critical alerts.</p>
                <RadioGroup 
                    defaultValue={notifications.preferredChannel}
                    onValueChange={(value) => handlePreferencesChange('preferredChannel', value)}
                    className="flex pt-2"
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="push" id="push" />
                        <Label htmlFor="push">Push Notification</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="email" id="email" />
                        <Label htmlFor="email">Email</Label>
                    </div>
                </RadioGroup>
            </div>
        </div>
        <div className="flex justify-end">
            <Button>Save Preferences</Button>
        </div>
      </CardContent>
    </Card>
  );
}
