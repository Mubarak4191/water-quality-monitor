'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bluetooth, BluetoothConnected, MoreVertical, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const devices = [
    { name: 'Living Room Aquarium', id: 'ESP32-A1:B2:C3:D4', connected: true },
    { name: 'Kitchen Tap Filter', id: 'ESP32-E5:F6:A7:B8', connected: false },
]

export default function DeviceSettings() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Device Management</CardTitle>
                <CardDescription>Pair and manage your water quality sensors.</CardDescription>
            </div>
            <Button>
                <Bluetooth className="mr-2 h-4 w-4" />
                Pair New Device
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
            {devices.map(device => (
                <div key={device.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-4">
                        {device.connected ? 
                            <BluetoothConnected className="h-5 w-5 text-primary" /> : 
                            <Bluetooth className="h-5 w-5 text-muted-foreground" />
                        }
                        <div>
                            <p className="font-medium">{device.name}</p>
                            <p className="text-sm text-muted-foreground">{device.id}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant={device.connected ? 'outline' : 'default'}>
                            {device.connected ? 'Disconnect' : 'Connect'}
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Forget Device
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
