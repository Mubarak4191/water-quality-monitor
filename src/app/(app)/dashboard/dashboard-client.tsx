'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Bluetooth, BluetoothConnected, Droplets, Thermometer, Waves, TestTube, ZapOff, Zap } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useSettings } from '@/hooks/use-settings';
import type { Sensor, SensorType, SensorReading } from '@/lib/types';
import { generateHistoricalData } from '@/lib/data';
import { getSmartAlertChannel } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Area, AreaChart, XAxis } from 'recharts';

const SENSOR_ICONS: Record<SensorType, React.ElementType> = {
  pH: TestTube,
  Temperature: Thermometer,
  TDS: Droplets,
  Turbidity: Waves,
};

const chartConfig = {
  value: {
    label: 'Value',
  },
} satisfies ChartConfig;

const getStatus = (value: number, threshold: [number, number]): Sensor['status'] => {
  if (value < threshold[0] || value > threshold[1]) {
    const deviation = Math.max(threshold[0] - value, value - threshold[1]);
    const range = threshold[1] - threshold[0];
    if (deviation > range * 0.2) return 'danger';
    return 'warning';
  }
  return 'safe';
};

const getUrgency = (status: Sensor['status']): 'low' | 'medium' | 'high' => {
  if (status === 'danger') return 'high';
  if (status === 'warning') return 'medium';
  return 'low';
}

function SensorCard({ sensor, isLoading }: { sensor: Sensor; isLoading: boolean }) {
  const statusColors = {
    safe: 'text-green-500',
    warning: 'text-yellow-500',
    danger: 'text-red-500',
  };

  const chartData = sensor.history.slice(-30).map(item => ({...item, date: new Date(item.timestamp).toLocaleTimeString()}));

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{sensor.type}</CardTitle>
        {React.createElement(SENSOR_ICONS[sensor.type], { className: `h-4 w-4 text-muted-foreground` })}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-12 w-3/4" />
        ) : (
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{sensor.value.toFixed(2)}</span>
            <span className="text-sm text-muted-foreground">{sensor.unit}</span>
            <div className={`h-3 w-3 rounded-full ${statusColors[sensor.status].replace('text-', 'bg-')} ml-auto`} />
          </div>
        )}
        <div className="h-20 mt-4">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <AreaChart data={chartData} margin={{ top: 0, right: 5, left: 5, bottom: 0 }}>
              <defs>
                <linearGradient id={`fill${sensor.type}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-value)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" hideLabel />}
              />
              <Area
                dataKey="value"
                type="natural"
                fill={`url(#fill${sensor.type})`}
                stroke="var(--color-value)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardClient() {
  const [sensors, setSensors] = useState<Record<SensorType, Sensor> | null>(null);
  const [isDeviceConnected, setIsDeviceConnected] = useState(false);
  const { settings, isLoaded: settingsLoaded } = useSettings();
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<string[]>([]);

  const initialSensors = useMemo((): Record<SensorType, Sensor> => {
    if (!settings) return {} as Record<SensorType, Sensor>;
    const { thresholds } = settings.notifications;
    return {
      pH: { type: 'pH', unit: '', value: 7.5, status: 'safe', history: generateHistoricalData(1, 60, [7.2, 7.8]) },
      Temperature: { type: 'Temperature', unit: '°C', value: 22.1, status: 'safe', history: generateHistoricalData(1, 60, [21, 23]) },
      TDS: { type: 'TDS', unit: 'ppm', value: 350, status: 'safe', history: generateHistoricalData(1, 60, [300, 400]) },
      Turbidity: { type: 'Turbidity', unit: 'NTU', value: 1.2, status: 'safe', history: generateHistoricalData(1, 60, [0.5, 1.5]) },
    };
  }, [settings]);

  useEffect(() => {
    if (settingsLoaded) {
      setSensors(initialSensors);
    }
  }, [settingsLoaded, initialSensors]);
  
  const handleAlert = useCallback(async (sensor: Sensor) => {
    if (!settings) return;

    const alertKey = `${sensor.type}-${sensor.status}`;
    if (alerts.includes(alertKey)) return; // Avoid duplicate alerts

    setAlerts(prev => [...prev, alertKey]);
    
    const result = await getSmartAlertChannel({
      urgency: getUrgency(sensor.status),
      sensorReading: `${sensor.type} is ${sensor.value.toFixed(2)} ${sensor.unit}`,
      userPreferences: settings.notifications,
      appContext: { isAppOpen: true },
    });
    
    if (result.success && result.data) {
      toast({
        variant: sensor.status === 'danger' ? 'destructive' : 'default',
        title: `Alert: ${sensor.type} levels are ${sensor.status}`,
        description: `Sent via ${result.data.channel}: ${result.data.reason}`,
      });
    }
  }, [settings, toast, alerts]);

  useEffect(() => {
    if (!isDeviceConnected || !settings) return;

    const interval = setInterval(() => {
      setSensors((prevSensors) => {
        if (!prevSensors) return null;

        const newSensors = { ...prevSensors };
        let hasAlert = false;

        for (const key in newSensors) {
          const sensorType = key as SensorType;
          const sensor = newSensors[sensorType];
          const range = settings.notifications.thresholds[sensorType];
          
          const change = (Math.random() - 0.5) * (range[1] - range[0]) * 0.1;
          let newValue = sensor.value + change;

          // occasional spike
          if (Math.random() > 0.98) {
            const spike = (range[1] - range[0]) * (Math.random() > 0.5 ? 0.3 : -0.3);
            newValue = sensor.value + spike;
          }

          const newStatus = getStatus(newValue, range);

          if (newStatus !== 'safe' && sensor.status === 'safe') {
            hasAlert = true;
            handleAlert({ ...sensor, value: newValue, status: newStatus });
          }
          
          const newHistory = [...sensor.history.slice(1), { timestamp: Date.now(), value: newValue }];

          newSensors[sensorType] = {
            ...sensor,
            value: newValue,
            status: newStatus,
            history: newHistory,
          };
        }
        
        return newSensors;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isDeviceConnected, settings, handleAlert]);


  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Device Connection</h3>
            <p className="text-sm text-muted-foreground">
              {isDeviceConnected ? 'ESP32 Sensor is connected and streaming data.' : 'Pair with your water quality sensor.'}
            </p>
          </div>
          <Button onClick={() => setIsDeviceConnected(c => !c)}>
            {isDeviceConnected ? <BluetoothConnected className="mr-2 h-4 w-4" /> : <Bluetooth className="mr-2 h-4 w-4" />}
            {isDeviceConnected ? 'Disconnect' : 'Connect'}
          </Button>
        </CardContent>
      </Card>
      
      {!isDeviceConnected && (
        <Card className="bg-accent/20 border-accent">
          <CardContent className="p-4 flex items-center gap-4">
            <ZapOff className="h-6 w-6 text-accent" />
            <div>
              <h3 className="font-semibold text-accent">Real-time data is paused</h3>
              <p className="text-sm text-accent/80">
                Connect to a device to start streaming live sensor readings.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {sensors ? (
          Object.values(sensors).map((sensor) => (
            <SensorCard key={sensor.type} sensor={sensor} isLoading={!isDeviceConnected} />
          ))
        ) : (
          [...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))
        )}
      </div>
      
      <Card>
          <CardHeader>
            <CardTitle>Active Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            {alerts.length > 0 ? (
                 <div className="space-y-2">
                    {alerts.map((alert, index) => {
                        const [type, status] = alert.split('-');
                        const sensor = sensors?.[type as SensorType];
                        if (!sensor) return null;
                        
                        return (
                            <div key={index} className="flex items-center p-2 rounded-md bg-destructive/10 text-destructive-foreground">
                                <AlertTriangle className="h-5 w-5 mr-3 text-destructive" />
                                <p className="text-sm font-medium text-foreground">
                                    <span className="font-bold">{type}</span> is out of range
                                    ({status}) with a value of {sensor.value.toFixed(2)} {sensor.unit}.
                                </p>
                            </div>
                        )
                    })}
                 </div>
            ) : (
                <p className="text-sm text-muted-foreground">No active alerts. All systems nominal.</p>
            )}
          </CardContent>
      </Card>
    </div>
  );
}
