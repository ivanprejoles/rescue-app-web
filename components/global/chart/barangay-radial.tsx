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

interface ChartRadialShapeProps {
  label: string;
  count: number;
  description?: string;
  color?: string;
}

export function ChartRadialShape({
  label,
  count,
  description = "Showing total count",
  color = "var(--chart-4)",
}: ChartRadialShapeProps) {
  const chartData = [
    {
      label,
      visitors: count,
      fill: color,
    },
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
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            endAngle={100}
            innerRadius={80}
            outerRadius={140}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="visitors" background />
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
