"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
// Dynamically import Clerk components with SSR disabled
const ClerkLoading = dynamic(
  () => import("@clerk/nextjs").then((mod) => mod.ClerkLoading),
  { ssr: false }
);
const SignedIn = dynamic(
  () => import("@clerk/nextjs").then((mod) => mod.SignedIn),
  { ssr: false }
);
const UserButton = dynamic(
  () => import("@clerk/nextjs").then((mod) => mod.UserButton),
  { ssr: false }
);

import { GlowingWrapper } from "./glowing-effect";
import ShowAnnouncementModal from "../global/modal/show-announcement-modal";
import { Skeleton } from "./skeleton";

interface Props {
  withSideBar?: boolean;
}

export function MainHeader({ withSideBar = true }: Props) {
  const [isClient, setIsClient] = useState(false);

  // Track hydration so client-only UI renders after mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <GlowingWrapper>
      <header
        className="border-[0.75px] bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] flex h-[var(--header-height)] shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-[var(--header-height)] sticky top-0 rounded-xl"
        suppressHydrationWarning
      >
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          {withSideBar && <SidebarTrigger className="-ml-1" />}
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-medium">Kawit Emergency App</h1>
          <div className="ml-auto flex items-center gap-2">
            {/* Notifications */}
            <ShowAnnouncementModal />

            {/* Clerk loading and UserButton rendered client-side only */}
            {isClient ? (
              <>
                <ClerkLoading>
                  <div className="flex items-center justify-center h-9 w-9">
                    <Skeleton className="rounded-full h-9 w-9" />
                  </div>
                </ClerkLoading>
                <SignedIn>
                  <UserButton
                    appearance={{
                      elements: {
                        userButtonAvatarBox: "w-9 h-9",
                      },
                    }}
                  />
                </SignedIn>
              </>
            ) : (
              // Fallback skeleton placeholder during SSR
              <div className="flex items-center justify-center h-9 w-9">
                <Skeleton className="rounded-full h-9 w-9" />
              </div>
            )}
          </div>
        </div>
      </header>
    </GlowingWrapper>
  );
}
