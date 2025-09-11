"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import React, { useMemo, useState } from "react";
import { EvacuationCenterAccordion } from "./evacuation-center-accordion";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RawBarangay, RawEvacuationCenter } from "@/lib/types";
import { callNumber, openGoogleMaps } from "@/lib/utils";
import { AddUpdateBarangaysModal } from "../modal/add-barangay-evacuation-modal";
import { GlowingWrapper } from "@/components/ui/glowing-effect";
import { GradientWrapper } from "@/components/ui/background-gradient";
import { useEvacuationCenterModalStore } from "@/hooks/modals/use-update-add-evacuation-modal";
import { useDeleteEvacuationModalStore } from "@/hooks/modals/use-delete-evacuation-modal";

type Props = {
  evacuationCenters: RawEvacuationCenter[];
  allBarangays?: RawBarangay[];
};

const EvacuationManagement = ({ evacuationCenters, allBarangays }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  // const queryClient = useQueryClient();
  // const [selectedCenter, setSelectedCenter] = useState<
  //   RawEvacuationCenter | undefined
  // >();
  // const [centerModalMode, setCenterModalMode] = useState<"add" | "edit">("add");
  // const [isCenterModalOpen, setIsCenterModalOpen] = useState(false);
  // const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // const [centerToDelete, setCenterToDelete] = useState<{
  //   id: string;
  //   name: string;
  // } | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [assignedCenterId, setAssignedCenterId] = useState<string>("");
  const [assignedBarangayIds, setAssignedBarangayIds] = React.useState<
    Set<string>
  >(new Set());
  const { openModal: openAddUpdateModal } = useEvacuationCenterModalStore();
  const { openModal: openDeleteModal } = useDeleteEvacuationModalStore();

  const filteredCenters = useMemo(() => {
    return evacuationCenters.filter(
      (center) =>
        center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        center.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        center.barangays?.some((barangay) =>
          barangay.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }, [evacuationCenters, searchTerm]);

  const handleAddCenter = () => {
    openAddUpdateModal("add");
  };

  const handleEditCenter = (center: RawEvacuationCenter) => {
    openAddUpdateModal("edit", center);
  };

  const handleDelete = (id: string, name: string) => {
    openDeleteModal(id, name);
  };

  const handleAddBarangay = (brgyIds: string[]) => {
    if (!brgyIds || brgyIds.length === 0) {
      setAssignedBarangayIds(new Set());
    } else {
      setAssignedBarangayIds(new Set(brgyIds));
    }
    setIsAddModalOpen(true);
  };

  return (
    <GlowingWrapper>
      <Card className="border-0.75 bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] relative z-10">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">
                Evacuation Center Management
              </CardTitle>
              <p className="mt-1">Manage and organize evacuation center</p>
            </div>
            <GradientWrapper>
              <Button
                onClick={() => handleAddCenter()}
                size="lg"
                variant="outline"
                className="shadow-lg hover:shadow-xl transition-shadow rounded-[22px] cursor-pointer"
              >
                <Plus className="h-5 w-5 mr-2" />
                New Evacuation
              </Button>
            </GradientWrapper>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <Input
                placeholder="Search centers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Badge variant="blue" className="px-3 py-1">
              {filteredCenters.length} of {evacuationCenters.length}
            </Badge>
          </div>
          {filteredCenters.length === 0 ? (
            <GlowingWrapper>
              <Card className="border-0.75 bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] relative z-10 text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Search size={48} className="text-gray-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">
                  {searchTerm
                    ? "No centers match your search"
                    : "No evacuation centers found"}
                </h3>
                <p className="mb-6 max-w-md mx-auto">
                  {searchTerm
                    ? "Try refining your search terms."
                    : "No evacuation centers have been added yet."}
                </p>
              </Card>
            </GlowingWrapper>
          ) : (
            <div className="space-y-6">
              {filteredCenters.map((center, index) => (
                <EvacuationCenterAccordion
                  key={index}
                  center={center}
                  onEditCenter={handleEditCenter}
                  onDeleteCenter={handleDelete}
                  onAddBarangay={handleAddBarangay}
                  onOpenMap={openGoogleMaps}
                  onAddCenterId={setAssignedCenterId}
                  onCallNumber={callNumber}
                />
              ))}
            </div>
          )}
          <AddUpdateBarangaysModal
            isOpen={isAddModalOpen}
            onClose={() => {
              setIsAddModalOpen(false);
              setAssignedCenterId("");
            }}
            allBarangays={allBarangays}
            assignedBarangayIds={assignedBarangayIds}
            evacuationCenterId={assignedCenterId}
          />
        </CardContent>
      </Card>
    </GlowingWrapper>
  );
};

export default EvacuationManagement;
