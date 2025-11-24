'use client';

import React, { useState, useEffect } from 'react';
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

type Device = {
  name: string;
  id: string; // This will be the device address from native code
  connected: boolean;
};

// Extend the Window interface to include our Android bridge and device handler
declare global {
  interface Window {
    Android?: {
      startScan: () => void;
    };
    addBluetoothDevice: (name: string, id: string) => void;
  }
}

export default function DeviceSettings() {
  const { toast } = useToast();
  const [devices, setDevices] = useState<Device[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    // This function will be called by the native Android code
    window.addBluetoothDevice = (name: string, id: string) => {
      setIsScanning(false);
      setDevices(prevDevices => {
        if (prevDevices.some(d => d.id === id)) {
          return prevDevices; // Avoid duplicates
        }
        return [...prevDevices, { name, id, connected: false }];
      });
    };

    // Cleanup the function when the component unmounts
    return () => {
      delete (window as any).addBluetoothDevice;
    };
  }, []);

  const handleConnectDevice = async () => {
    // Check if the Android bridge is available
    if (window.Android && typeof window.Android.startScan === 'function') {
      setIsScanning(true);
      setDevices([]); // Clear previous results
      toast({
        title: "Starting Scan",
        description: "Looking for nearby Bluetooth devices...",
      });
      window.Android.startScan();
    } else {
      toast({
        variant: "destructive",
        title: "Not in Android App",
        description: "This feature is only available in the native Android application.",
      });
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
             {isScanning && devices.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                    <p>Scanning for devices...</p>
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
