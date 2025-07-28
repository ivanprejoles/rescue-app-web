import React from "react";
import { FileText } from "lucide-react";

interface Props {
  header: string;
  description: string;
  children?: React.ReactNode;
}

const SidebarHeader = ({ header, description, children }: Props) => {
  return (
    <div className="bg-white dark:bg-black shadow-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{header}</h1>
                <p className="mt-1 flex items-center space-x-2">
                  <span>{description}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarHeader;
