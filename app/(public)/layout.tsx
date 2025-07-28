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
      {/* Background Image */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/stormy-background.png')`,
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Custom CSS for animations and glass effects */}

      {/* Header - Fixed positioning */}
      <MainHeader />

      {/* Main Content - Add top padding to account for fixed header */}
      <div className="relative z-10 text-white pt-20">
        {children}

        {/* Footer */}
        <MainFooter />
      </div>
    </div>
  );
}
