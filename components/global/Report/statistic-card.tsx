import React from "react";
import { FileText, Clock, RefreshCw, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Total Reports */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            Total Reports
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalReports}
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className="gap-1 text-blue-700 border-blue-200"
            >
              <FileText className="w-4 h-4" />
              All
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">All submitted reports</div>
        </CardFooter>
      </Card>
      {/* Pending */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            Pending
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums text-amber-600 @[250px]/card:text-3xl">
            {pendingReports}
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className="gap-1 text-amber-700 border-amber-200"
            >
              <Clock className="w-4 h-4" />
              Awaiting
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">Reports not yet started</div>
        </CardFooter>
      </Card>
      {/* In Progress */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-blue-600" />
            Assigned
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums text-blue-600 @[250px]/card:text-3xl">
            {inProgressReports}
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className="gap-1 text-blue-700 border-blue-200"
            >
              <RefreshCw className="w-4 h-4" />
              Ongoing
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">Currently being addressed</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            Resolved
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums text-emerald-600 @[250px]/card:text-3xl">
            {resolvedReports}
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className="gap-1 text-emerald-700 border-emerald-200"
            >
              <CheckCircle className="w-4 h-4" />
              Done
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">Successfully resolved</div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default StatisticsCards;
