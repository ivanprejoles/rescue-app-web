"use client";

import { PolarRadiusAxis, RadialBar, RadialBarChart, Label } from "recharts";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface RadialChartSingleProps {
  value: number;
  label?: string;
  description?: string;
  color?: string;
}

export function ChartRadialStack({
  value,
  label = "Data",
  description = "Current status overview",
  color = "var(--chart-4)",
}: RadialChartSingleProps) {
  const data = [{ name: label, value }];

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
            data={data}
            endAngle={180}
            innerRadius={80}
            outerRadius={130}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {value.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
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
            <RadialBar
              dataKey="value"
              fill={color}
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
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
