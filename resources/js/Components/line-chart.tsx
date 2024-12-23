"use client";

import { useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/Components/ui/chart";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
} from "@/Components/ui/select";
import { Label } from "./ui/label";

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

// Default dates
const today = new Date().toISOString().split("T")[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

const generateHourlyData = (date: string, interval: number) => {
    const data = [];
    const startHour = 7;
    const endHour = 18;

    for (let i = startHour; i <= endHour; i++) {
        const times = interval === 0.5 ? [0, 30] : [0];
        for (let j of times) {
            const formattedTime = `${i > 12 ? i - 12 : i}:${
                j === 0 ? "00" : "30"
            } ${i < 12 || i === 24 ? "AM" : "PM"}`;

            data.push({
                time: formattedTime,
                temperature: Math.floor(Math.random() * 10) + 15,
                humidity: Math.floor(Math.random() * 50) + 30,
            });
        }
    }

    return data;
};

const chartConfig = {
    temperature: { label: "Temperature (°C)", color: "hsl(0, 100%, 50%)" },
    humidity: { label: "Humidity (%)", color: "hsl(210, 100%, 50%)" },
} satisfies ChartConfig;

export function LineChartComponent() {
    const dateOptions = [
        { label: "Today", value: today },
        { label: "Yesterday", value: yesterday },
        { label: "November 28, 2024", value: "2024-11-28" },
        { label: "November 27, 2024", value: "2024-11-27" },
        { label: "November 26, 2024", value: "2024-11-26" },
    ];

    const intervalOptions = [
        { label: "Every 30 minutes", value: "0.5" },
        { label: "Every 1 hour", value: "1" },
        { label: "Every 3 hours", value: "3" },
    ];

    const [selectedDate, setSelectedDate] = useState(today);
    const [interval, setInterval] = useState(1);

    const chartData = generateHourlyData(selectedDate, interval);

    const intervalLabels: { [key: string]: string } = {
        "0.5": "Every 30 minutes",
        "1": "Every 1 hour",
        "3": "Every 3 hours",
    };

    // Calculate averages for temperature and humidity
    const avgTemperature =
        chartData.reduce((sum, data) => sum + data.temperature, 0) /
        chartData.length;
    const avgHumidity =
        chartData.reduce((sum, data) => sum + data.humidity, 0) /
        chartData.length;

    // Format description dynamically with selected date
    const description = `${
        intervalLabels[String(interval)]
    } data for ${formatDate(selectedDate)}`;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Temperature & Humidity Trends by Interval</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-4 w-1/4">
                    <Label
                        htmlFor="date-select"
                        className="block text-sm font-medium text-muted-foreground"
                    >
                        Select Date
                    </Label>
                    <Select
                        value={selectedDate}
                        onValueChange={setSelectedDate}
                    >
                        <SelectTrigger>
                            <span>
                                {
                                    dateOptions.find(
                                        (dateOption) =>
                                            dateOption.value === selectedDate
                                    )?.label
                                }
                            </span>
                        </SelectTrigger>
                        <SelectContent>
                            {dateOptions.map((dateOption) => (
                                <SelectItem
                                    key={dateOption.value}
                                    value={dateOption.value}
                                >
                                    {dateOption.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="mb-4 w-1/4">
                    <Label
                        htmlFor="interval-select"
                        className="block text-sm font-medium text-muted-foreground"
                    >
                        Select Interval
                    </Label>
                    <Select
                        value={String(interval)}
                        onValueChange={(value) => setInterval(Number(value))}
                    >
                        <SelectTrigger>
                            <span>{intervalLabels[String(interval)]}</span>
                        </SelectTrigger>
                        <SelectContent>
                            {intervalOptions.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <ChartContainer config={chartConfig}>
                    <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{ left: 12, right: 12 }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="time"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent />}
                        />
                        <Line
                            dataKey="temperature"
                            type="monotone"
                            stroke="var(--color-temperature)"
                            strokeWidth={2}
                            dot={false}
                        />
                        <Line
                            dataKey="humidity"
                            type="monotone"
                            stroke="var(--color-humidity)"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div className="flex w-full flex-col items-center gap-2 text-sm">
                    <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="font-medium leading-none">
                            Average Temperature: {avgTemperature.toFixed(2)} °C
                        </div>
                        <div className="font-medium leading-none">
                            Average Humidity: {avgHumidity.toFixed(2)} %
                        </div>
                    </div>
                    <div className="mt-3 leading-none text-muted-foreground">
                        Showing data for {formatDate(selectedDate)}
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
