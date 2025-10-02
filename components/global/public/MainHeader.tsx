import { Button } from "@/components/ui/button";
import { IconCloudFilled } from "@tabler/icons-react";
import { AlertTriangle, Download, User } from "lucide-react";
import Link from "next/link";
import React from "react";

const MainHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 ">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <Link href="/">
              <div className=" rounded-xl">
                <IconCloudFilled className="h-6 w-6 text-white" />
              </div>
            </Link>

            <div>
              <Link href="/">
                <span className="font-sans font-extralight text-md text-white">
                  forecast now
                </span>
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/user">
              <Button
                size="sm"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                <User className="h-4 w-4 mr-2" />
                Log In
              </Button>
            </Link>
            <Button
              size="sm"
              variant="outline"
              className="bg-transparent text-white hover:bg-white/20"
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
