import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rescuer } from "@/lib/types";

interface Props {
  rescuers: Rescuer[];
}

export default function RescuerStats({ rescuers }: Props) {
  const stats = {
    total: rescuers.length,
    available: rescuers.filter((r) => r.currentStatus === "available").length,
    deployed: rescuers.filter((r) => r.currentStatus === "deployed").length,
    totalRescues: rescuers.reduce((sum, r) => sum + r.completedRescues, 0),
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Rescuers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Available</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {stats.available}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Deployed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {stats.deployed}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Rescues</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {stats.totalRescues}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
