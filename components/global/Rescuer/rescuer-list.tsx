"use client";

import { FC } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Clock,
  Edit,
  Mail,
  Phone,
  Shield,
  House,
  HeartHandshake,
} from "lucide-react";
import { ContactButton } from "@/components/ui/contact-button";
import {
  callNumber,
  openGmailComposeWithRecipient,
  openGoogleMaps,
} from "@/lib/utils";
import { User } from "@/lib/types";
import { GlowingWrapper } from "@/components/ui/glowing-effect";
import { GradientWrapper } from "@/components/ui/background-gradient";

interface RescuerListProps {
  rescuers: User[];
  formatTimeAgo: (date: Date) => string;
  getStatusColor: (status: string) => string;
  onSelectRescuer: (rescuer: User) => void;
}

export const RescuerList: FC<RescuerListProps> = ({
  rescuers,
  onSelectRescuer,
}) => {
  if (rescuers.length === 0) {
    return (
      <GlowingWrapper>
        <Card className="border-0.75 bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] relative z-10">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Shield className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No rescuers found
            </h3>
            <p className="text-sm text-gray-500 text-center max-w-sm">
              No rescuers match your current filters. Try adjusting your search
              criteria.
            </p>
          </CardContent>
        </Card>
      </GlowingWrapper>
    );
  }

  return (
    <div className="space-y-4">
      {rescuers.map((rescuer, index) => (
        <GlowingWrapper key={(rescuer.id, index)}>
          <Card className="group shadow-sm hover:shadow-md transition-all duration-200 border-0.75 bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] py-0">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white font-semibold text-sm">
                    {rescuer.name.charAt(0).toUpperCase()}
                  </div>
                  <h4 className="font-semibold text-lg">{rescuer.name}</h4>
                </div>
                <div className="flex items-center gap-2 text-sm text-white bg-purple-500 px-3 py-1 rounded-full">
                  <Clock className="h-3 w-3" />
                  <span className="hidden sm:inline">Joined:</span>
                  <span>
                    {new Date(rescuer.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <Badge
                        variant="outline"
                        className="text-xs border-purple-200 text-purple-700 bg-purple-50"
                      >
                        <Shield className="h-3 w-3 mr-1" />
                        Emergency Responder
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <ContactButton
                        icon={Phone}
                        label="Contact Number"
                        value={rescuer.phone_number}
                        onClick={() => callNumber(rescuer.phone_number!)}
                        iconColor="text-green-400"
                      />
                      <ContactButton
                        icon={Mail}
                        label="Email"
                        value={rescuer.email}
                        onClick={() =>
                          openGmailComposeWithRecipient(rescuer.email)
                        }
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
                        icon={HeartHandshake}
                        label="Rescuing"
                        value={
                          rescuer.markers_as_rescuer.length > 0 &&
                          rescuer.markers_as_rescuer[0].type
                            ? "Active!"
                            : "Inactive"
                        }
                        onClick={
                          rescuer.markers_as_rescuer.length > 0
                            ? () =>
                                openGoogleMaps(
                                  {
                                    lat: rescuer.markers_as_rescuer[0].latitude,
                                    lng: rescuer.markers_as_rescuer[0]
                                      .longitude,
                                  },
                                  rescuer.barangays?.address
                                )
                            : undefined
                        }
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
                    onClick={() => onSelectRescuer(rescuer)}
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
