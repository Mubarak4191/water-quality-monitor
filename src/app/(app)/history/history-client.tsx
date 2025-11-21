'use client';

import { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, TestTube, Thermometer, Waves, Droplets } from 'lucide-react';
import type { SensorType, SensorReading } from '@/lib/types';
import { generateHistoricalData } from '@/lib/data';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Brush } from 'recharts';

type TimeRange = '24H' | '7D' | '30D';

const timeRangeToDays: Record<TimeRange, number> = {
  '24H': 1,
  '7D': 7,
  '30D': 30,
};

const SENSOR_DETAILS: Record<SensorType, { unit: string; range: [number, number]; icon: React.ElementType }> = {
  pH: { unit: '', range: [6, 9], icon: TestTube },
  Temperature: { unit: '°C', range: [5, 30], icon: Thermometer },
  TDS: { unit: 'ppm', range: [100, 600], icon: Droplets },
  Turbidity: { unit: 'NTU', range: [0, 10], icon: Waves },
};

const chartConfig = {
  value: {
    label: 'Value',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export default function HistoryClient() {
  const [selectedSensor, setSelectedSensor] = useState<SensorType>('pH');
  const [timeRange, setTimeRange] = useState<TimeRange>('7D');

  const historicalData = useMemo(() => {
    const days = timeRangeToDays[timeRange];
    const pointsPerDay = timeRange === '24H' ? 144 : 24;
    return generateHistoricalData(days, pointsPerDay, SENSOR_DETAILS[selectedSensor].range);
  }, [selectedSensor, timeRange]);

  const formattedData = useMemo(() => {
    return historicalData.map((d) => ({
      timestamp: d.timestamp,
      date: new Date(d.timestamp).toLocaleString(),
      value: d.value,
    }));
  }, [historicalData]);

  const handleExport = useCallback(() => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Timestamp,Date,Value\n';
    formattedData.forEach((row) => {
      csvContent += `${row.timestamp},"${row.date}",${row.value}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${selectedSensor}_${timeRange}_history.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [formattedData, selectedSensor, timeRange]);
  
  const SensorIcon = SENSOR_DETAILS[selectedSensor].icon;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                    <SensorIcon className="h-6 w-6" />
                    Historical Data for {selectedSensor}
                </CardTitle>
                <CardDescription>Analyze sensor readings over time.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
                <Select value={selectedSensor} onValueChange={(v) => setSelectedSensor(v as SensorType)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Sensor" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.keys(SENSOR_DETAILS).map((sensor) => (
                        <SelectItem key={sensor} value={sensor}>
                            {sensor}
                        </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                 <Button onClick={handleExport} variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                </Button>
            </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-end">
            <div className="flex items-center gap-2">
                {(['24H', '7D', '30D'] as TimeRange[]).map((range) => (
                    <Button
                        key={range}
                        variant={timeRange === range ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTimeRange(range)}
                    >
                        {range}
                    </Button>
                ))}
            </div>
        </div>
        <div className="h-[400px] w-full">
            <ChartContainer config={chartConfig} className="h-full w-full">
            <AreaChart data={formattedData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="timestamp"
                    tickFormatter={(value) => {
                        const date = new Date(value);
                        if (timeRange === '24H') return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
                    }}
                    tickLine={false}
                    axisLine={false}
                    />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    domain={['dataMin - 1', 'dataMax + 1']}
                    />
                <ChartTooltip
                    cursor
                    content={<ChartTooltipContent indicator="line" labelKey="date" />}
                    />
                <Area
                    dataKey="value"
                    type="monotone"
                    fill="var(--color-value)"
                    fillOpacity={0.4}
                    stroke="var(--color-value)"
                    strokeWidth={2}
                    />
                <Brush dataKey="timestamp" height={30} stroke="hsl(var(--primary))" travellerWidth={20} />
            </AreaChart>
            </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
