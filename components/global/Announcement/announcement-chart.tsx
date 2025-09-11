"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GlowingWrapper } from "@/components/ui/glowing-effect";

// Mock announcements data simulating your DB data
// Each item has a date and a type (active, urgent, info)
const announcements = [
  { date: "2024-06-01T10:00:00Z", type: "active" },
  { date: "2024-06-01T12:00:00Z", type: "urgent" },
  { date: "2024-06-02T08:00:00Z", type: "info" },
  { date: "2024-06-02T09:00:00Z", type: "active" },
  { date: "2024-06-03T14:00:00Z", type: "urgent" },
  { date: "2024-06-03T16:00:00Z", type: "info" },
  // add your real data here...
];

// Aggregate announcements by date and type
function aggregateAnnouncements(data: typeof announcements) {
  const dataMap = new Map<
    string,
    { active: number; urgent: number; info: number }
  >();

  data.forEach(({ date, type }) => {
    const dateStr = new Date(date).toISOString().slice(0, 10); // YYYY-MM-DD

    if (!dataMap.has(dateStr)) {
      dataMap.set(dateStr, { active: 0, urgent: 0, info: 0 });
    }

    const entry = dataMap.get(dateStr)!;

    if (type === "active") entry.active++;
    else if (type === "urgent") entry.urgent++;
    else if (type === "info") entry.info++;
  });

  const aggregatedData = Array.from(dataMap.entries()).map(
    ([date, counts]) => ({
      date,
      ...counts,
    })
  );

  // Sort by date ascending
  aggregatedData.sort((a, b) => (a.date < b.date ? -1 : 1));

  return aggregatedData;
}

const chartData = aggregateAnnouncements(announcements);

const chartConfig = {
  active: {
    label: "Active",
    color: "var(--chart-1)",
  },
  urgent: {
    label: "Urgent",
    color: "var(--chart-2)",
  },
  info: {
    label: "Info",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState("90d");

  // Reference date for filtering (latest date in your data or today)
  const referenceDate = new Date("2024-06-30");

  const filteredData = React.useMemo(() => {
    let daysToSubtract = 90;
    if (timeRange === "30d") daysToSubtract = 30;
    else if (timeRange === "7d") daysToSubtract = 7;

    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    return chartData.filter((item) => {
      const date = new Date(item.date);
      return date >= startDate && date <= referenceDate;
    });
  }, [timeRange]);

  return (
    <GlowingWrapper>
      <Card className="border-0.75 bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] relative pt-0">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle>Area Chart - Interactive Announcements</CardTitle>
            <CardDescription>
              Showing announcements count for last selected period by type
            </CardDescription>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillActive" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--chart-1)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--chart-1)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillUrgent" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--chart-2)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--chart-2)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillInfo" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--chart-3)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--chart-3)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="active"
                type="natural"
                fill="url(#fillActive)"
                stroke="var(--chart-1)"
                stackId="a"
              />
              <Area
                dataKey="urgent"
                type="natural"
                fill="url(#fillUrgent)"
                stroke="var(--chart-2)"
                stackId="a"
              />
              <Area
                dataKey="info"
                type="natural"
                fill="url(#fillInfo)"
                stroke="var(--chart-3)"
                stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </GlowingWrapper>
  );
}
