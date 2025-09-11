import React from "react";
import { Card } from "@/components/ui/card";
import { GlowingWrapper } from "@/components/ui/glowing-effect";
import { ChartRadialText } from "../chart/report-radial";

interface StatisticsCardsProps {
  totalReports: number;
  pendingReports: number;
  inProgressReports: number;
  resolvedReports: number;
}

const StatisticsCards: React.FC<StatisticsCardsProps> = ({
  totalReports,
  pendingReports,
  inProgressReports,
  resolvedReports,
}) => {
  return (
    <>
      {/* Total Reports */}
      <GlowingWrapper>
        <Card className="border-0.75 h-full bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] relative z-10 py-0">
          <ChartRadialText
            label="All"
            count={totalReports || 0}
            description="Total Reports"
          />
        </Card>
      </GlowingWrapper>

      {/* Resolved */}
      <GlowingWrapper>
        <Card className="border-0.75 h-full bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] relative z-10 py-0">
          <ChartRadialText
            label="Resolved"
            count={resolvedReports || 0}
            description="Successfully resolved"
            color="var(--chart-done)"
          />
        </Card>
      </GlowingWrapper>

      {/* In Progress */}
      <GlowingWrapper>
        <Card className="border-0.75 h-full bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] relative z-10 py-0">
          <ChartRadialText
            label="Assigned"
            count={inProgressReports || 0}
            description="Currently being addressed"
            color="var(--chart-5)"
          />
        </Card>
      </GlowingWrapper>

      {/* Pending */}
      <GlowingWrapper>
        <Card className="border-0.75 h-full bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] relative z-10 py-0">
          <ChartRadialText
            label="Pending"
            count={pendingReports || 0}
            description="Reports not yet started"
            color="var(--chart-pending)"
          />
        </Card>
      </GlowingWrapper>
    </>
  );
};

export default StatisticsCards;
