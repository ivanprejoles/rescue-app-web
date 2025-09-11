import type React from "react";
import MainHeader from "@/components/global/public/MainHeader";
import MainFooter from "@/components/global/public/MainFooter";

export default function PublicDocsPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Custom CSS for animations and glass effects */}

      {/* Header - Fixed positioning */}
      <MainHeader />

      {/* Main Content - Add top padding to account for fixed header */}
      <div className="relative z-10 text-white">
        {children}

        {/* Footer */}
        <MainFooter />
      </div>
    </div>
  );
}
