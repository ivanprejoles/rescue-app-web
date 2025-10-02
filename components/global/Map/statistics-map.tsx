import React from "react";
import { Card } from "@/components/ui/card";
import { GlowingWrapper } from "@/components/ui/glowing-effect";
import { ChartRadialText } from "../chart/report-radial";

interface StatisticsMapProps {
  hazards: number;
  reports: number;
  barangays: number | undefined;
  centers: number;
}

const StatisticsMap: React.FC<StatisticsMapProps> = ({
  hazards,
  reports,
  barangays,
  centers,
}) => {
  return (
    <>
      {/* Hazards */}
      <GlowingWrapper>
        <Card className="border-0.75 h-full bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] relative z-10 py-0">
          <ChartRadialText
            label="Hazard"
            count={hazards || 0}
            description="Total Hazards Reported"
            color="var(--chart-alert)"
          />
        </Card>
      </GlowingWrapper>

      {/* Reports */}
      <GlowingWrapper>
        <Card className="border-0.75 h-full bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] relative z-10 py-0">
          <ChartRadialText
            label="Reports"
            count={reports || 0}
            description="Total Reports"
            color="var(--chart-warning)"
          />
        </Card>
      </GlowingWrapper>

      {/* Barangays */}
      {barangays !== undefined && (
        <GlowingWrapper>
          <Card className="border-0.75 h-full bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] relative z-10 py-0">
            <ChartRadialText
              label="Barangays"
              count={barangays || 0}
              description="Total Barangays"
              color="var(--chart-5)"
            />
          </Card>
        </GlowingWrapper>
      )}

      {/* Evacuation Centers */}
      <GlowingWrapper>
        <Card className="border-0.75 h-full bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] relative z-10 py-0">
          <ChartRadialText
            label="Evacuation Centers"
            count={centers || 0}
            description="Evacuation Centers"
            color="var(--chart-done)"
          />
        </Card>
      </GlowingWrapper>
    </>
  );
};

export default StatisticsMap;
