import { RefreshCw, Clock, CheckCircle, XCircle } from "lucide-react";

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
