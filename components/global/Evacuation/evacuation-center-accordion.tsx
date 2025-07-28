import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Shield,
  Plus,
  Edit,
  Trash2,
  MapPin,
  Phone,
  Users,
  Building2,
  Calendar,
  Activity,
} from "lucide-react";
import { RawEvacuationCenter } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stats";
import { ContactButton } from "@/components/ui/contact-button";
import { formatReadableDate } from "@/lib/utils";

interface EvacuationCenterAccordionProps {
  center: RawEvacuationCenter;
  onEditCenter: (center: RawEvacuationCenter) => void;
  onDeleteCenter: (id: string, name: string) => void;
  onAddBarangay: (brgyIds: string[]) => void;
  onAddCenterId: (id: string) => void;
  onOpenMap: (
    coordinates?: { lat: number; lng: number },
    address?: string
  ) => void;
  onCallNumber: (phoneNumber: string) => void;
}

export const EvacuationCenterAccordion: React.FC<
  EvacuationCenterAccordionProps
> = ({
  center,
  onEditCenter,
  onDeleteCenter,
  onAddBarangay,
  onAddCenterId,
  onOpenMap,
  onCallNumber,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "default";
      case "inactive":
        return "secondary";
      case "maintenance":
        return "outline";
      case "full":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const handleDeleteCenter = () => {
    onDeleteCenter(center.id, center.name);
  };

  const coordinates =
    center.latitude && center.longitude
      ? { lat: center.latitude, lng: center.longitude }
      : undefined;

  return (
    <Card className="overflow-hidden bg-muted dark:bg-black">
      <CardContent className="p-0">
        {/* Header */}
        <div
          className="p-6 cursor-pointer hover:bg-muted transition-all duration-300"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-black rounded-2xl flex items-center justify-center shadow-lg">
                <Shield size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">{center.name}</h3>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Building2 size={14} />
                    {center.barangays?.length || 0} barangay
                    {(center.barangays?.length || 0) !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditCenter(center);
                  }}
                >
                  <Edit size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCenter();
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
              <Badge variant={getStatusColor(center.status)}>
                {center.status.charAt(0).toUpperCase() + center.status.slice(1)}
              </Badge>
              {isExpanded ? (
                <ChevronUp size={20} className="text-gray-400" />
              ) : (
                <ChevronDown size={20} className="text-gray-400" />
              )}
            </div>
          </div>
        </div>

        {/* Center Details */}
        {isExpanded && (
          <div className="px-6 pb-4">
            <div className="border-t dark:border-gray-100 pt-6 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-black rounded-lg flex items-center justify-center">
                    <Activity size={16} className="text-white" />
                  </div>
                  <h4 className="font-bold">Contact Information</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {center.address && (
                    <ContactButton
                      icon={MapPin}
                      label="Location"
                      value={center.address}
                      onClick={() => onOpenMap(coordinates, center.address)}
                      iconColor="text-blue-400"
                    />
                  )}
                  {center.phone && (
                    <ContactButton
                      icon={Phone}
                      label="Contact Number"
                      value={center.phone}
                      onClick={() => onCallNumber(center.phone!)}
                      iconColor="text-green-400"
                    />
                  )}
                </div>
              </div>

              {/* Center Statistics */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-black rounded-lg flex items-center justify-center">
                    <Users size={16} className="text-white" />
                  </div>
                  <h4 className="font-bold">Center Information</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <StatCard
                    icon={MapPin}
                    label="Address"
                    value={`${center.address}`}
                    iconColor="text-blue-400"
                  />
                  <StatCard
                    icon={Calendar}
                    label="Created"
                    value={formatReadableDate(center.created_at)}
                    iconColor="text-red-400"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Barangays Section */}
        {isExpanded && (
          <div className="px-0 pb-0">
            <Card className="rounded-2xl p-6 border-none gap-2 bg-muted shadow-none dark:bg-black ">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-black rounded-lg flex items-center justify-center">
                    <Shield size={16} className="text-white" />
                  </div>
                  <h4 className="font-bold">Associated Barangays</h4>
                </div>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => {
                    const assignedIds =
                      center.evacuation_center_barangays?.map(
                        (b) => b.barangay_id
                      ) ?? [];
                    onAddBarangay(assignedIds);
                    onAddCenterId(center.id);
                  }}
                  className="cursor-pointer"
                >
                  <Plus size={16} className="mr-2" />
                  Add Barangay
                </Button>
              </div>

              {!center.barangays || center.barangays.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-200 to-blue-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Shield size={32} className="text-blue-600" />
                  </div>
                  <p className="font-medium mb-2">
                    No barangays associated yet. Start by adding the first
                    barangay for this evacuation center.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {center.barangays.map((barangay) => {
                    const barangayCoordinates =
                      barangay.latitude && barangay.longitude
                        ? { lat: barangay.latitude, lng: barangay.longitude }
                        : undefined;

                    return (
                      <Card
                        key={barangay.id}
                        className="p-5 border-2 hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-0">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex flex-row items-center gap-2">
                              <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                                <span className="text-white font-semibold text-sm">
                                  {barangay.name.charAt(0)}
                                </span>
                              </div>
                              <div className="flex-1">
                                <h5 className="font-bold line-clamp-2">
                                  {barangay.name}
                                </h5>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2 mb-4">
                            {barangay.address && (
                              <ContactButton
                                icon={MapPin}
                                label="Location"
                                value={barangay.address}
                                onClick={() =>
                                  onOpenMap(
                                    barangayCoordinates,
                                    barangay.address
                                  )
                                }
                                iconColor="text-green-400"
                              />
                            )}
                            {barangay.phone && (
                              <ContactButton
                                icon={Phone}
                                label="Contact"
                                value={barangay.phone}
                                onClick={() => onCallNumber(barangay.phone!)}
                                iconColor="text-blue-400"
                              />
                            )}
                            <StatCard
                              icon={Calendar}
                              label="Created"
                              value={new Date(
                                barangay.created_at
                              ).toLocaleDateString()}
                              iconColor="text-red-400"
                            />
                          </div>

                          <div className="pt-3 border-t border-gray-100">
                            <div className="flex gap-2">
                              {barangayCoordinates && (
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() =>
                                    onOpenMap(
                                      barangayCoordinates,
                                      barangay.address
                                    )
                                  }
                                  className="flex-1"
                                >
                                  <MapPin size={16} className="mr-2" />
                                  Map
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
