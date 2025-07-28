import {
  AlertTriangle,
  Building2,
  Activity,
  RefreshCw,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

export const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Natural Disaster":
      return <AlertTriangle className="w-4 h-4" />;
    case "Infrastructure":
      return <Building2 className="w-4 h-4" />;
    case "Public Health":
      return <Activity className="w-4 h-4" />;
    case "Environmental":
      return <RefreshCw className="w-4 h-4" />;
    default:
      return <FileText className="w-4 h-4" />;
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <Clock className="w-4 h-4" />;
    case "in-progress":
      return <RefreshCw className="w-4 h-4" />;
    case "resolved":
      return <CheckCircle className="w-4 h-4" />;
    case "failed":
      return <XCircle className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

export const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case "low":
      return <Clock className="w-3 h-3" />;
    case "medium":
      return <AlertTriangle className="w-3 h-3" />;
    case "high":
      return <AlertTriangle className="w-3 h-3" />;
    case "urgent":
      return <AlertTriangle className="w-3 h-3" />;
    default:
      return <Clock className="w-3 h-3" />;
  }
};
