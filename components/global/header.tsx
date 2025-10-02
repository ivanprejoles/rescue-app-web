import React from "react";
import { FileText, LucideIcon } from "lucide-react";
import { GlowingWrapper } from "../ui/glowing-effect";

interface Props {
  header: string;
  description: string;
  children?: React.ReactNode;
  icon: LucideIcon;
}

const SidebarHeader = ({
  header,
  description,
  children,
  icon: Icon = FileText,
}: Props) => {
  return (
    <GlowingWrapper>
      <div className="border-0.75 bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] rounded-xl relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Icon className="w-6 h-6 text-white" />
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
    </GlowingWrapper>
  );
};

export default SidebarHeader;
