"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import { format } from "date-fns";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Announcement } from "@/lib/types";

interface ChartRadialShapeProps {
  data?: Announcement[];
  label: string;
  description: string;
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function ChartRadar({
  data,
  label,
  description,
}: ChartRadialShapeProps) {
  const chartConfig = {
    value: {
      label,
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  // Initialize all 12 months to 0
  const countsByMonth: Record<string, number> = MONTHS.reduce((acc, month) => {
    acc[month] = 0;
    return acc;
  }, {} as Record<string, number>);

  // Tally announcement counts per month
  data?.forEach((item) => {
    const month = format(new Date(item.date), "MMM");
    if (countsByMonth[month] !== undefined) {
      countsByMonth[month]++;
    }
  });

  // Transform into format for RadarChart
  const transformedData = MONTHS.map((month) => ({
    month,
    value: countsByMonth[month],
  }));

  return (
    <Card className="flex flex-col py-0 bg-transparent gap-5 h-full">
      <CardContent className="flex-1 pb-0 px-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart
            outerRadius={80}
            width={250}
            height={250}
            data={transformedData}
          >
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="month" />
            <PolarGrid />
            <Radar
              dataKey="value"
              fill="var(--color-value)"
              fillOpacity={0.6}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
          </RadarChart>
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
