'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bluetooth, BluetoothConnected, MoreVertical, Trash2, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from '@/hooks/use-toast';

// Extend the Device type to include the BluetoothDevice object
type Device = {
  name: string | null;
  id: string;
  connected: boolean;
  device: BluetoothDevice | null; // Store the actual device object
};


export default function DeviceSettings() {
  const { toast } = useToast();
  const [devices, setDevices] = useState<Device[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const handleConnectDevice = async () => {
    if (!navigator.bluetooth) {
      toast({
        variant: "destructive",
        title: "Web Bluetooth API not available",
        description: "Your browser does not support Web Bluetooth. Please use a compatible browser like Chrome.",
      });
      return;
    }

    setIsScanning(true);
    try {
      // Request a device with a specific service if known, otherwise scan for all.
      // For a water quality monitor, you'd typically have a specific service UUID.
      const bleDevice = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        // Optional: Filter for specific services
        // optionalServices: ['<your-esp32-service-uuid>'],
      });

      toast({
        title: "Device found!",
        description: `Found ${bleDevice.name || `Unnamed Device (${bleDevice.id})`}.`,
      });
      
      setDevices(prevDevices => {
        // Avoid adding duplicate devices
        if (prevDevices.some(d => d.id === bleDevice.id)) {
            return prevDevices;
        }
        return [...prevDevices, { name: bleDevice.name ?? 'Unnamed Device', id: bleDevice.id, connected: false, device: bleDevice }];
      });

    } catch (error: any) {
      if (error.name === 'NotFoundError') {
        toast({
            variant: "default",
            title: "No device selected",
            description: "The device scanning process was cancelled.",
        });
      } else {
        toast({
            variant: "destructive",
            title: "Bluetooth Error",
            description: `Could not connect to device: ${error.message}`,
        });
      }
    } finally {
      setIsScanning(false);
    }
  };


  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Device Management</CardTitle>
                <CardDescription>Pair and manage your water quality sensors.</CardDescription>
            </div>
            <Button onClick={handleConnectDevice} disabled={isScanning}>
                {isScanning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bluetooth className="mr-2 h-4 w-4" />}
                {isScanning ? 'Scanning...' : 'Pair New Device'}
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
            {devices.length === 0 && !isScanning && (
                <div className="text-center text-muted-foreground py-8">
                    <p>No paired devices found.</p>
                    <p>Click "Pair New Device" to get started.</p>
                </div>
            )}
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
