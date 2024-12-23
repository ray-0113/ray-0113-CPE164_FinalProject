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
import toast from 'react-hot-toast';

interface GasChartComponentProps {
  gasLevel: number;  
}

export function GasChartComponent({ gasLevel }: GasChartComponentProps) {
  const calculateEndAngle = (gas: number) => Math.min((gas / 100) * 270, 270) + 90; 
  const gasLevelAngle = calculateEndAngle(gasLevel);
  
  const gasLevelColor = gasLevel >= 50 ? "hsl(0, 100%, 50%)" : "hsl(120, 100%, 50%)";  
  //const gasLevelColor = "hsl(120, 100%, 50%)";  

  const chartData = [
    { name: "Gas Level", value: gasLevel, fill: gasLevelColor },
  ];

  const chartConfig = {
    gasLevel: {
      label: "Gas Level",
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Gas Level</CardTitle>
        <CardDescription>Real-Time Gas Sensor Reading <span className="text-lg">☁️</span></CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={gasLevelAngle}
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
                          {gasLevel}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Gas Level
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
