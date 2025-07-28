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
  Megaphone,
} from "lucide-react";
import { ContactButton } from "@/components/ui/contact-button";
import {
  callNumber,
  openGmailComposeWithRecipient,
  openGoogleMaps,
} from "@/lib/utils";

interface Props {
  users: User[];
  formatTimeAgo: (date: string) => string;
  getStatusColor: (status: string) => string;
  onSelectUser: (user: User) => void;
}

export const UserList: FC<Props> = ({
  users,
  formatTimeAgo,
  getStatusColor,
  onSelectUser,
}) => {
  if (users.length === 0) {
    return (
      <Card className="border-dashed border-2 border-gray-200">
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
    );
  }

  return (
    <div className="space-y-4">
      {users.map((user, index) => (
        <Card
          key={(user.id, index)}
          className="group shadow-sm hover:shadow-md transition-all duration-200 @container/card"
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <h4 className="font-semibold text-lg">{user.name}</h4>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
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
                      onClick={() => callNumber(user.phone_number!)}
                      iconColor="text-green-400"
                    />
                    <ContactButton
                      icon={Mail}
                      label="Email"
                      value={user.email}
                      onClick={() => openGmailComposeWithRecipient(user.email)}
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
                      icon={Megaphone}
                      label="Report"
                      value={
                        user.markers_as_user.length > 0 &&
                        user.markers_as_user[0].type
                          ? "Emergency!"
                          : "Inactive"
                      }
                      onClick={
                        user.markers_as_user.length > 0
                          ? () =>
                              openGoogleMaps(
                                {
                                  lat: user.markers_as_user[0].latitude,
                                  lng: user.markers_as_user[0].longitude,
                                },
                                user.barangays?.address
                              )
                          : undefined // No click handler if no markers, so button is inert
                      }
                      iconColor="text-red-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-6 pt-4 border-t border-gray-100">
              <Button
                size="sm"
                variant="outline"
                className="hover:bg-gray-50 hover:text-gray-700 transition-colors cursor-pointer"
                onClick={() => onSelectUser(user)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
