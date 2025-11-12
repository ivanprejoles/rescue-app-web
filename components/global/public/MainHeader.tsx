"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User, Download, Hospital } from "lucide-react";
import { GlowingWrapper } from "@/components/ui/glowing-effect";
import ShowAnnouncementModal from "../modal/show-announcement-modal";
import { useEffect, useState } from "react";

const MainHeader = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !isLoaded) return null; // or a loading state

  return (
    <header className="fixed top-0 z-50 p-2 w-full bg-transparent">
      <GlowingWrapper className="bg-white bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10">
        <div className="flex flex-row justify-between h-full items-center">
          <div className="flex flex-row gap-2 h-full ml-2">
            <Link href="/">
              <Hospital className="h-6 w-6 text-blue-600 drop-shadow-[0_0_2px_rgba(0,0,0,0.7)]" />
            </Link>
            <Link href="/">
              <h1 className="drop-shadow-[0_0_2px_rgba(0,0,0,0.7)] md:flex hidden">
                Kawit Emergency App
              </h1>
            </Link>
          </div>
          <div className="flex items-center gap-2 md:gap-4 justify-end">
            <ShowAnnouncementModal />
            {isSignedIn ? (
              <Link href="/user">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 bg-transparent cursor-pointer drop-shadow-[0_0_2px_rgba(0,0,0,0.7)] text-xs md:text-base"
                >
                  <User className="h-4 w-4 mr-2 drop-shadow-[0_0_2px_rgba(0,0,0,0.7)]" />
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/sign-in">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 bg-transparent cursor-pointer drop-shadow-[0_0_2px_rgba(0,0,0,0.7)] text-xs md:text-base"
                >
                  <User className="h-4 w-4 mr-2 drop-shadow-[0_0_2px_rgba(0,0,0,0.7)]" />
                  Log In
                </Button>
              </Link>
            )}
            <Link
              href="https://www.dropbox.com/scl/fi/kzcmdom6jqg7nexx1epi0/application-7ff286b0-160d-4aaf-b867-7c30ed536e5d.apk?rlkey=az4zq8bu2e5aa4qifyik88yfy&st=hqmw5mga&dl=1"
              download
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="sm"
                variant="outline"
                className="bg-transparent text-white hover:bg-white/20 cursor-pointer drop-shadow-[0_0_2px_rgba(0,0,0,0.7)] text-xs md:text-base"
              >
                <Download className="h-4 w-4 mr-2 drop-shadow-[0_0_2px_rgba(0,0,0,0.7)]" />
                Download App
              </Button>
            </Link>
          </div>
        </div>
      </GlowingWrapper>
    </header>
  );
};

export default MainHeader;
