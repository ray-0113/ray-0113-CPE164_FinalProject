import { useMqtt } from '@/Components/MQTT/mqtt-context';
import { useState, useEffect } from "react";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { ChartConfig, ChartContainer } from "@/Components/ui/chart";

interface TemperatureChartComponentProps {
  temperature: number;
}

export function TemperatureChartComponent({ temperature }: TemperatureChartComponentProps) {
  const calculateEndAngle = (temp: number) => ((temp - 20) / 20) * 270 + 90;
  const temperatureAngle = calculateEndAngle(temperature);
  const temperatureColor = temperature <= 20 || temperature >=30 ? "hsl(0, 100%, 50%)" : "hsl(200, 100%, 50%)";

  const chartData = [
    { name: "Temperature", value: temperature, fill: temperatureColor },
  ];

  const chartConfig = {
    temperature: {
      label: "Temperature",
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Temperature</CardTitle>
        <CardDescription>Real-Time Temperature Level <span className="text-lg">🌡️</span></CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={temperatureAngle}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="value" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {temperature}°C
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Temperature
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
