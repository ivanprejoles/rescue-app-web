"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import React, { useMemo, useState } from "react";
import { EvacuationCenterAccordion } from "./evacuation-center-accordion";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RawBarangay, RawEvacuationCenter } from "@/lib/types";
import {
  createEvacuationClient,
  deleteEvacuationClient,
  updateEvacuationClient,
} from "@/lib/client-request/evacuation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { callNumber, openGoogleMaps } from "@/lib/utils";
import { EvacuationCenterModal } from "../modal/add-update-evacuation-modal";
import { DeleteEvacuationModal } from "../modal/delete-evacuation";
import { AddUpdateBarangaysModal } from "../modal/add-barangay-evacuation-modal";

type Props = {
  evacuationCenters: RawEvacuationCenter[];
  allBarangays?: RawBarangay[];
};

const EvacuationManagement = ({ evacuationCenters, allBarangays }: Props) => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCenter, setSelectedCenter] = useState<
    RawEvacuationCenter | undefined
  >();
  const [centerModalMode, setCenterModalMode] = useState<"add" | "edit">("add");
  const [isCenterModalOpen, setIsCenterModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [centerToDelete, setCenterToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [assignedCenterId, setAssignedCenterId] = useState<string>("");
  const [assignedBarangayIds, setAssignedBarangayIds] = React.useState<
    Set<string>
  >(new Set());

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

  // Modal handlers
  const handleAddCenter = () => {
    setSelectedCenter(undefined);
    setCenterModalMode("add");
    setIsCenterModalOpen(true);
  };

  const handleEditCenter = (center: RawEvacuationCenter) => {
    setSelectedCenter(center);
    setCenterModalMode("edit");
    setIsCenterModalOpen(true);
  };

  // Open modal for deleting barangay
  const handleDelete = (id: string, name: string) => {
    setCenterToDelete({ id, name });
    setIsDeleteModalOpen(true);
  };

  const handleAddBarangay = (brgyIds: string[]) => {
    if (!brgyIds || brgyIds.length === 0) {
      setAssignedBarangayIds(new Set());
    } else {
      setAssignedBarangayIds(new Set(brgyIds));
    }
    setIsAddModalOpen(true);
  };

  const onDeleteEvacuation = (id: string) => {
    deleteEvacuationMutation.mutate(id);
  };

  const handleSaveCenter = (
    centerData: Omit<RawEvacuationCenter, "id" | "created_at">
  ) => {
    if (centerModalMode === "add") {
      createEvacuationMutation.mutate(centerData);
    } else if (selectedCenter) {
      updateEvacuationMutation.mutate({
        id: selectedCenter.id,
        data: centerData,
      });
    }
  };

  const createEvacuationMutation = useMutation({
    mutationFn: createEvacuationClient,
    onSuccess: (newCenter) => {
      queryClient.setQueryData<{
        evacuations: RawEvacuationCenter[];
        barangays: RawBarangay[];
      }>(["evacuations"], (oldData) => {
        if (!oldData) {
          return { evacuations: [newCenter], barangays: [] };
        }
        return {
          ...oldData,
          evacuations: [...oldData.evacuations, newCenter],
        };
      });
    },
    onError: (error) => {
      console.error("Create evacuation center error:", error);
    },
  });

  // Update mutation — updates barangay and updates cache
  const updateEvacuationMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<RawEvacuationCenter>;
    }) => updateEvacuationClient(id, data),
    onSuccess: (updatedCenter) => {
      queryClient.setQueryData<{
        evacuations: RawEvacuationCenter[];
        barangays: RawBarangay[];
      }>(["evacuations"], (oldData) => {
        if (!oldData) return { evacuations: [updatedCenter], barangays: [] };
        return {
          ...oldData,
          evacuations: oldData.evacuations.map((center) =>
            center.id === updatedCenter.id ? updatedCenter : center
          ),
        };
      });
    },
    onError: (error) => {
      console.error("Update evacuation error:", error);
    },
  });

  const deleteEvacuationMutation = useMutation({
    mutationFn: (id: string) => deleteEvacuationClient(id),
    onSuccess: (_, deletedCenterId) => {
      queryClient.setQueryData<{
        barangays: RawBarangay[];
        evacuations: (RawEvacuationCenter & {
          evacuation_center_barangays: { barangay_id: string }[];
        })[];
      }>(["evacuations"], (oldData) => {
        if (!oldData) return oldData;

        const updatedEvacuations = oldData.evacuations.filter(
          (center) => center.id !== deletedCenterId
        );

        return {
          ...oldData,
          evacuations: updatedEvacuations,
          barangays: oldData.barangays, // unchanged
        };
      });
    },
    onError: (error) => {
      console.error("[deleteEvacuationMutation] error:", error);
    },
  });

  return (
    <Card className="@container/card">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-2xl font-bold">
              Evacuation Center Management
            </CardTitle>
            <p className="mt-1">Manage and organize evacuation center</p>
          </div>
          <Button
            onClick={handleAddCenter}
            className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
          >
            <Plus size={16} className="mr-2" />
            Add Center
          </Button>
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
          <Badge variant="secondary" className="px-3 py-1">
            {filteredCenters.length} of {evacuationCenters.length}
          </Badge>
        </div>
        {filteredCenters.length === 0 ? (
          <Card className="text-center py-16">
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
        ) : (
          <div className="space-y-6">
            {filteredCenters.map((center) => (
              <EvacuationCenterAccordion
                key={center.id}
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

        <EvacuationCenterModal
          isOpen={isCenterModalOpen}
          onClose={() => setIsCenterModalOpen(false)}
          onSave={handleSaveCenter}
          evacuationCenter={selectedCenter}
          mode={centerModalMode}
        />

        <DeleteEvacuationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          evacuationName={centerToDelete?.name ?? ""}
          evacuationId={centerToDelete?.id ?? ""}
          onDelete={onDeleteEvacuation}
        />

        <AddUpdateBarangaysModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setAssignedCenterId("");
          }}
          allBarangays={allBarangays}
          assignedBarangayIds={assignedBarangayIds}
          evacuationCenterId={assignedCenterId}
          //   onAddBarangays={handleAddBarangays}
        />
      </CardContent>
    </Card>
  );
};

export default EvacuationManagement;
