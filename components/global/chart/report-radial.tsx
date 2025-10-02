"use client";

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

interface ChartRadialTextProps {
  label: string;
  count: number;
  description?: string;
  color?: string;
}

export function ChartRadialText({
  label = "Loading...",
  count = 0,
  description = "Loading...",
  color = "var(--chart-2)",
}: ChartRadialTextProps) {
  const chartData = [
    { [label.toLowerCase()]: count, visitors: count, fill: color },
  ];

  const chartConfig: ChartConfig = {
    visitors: {
      label: "Visitors",
    },
    [label.toLowerCase()]: {
      label,
      color,
    },
  };

  return (
    <Card className="flex flex-col py-0 bg-transparent gap-5 h-full">
      <CardContent className="flex-1 pb-0 px-3">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[200px] pt-5"
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={250}
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
            <RadialBar dataKey="visitors" background cornerRadius={10} />
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
                          {count.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {label}
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm pb-3">
        <div className="flex items-center gap-2 leading-none font-medium">
          {label}
        </div>
        <div className="text-muted-foreground leading-none">{description}</div>
      </CardFooter>
    </Card>
  );
}
