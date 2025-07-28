import React from "react";
import { Shield, Building2 } from "lucide-react";

export const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-xl flex items-center justify-center shadow-lg">
          <Shield size={24} className="text-white" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
          <Building2 size={12} className="text-white" />
        </div>
      </div>
      <div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          SafeGuard
        </h1>
        <p className="text-sm text-gray-500 font-medium">
          Emergency Management
        </p>
      </div>
    </div>
  );
};
