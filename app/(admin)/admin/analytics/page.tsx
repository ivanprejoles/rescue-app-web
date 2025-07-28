"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  MapPin,
  AlertTriangle,
} from "lucide-react";

export default function AdminAnalyticsPage() {
  // Mock analytics data
  const analytics = {
    overview: {
      totalReports: 1247,
      totalReportsChange: "+12%",
      averageResponseTime: "8.5 min",
      responseTimeChange: "-15%",
      activeRescuers: 156,
      rescuersChange: "+8%",
      resolvedReports: 1089,
      resolvedChange: "+18%",
    },
    reportsByUrgency: [
      { urgency: "Critical", count: 89, percentage: 7.1 },
      { urgency: "High", count: 234, percentage: 18.8 },
      { urgency: "Medium", count: 567, percentage: 45.5 },
      { urgency: "Low", count: 357, percentage: 28.6 },
    ],
    reportsByLocation: [
      { location: "Quezon City", count: 234, percentage: 18.8 },
      { location: "Manila", count: 189, percentage: 15.2 },
      { location: "Makati", count: 156, percentage: 12.5 },
      { location: "Pasig", count: 134, percentage: 10.7 },
      { location: "Marikina", count: 123, percentage: 9.9 },
      { location: "Others", count: 411, percentage: 32.9 },
    ],
    responseTeams: [
      {
        team: "Rescue Team Alpha",
        reports: 89,
        avgTime: "7.2 min",
        status: "active",
      },
      {
        team: "Medical Team Beta",
        reports: 67,
        avgTime: "9.1 min",
        status: "active",
      },
      {
        team: "Supply Team Gamma",
        reports: 45,
        avgTime: "12.3 min",
        status: "active",
      },
      {
        team: "Evacuation Team Delta",
        reports: 34,
        avgTime: "15.7 min",
        status: "deployed",
      },
    ],
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Analytics Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Comprehensive analytics and insights for emergency response operations
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.overview.totalReports.toLocaleString()}
            </div>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {analytics.overview.totalReportsChange} from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Avg Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.overview.averageResponseTime}
            </div>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {analytics.overview.responseTimeChange} improvement
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Active Rescuers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.overview.activeRescuers}
            </div>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {analytics.overview.rescuersChange} this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Resolved Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.overview.resolvedReports.toLocaleString()}
            </div>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {analytics.overview.resolvedChange} resolution rate
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reports by Urgency */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Reports by Urgency Level
            </CardTitle>
            <CardDescription>
              Distribution of emergency reports by urgency classification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.reportsByUrgency.map((item) => (
                <div
                  key={item.urgency}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Badge className={getUrgencyColor(item.urgency)}>
                      {item.urgency}
                    </Badge>
                    <span className="text-sm font-medium">
                      {item.count} reports
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reports by Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Reports by Location
            </CardTitle>
            <CardDescription>
              Geographic distribution of emergency reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.reportsByLocation.map((item) => (
                <div
                  key={item.location}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium w-20">
                      {item.location}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {item.count} reports
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Response Teams Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Response Teams Performance
          </CardTitle>
          <CardDescription>
            Performance metrics for active response teams
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.responseTeams.map((team) => (
              <div
                key={team.team}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <h4 className="font-semibold text-sm">{team.team}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {team.reports} reports handled
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {team.avgTime}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      avg response
                    </p>
                  </div>
                  <Badge
                    variant={team.status === "active" ? "default" : "secondary"}
                  >
                    {team.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Response Time Trends
            </CardTitle>
            <CardDescription>
              Average response times over the past 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 dark:text-gray-400">
                  Chart visualization
                </p>
                <p className="text-sm text-gray-500">
                  Integration with charting library
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Report Volume Trends
            </CardTitle>
            <CardDescription>Daily report volumes and patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 dark:text-gray-400">
                  Trend visualization
                </p>
                <p className="text-sm text-gray-500">
                  Integration with charting library
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
