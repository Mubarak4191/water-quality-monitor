'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileSettings from './profile-settings';
import NotificationSettings from './notification-settings';
import DeviceSettings from './device-settings';
import { useSettings } from '@/hooks/use-settings';
import { Skeleton } from '@/components/ui/skeleton';

export default function SettingsClient() {
  const { settings, updateSettings, isLoaded } = useSettings();

  if (!isLoaded || !settings) {
    return (
      <Card>
        <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs defaultValue="notifications" className="space-y-4">
      <TabsList>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="device">Device</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <ProfileSettings settings={settings} updateSettings={updateSettings} />
      </TabsContent>
      <TabsContent value="notifications">
        <NotificationSettings settings={settings} updateSettings={updateSettings} />
      </TabsContent>
      <TabsContent value="device">
        <DeviceSettings />
      </TabsContent>
    </Tabs>
  );
}
