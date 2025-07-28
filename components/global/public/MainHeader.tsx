import { Button } from "@/components/ui/button";
import { AlertTriangle, Download, User } from "lucide-react";
import Link from "next/link";
import React from "react";

const MainHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/10">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Link href="/">
              <div className="p-2 glass-effect rounded-xl">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
            </Link>

            <div>
              <Link href="/">
                <span className="text-xl font-bold text-white">
                  WeatherWise
                </span>
                <div className="text-xs text-gray-300">
                  Emergency Response System
                </div>
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/apply">
              <Button
                size="sm"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 glass-effect"
              >
                <User className="h-4 w-4 mr-2" />
                Apply
              </Button>
            </Link>
            <Button
              size="sm"
              className="glass-effect text-white hover:bg-white/20"
            >
              <Download className="h-4 w-4 mr-2" />
              Download App
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MainHeader;
