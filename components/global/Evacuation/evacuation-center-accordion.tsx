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
import { StatCard } from "@/components/ui/stats";
import { ContactButton } from "@/components/ui/contact-button";
import { formatReadableDate } from "@/lib/utils";
import { GlowingWrapper } from "@/components/ui/glowing-effect";
import { GradientWrapper } from "@/components/ui/background-gradient";
import { motion } from "framer-motion";
import Image from "next/image";

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

  const handleDeleteCenter = () => {
    onDeleteCenter(center.id, center.name);
  };

  const coordinates =
    center.latitude && center.longitude
      ? { lat: center.latitude, lng: center.longitude }
      : undefined;

  return (
    <GlowingWrapper>
      <Card className="border-0.75 bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] relative z-10 py-0">
        <CardContent className="p-0">
          <div
            className="p-6 cursor-pointer hover:bg-muted transition-all duration-300 rounded-xl"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-black rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden">
                  {center.imageUrl ? (
                    <Image
                      alt="marker-image"
                      src={center.imageUrl}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <Shield size={24} className="text-white" />
                  )}
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
                  <GradientWrapper>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditCenter(center);
                      }}
                      className="shadow-lg hover:shadow-xl transition-shadow rounded-full cursor-pointer"
                    >
                      <Edit size={16} />
                    </Button>
                  </GradientWrapper>
                  <GradientWrapper>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCenter();
                      }}
                      className="text-red-600 hover:text-red-700 shadow-lg hover:shadow-xl transition-shadow rounded-full cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </GradientWrapper>
                  <GradientWrapper>
                    <div className=" h-[36px] w-[36px] m-auto flex rounded-full items-center justify-center text-center">
                      {isExpanded ? (
                        <ChevronUp size={20} className="text-gray-400" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-400" />
                      )}
                    </div>
                  </GradientWrapper>
                </div>
              </div>
            </div>
          </div>

          {/* Center Details */}
          {isExpanded && (
            <motion.div
              key="center-details"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden px-6 pb-4"
            >
              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-2 my-4">
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
                  <div className="flex items-center gap-2 my-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-black rounded-lg flex items-center justify-center">
                      <Users size={16} className="text-white" />
                    </div>
                    <h4 className="font-bold">Center Information</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <StatCard
                      icon={Building2}
                      label="Barangays"
                      value={`${center.barangays?.length || 0} barangay${
                        (center.barangays?.length || 0) !== 1 ? "s" : ""
                      }`}
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
            </motion.div>
          )}

          {/* Barangays Section */}
          {isExpanded && (
            <motion.div
              key="barangays"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden px-0 pb-0"
            >
              <Card className="rounded-2xl p-6 border-none gap-2 bg-muted shadow-none dark:bg-black ">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-black rounded-lg flex items-center justify-center">
                      <Shield size={16} className="text-white" />
                    </div>
                    <h4 className="font-bold">Associated Barangays</h4>
                  </div>
                  <GradientWrapper>
                    <Button
                      variant="outline"
                      onClick={() => {
                        const assignedIds =
                          center.evacuation_center_barangays?.map(
                            (b) => b.barangay_id
                          ) ?? [];
                        onAddBarangay(assignedIds);
                        onAddCenterId(center.id);
                      }}
                      className="shadow-lg hover:shadow-xl transition-shadow rounded-[22px] cursor-pointer"
                    >
                      <Plus size={16} className="h-5 w-5 mr-2" />
                      Add Barangay
                    </Button>
                  </GradientWrapper>
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
                    {center.barangays.map((barangay, index) => {
                      const barangayCoordinates =
                        barangay.latitude && barangay.longitude
                          ? { lat: barangay.latitude, lng: barangay.longitude }
                          : undefined;

                      return (
                        <GlowingWrapper key={index}>
                          <Card className="p-5 border-0.75 h-full bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] relative z-10">
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
                                    onClick={() =>
                                      onCallNumber(barangay.phone!)
                                    }
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

                              <div>
                                <div className="grid grid-cols-1 gap-2">
                                  {barangayCoordinates && (
                                    <GradientWrapper>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          onOpenMap(
                                            barangayCoordinates,
                                            barangay.address
                                          )
                                        }
                                        className="shadow-lg hover:shadow-xl transition-shadow rounded-[22px] cursor-pointer w-full"
                                      >
                                        <MapPin size={16} className="mr-2" />
                                        Map
                                      </Button>
                                    </GradientWrapper>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </GlowingWrapper>
                      );
                    })}
                  </div>
                )}
              </Card>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </GlowingWrapper>
  );
};
