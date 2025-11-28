"use client";

import { FC } from "react";
import { User } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Clock,
  Edit,
  Mail,
  Phone,
  User as UserIcon,
  House,
  MapPin,
} from "lucide-react";
import { ContactButton } from "@/components/ui/contact-button";
import {
  callNumber,
  openGmailComposeWithRecipient,
  openGoogleMaps,
} from "@/lib/utils";
import { GlowingWrapper } from "@/components/ui/glowing-effect";
import { GradientWrapper } from "@/components/ui/background-gradient";
import { ImageAvatar } from "../image-avatar";

interface Props {
  users: User[];
  formatTimeAgo: (date: string) => string;
  onSelectUser: (user: User) => void;
}

export const UserList: FC<Props> = ({ users, formatTimeAgo, onSelectUser }) => {
  if (users.length === 0) {
    return (
      <GlowingWrapper>
        <Card className="border-0.75 bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] relative z-10">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <UserIcon className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No users found
            </h3>
            <p className="text-sm text-gray-500 text-center max-w-sm">
              No users match your current filters. Try adjusting your search
              criteria.
            </p>
          </CardContent>
        </Card>
      </GlowingWrapper>
    );
  }

  return (
    <div className="space-y-4">
      {users.map((user, index) => (
        <GlowingWrapper key={(user.id, index)}>
          <Card className="group shadow-sm hover:shadow-md transition-all duration-200 border-0.75 bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] py-0">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <ImageAvatar
                    name={user?.name}
                    email={user?.email}
                    imageUrl={user?.imageUrl}
                    color="from-blue-500 to-blue-600"
                  />
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <h4 className="font-semibold text-lg">
                      {user.name.length > 0 ? user.name : user.email}
                    </h4>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-white bg-blue-600 px-3 py-1 rounded-full">
                  <Clock className="h-3 w-3" />
                  <span className="hidden sm:inline">Joined:</span>
                  <span>{formatTimeAgo(user.created_at)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <ContactButton
                        icon={Phone}
                        label="Contact Number"
                        value={user.phone_number}
                        onClick={() => {
                          if (user.phone_number.length > 0) {
                            callNumber(user.phone_number!);
                          } else {
                            return;
                          }
                        }}
                        iconColor="text-green-400"
                      />
                      <ContactButton
                        icon={Mail}
                        label="Email"
                        value={user.email}
                        onClick={() => {
                          if (user.email.length > 0) {
                            openGmailComposeWithRecipient(user.email);
                          } else {
                            return;
                          }
                        }}
                        iconColor="text-blue-400"
                      />
                      <ContactButton
                        icon={House}
                        label="Barangay"
                        value={user.barangays?.name || "N/A"}
                        onClick={() =>
                          openGoogleMaps(
                            {
                              lat: user.barangays?.latitude as number,
                              lng: user.barangays?.longitude as number,
                            },
                            user.barangays?.address
                          )
                        }
                        iconColor="text-blue-400"
                      />
                      <ContactButton
                        icon={MapPin}
                        label="Address"
                        value={user.address || "N/A"}
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
                    onClick={() => onSelectUser(user)}
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
