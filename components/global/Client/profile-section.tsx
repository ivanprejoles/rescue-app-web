/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect } from "react";
import { useUser } from "@clerk/nextjs"; // or @clerk/clerk-react depending on your setup
import {
  AtSign,
  Landmark,
  Mail,
  MapPin,
  Phone,
  User,
  User2,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { GlowingWrapper } from "@/components/ui/glowing-effect";
import { GradientWrapper } from "@/components/ui/background-gradient";
import { useProfileModalStore } from "@/hooks/modals/use-update-profile-modal";
import { ClientAccessUser } from "@/lib/types";
import { formatReadableDate } from "@/lib/utils";
import { useFormValidation } from "@/hooks/use-form-validation";

interface Props {
  data: ClientAccessUser;
}

const ProfileSection = ({ data }: Props) => {
  const { user } = useUser();
  const openModal = useProfileModalStore((state) => state.openModal);

  const { openModal: openFormModal } = useFormValidation();

  // ✅ Helper function to check if user info is incomplete
  const isUserIncomplete = (user: any) => {
    if (!user) return true;

    const isEmpty = (value: any) =>
      value === null ||
      value === undefined ||
      (typeof value === "string" && value.trim().length === 0);

    return (
      isEmpty(user.name) ||
      isEmpty(user.phone_number) ||
      isEmpty(user.address) ||
      (isEmpty(user.brgy_id) && isEmpty(user.barangays?.id)) ||
      user.user_type === "unverified"
    );
  };

  // ✅ Open modal if user info is incomplete
  useEffect(() => {
    if (data && isUserIncomplete(data)) {
      openFormModal({
        id: data.id,
        name: data.name ?? "",
        phone_number: data.phone_number ?? "",
        address: data.address ?? "",
        brgyId: data.barangays?.id ?? "",
      });
    }
  }, []);

  const handleOpenEditModal = () => {
    openModal({
      id: data.id,
      name: data.name,
      phone_number: data.phone_number ?? "",
      address: data.address ?? "",
      brgyId: data.barangays?.id ?? "",
    });
  };

  return (
    <GlowingWrapper>
      <Card className="border-0.75 bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] relative z-10 ">
        <CardHeader className="relative pb-0">
          <div className="absolute top-6 right-6 z-10">
            <GradientWrapper>
              <Button
                onClick={handleOpenEditModal}
                className="shadow-lg hover:shadow-xl transition-shadow rounded-[22px] cursor-pointer"
                size="sm"
                variant="outline"
              >
                Edit Profile
              </Button>
            </GradientWrapper>
          </div>

          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pt-6">
            <Avatar className="w-32 h-32 shadow-xl ring-4 ring-white">
              {/* Use Clerk user image if available, otherwise fallback to your data.imageUrl */}
              <AvatarImage
                src={user?.imageUrl}
                alt={data.name}
                className="object-cover"
              />
              <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                {data.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="text-center sm:text-left flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
                <h2 className="text-3xl font-bold">{data.name}</h2>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-4">
                <Badge
                  variant="outline"
                  className={`font-medium px-3 py-1 ${
                    data.user_type === "rescuer"
                      ? "bg-purple-100 text-purple-800 border-purple-200"
                      : "bg-blue-50 text-blue-700 border-blue-200"
                  }`}
                >
                  {data.user_type.charAt(0).toUpperCase() +
                    data.user_type.slice(1)}
                </Badge>
              </div>

              <p className="">
                Member since {formatReadableDate(new Date(data.created_at))}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-8">
          <Separator className="mb-8" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Contact Information
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium ">
                    <User2 className="w-5 h-5" />
                    Full Name
                  </Label>
                  <GlowingWrapper>
                    <Card className="border-0.75 flex-row gap-2 h-auto py-1 px-2 bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] relative z-10 ">
                      {data.name}
                    </Card>
                  </GlowingWrapper>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    <AtSign className="w-5 h-5" />
                    Email Address
                  </Label>
                  <GlowingWrapper>
                    <Card className="border-0.75 flex-row gap-2 h-auto py-1 px-2 bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] relative z-10 ">
                      {data.email}
                    </Card>
                  </GlowingWrapper>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    <Phone className="w-5 h-5" />
                    Phone Number
                  </Label>
                  <GlowingWrapper>
                    <Card className="border-0.75 flex-row gap-2 h-auto py-1 px-2 bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] relative z-10 ">
                      {data.phone_number || "N/A"}
                    </Card>
                  </GlowingWrapper>
                </div>
              </div>
            </div>

            {/* Profile Settings */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Settings
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    <User2 className="w-5 h-5" />
                    Account Type
                  </Label>
                  <GlowingWrapper>
                    <Card className="border-0.75 flex-row gap-2 h-auto py-1 px-2 bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] relative z-10 ">
                      {data.user_type.charAt(0).toUpperCase() +
                        data.user_type.slice(1)}
                    </Card>
                  </GlowingWrapper>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    <Landmark className="w-5 h-5" />
                    Barangay
                  </Label>
                  <GlowingWrapper>
                    <Card className="border-0.75 text-sm h-auto py-1 px-2 bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] relative z-10 ">
                      {data.barangays?.address || "N/A"}
                    </Card>
                  </GlowingWrapper>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    <MapPin className="w-5 h-5" />
                    Address
                  </Label>
                  <GlowingWrapper>
                    <Card className="border-0.75 text-sm h-auto py-1 px-2 bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] relative z-10 ">
                      {data.address || "N/A"}
                    </Card>
                  </GlowingWrapper>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </GlowingWrapper>
  );
};

export default ProfileSection;
