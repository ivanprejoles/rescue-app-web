"use client";

import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Edit, Mail, Phone, Shield, House, MapPin } from "lucide-react";
import { ContactButton } from "@/components/ui/contact-button";
import {
  callNumber,
  openGmailComposeWithRecipient,
  openGoogleMaps,
} from "@/lib/utils";
import { User } from "@/lib/types";
import { GlowingWrapper } from "@/components/ui/glowing-effect";
import { GradientWrapper } from "@/components/ui/background-gradient";
import { ImageAvatar } from "../image-avatar";

interface UnverifiedListProps {
  unverified: User[];
  onSelectUnverified: (unverified: User) => void;
}

export const UnverifiedList: FC<UnverifiedListProps> = ({
  unverified,
  onSelectUnverified,
}) => {
  if (unverified.length === 0) {
    return (
      <GlowingWrapper>
        <Card className="border-0.75 bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] relative z-10">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Shield className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No unverified users found
            </h3>
            <p className="text-sm text-gray-500 text-center max-w-sm">
              No unverified users match your current filters. Try adjusting your
              search criteria.
            </p>
          </CardContent>
        </Card>
      </GlowingWrapper>
    );
  }

  return (
    <div className="space-y-4">
      {unverified.map((rescuer, index) => (
        <GlowingWrapper key={(rescuer.id, index)}>
          <Card className="group shadow-sm hover:shadow-md transition-all duration-200 border-0.75 bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] py-0">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <ImageAvatar
                    name={rescuer?.name}
                    email={rescuer?.email}
                    imageUrl={rescuer?.imageUrl}
                  />

                  <h4 className="font-semibold text-lg">
                    {rescuer.name.length > 0 ? rescuer.name : rescuer.email}
                  </h4>
                </div>
                <div className="flex items-center gap-2 text-sm text-white bg-gray-500 px-3 py-1 rounded-full">
                  <Clock className="h-3 w-3" />
                  <span className="hidden sm:inline">Joined:</span>
                  <span>
                    {new Date(rescuer.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* valid id image */}
              <div className="flex flex-col gap-2 items-center justify-between mb-4">
                <div className="text-sm text-white">Valid ID</div>
                <div className="flex items-center gap-3">
                  <ImageAvatar
                    notAvatar={true}
                    imageUrl={rescuer?.validImageUrl}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <ContactButton
                        icon={Phone}
                        label="Contact Number"
                        value={rescuer.phone_number}
                        onClick={() => {
                          if (rescuer.phone_number.length > 0) {
                            callNumber(rescuer.phone_number!);
                          } else {
                            return;
                          }
                        }}
                        iconColor="text-green-400"
                      />
                      <ContactButton
                        icon={Mail}
                        label="Email"
                        value={rescuer.email}
                        onClick={() => {
                          if (rescuer.email.length > 0) {
                            openGmailComposeWithRecipient(rescuer.email);
                          } else {
                            return;
                          }
                        }}
                        iconColor="text-blue-400"
                      />
                      <ContactButton
                        icon={House}
                        label="Barangay"
                        value={rescuer.barangays?.name || "N/A"}
                        onClick={() =>
                          openGoogleMaps(
                            {
                              lat: rescuer.barangays?.latitude as number,
                              lng: rescuer.barangays?.longitude as number,
                            },
                            rescuer.barangays?.address
                          )
                        }
                        iconColor="text-blue-400"
                      />
                      <ContactButton
                        icon={MapPin}
                        label="Address"
                        value={rescuer.address || "N/A"}
                        // onClick={() => {}}
                        iconColor="text-red-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4 w-full justify-end">
                <GradientWrapper>
                  <Button
                    size="sm"
                    variant="outline"
                    className="shadow-lg hover:shadow-xl transition-shadow rounded-[22px] cursor-pointer"
                    onClick={() => onSelectUnverified(rescuer)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </GradientWrapper>
              </div>
            </CardContent>
          </Card>
        </GlowingWrapper>
      ))}
    </div>
  );
};
