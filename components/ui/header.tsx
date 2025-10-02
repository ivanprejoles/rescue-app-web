"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell } from "lucide-react";
import { ClerkLoading, SignedIn, UserButton } from "@clerk/nextjs";
import { ModeToggle } from "./mode-toggle";
import { Badge } from "./badge";
import { Skeleton } from "./skeleton";
import { GlowingWrapper } from "./glowing-effect";

interface Props {
  withSideBar?: boolean;
}

export function MainHeader({ withSideBar = true }: Props) {
  return (
    <GlowingWrapper>
      <header
        className="border-0.75 bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] flex h-(--header-height) shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) sticky top-0 rounded-xl"
        suppressHydrationWarning
      >
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          {withSideBar && <SidebarTrigger className="-ml-1" />}
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-medium">Documents</h1>
          <div className="ml-auto flex items-center gap-2">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
                3
              </Badge>
            </Button>

            <ModeToggle />

            {/* clerk icon */}
              <ClerkLoading>
                <div className="flex items-center justify-center h-9 w-9">
                  <Skeleton className="rounded-full h-9 w-9" />
                </div>
              </ClerkLoading>
              <SignedIn>
                <UserButton
                  // afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-9 h-9",
                    },
                  }}
                />
              </SignedIn>
          </div>
        </div>
      </header>
    </GlowingWrapper>
  );
}
