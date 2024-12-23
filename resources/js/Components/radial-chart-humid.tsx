
import { useMqtt } from '@/Components/MQTT/mqtt-context';
import { useState, useEffect } from "react"
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card"
import { ChartConfig, ChartContainer } from "@/Components/ui/chart"

interface HumidityChartComponentProps {
  humidity: number;
}

export function HumidityChartComponent({ humidity }: HumidityChartComponentProps) {
  const calculateEndAngle = (humidity: number) => ((humidity / 100) * 270) + 90
  const humidityAngle = calculateEndAngle(humidity)
  const humidityColor = humidity <= 30 || humidity >= 70 ? "hsl(0, 100%, 50%)" : "hsl(200, 100%, 50%)"

  const chartData = [
    { name: "Humidity", value: humidity, fill: humidityColor }, 
  ]

  const chartConfig = {
    humidity: {
      label: "Humidity",
    },
  } satisfies ChartConfig

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Humidity</CardTitle>
        <CardDescription>Real-Time Humidity Level <span className="text-xl">💧</span></CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={humidityAngle} 
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
                          {humidity}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Humidity
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
