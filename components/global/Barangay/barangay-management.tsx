"use client";

import React, { useState } from "react";
import { RawBarangay, RawEvacuationCenter } from "@/lib/types";
import { BarangayList } from "./barangay-list";
import { BarangayModal } from "../modal/add-update-barangay-modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createBarangayClient,
  deleteBarangayClient,
  updateBarangayClient,
} from "@/lib/client-request/barangay";
import { DeleteBarangayModal } from "../modal/delete-barangay-modal";
import { callNumber } from "@/lib/utils";
import { useUpdateAddBarangayModalStore } from "@/hooks/modals/use-update-add-barangay-modal";
import { useDeleteBarangayModalStore } from "@/hooks/modals/use-delete-barangay-modal";

interface Props {
  mainBarangays: RawBarangay[];
}

export const BarangayManagement = ({ mainBarangays }: Props) => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBarangay, setSelectedBarangay] = useState<
    RawBarangay | undefined
  >();
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [barangayToDelete, setBarangayToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const { openModal: openUpdateAddModal } = useUpdateAddBarangayModalStore();
  const { openModal: openDeleteModal } = useDeleteBarangayModalStore();

  // Create mutation — adds barangay and updates cache
  // const createBarangayMutation = useMutation({
  //   mutationFn: createBarangayClient,
  //   onSuccess: (newBarangay) => {
  //     queryClient.setQueryData<{
  //       evacuations: RawEvacuationCenter[];
  //       barangays: RawBarangay[];
  //     }>(["evacuations"], (oldData) => {
  //       if (!oldData) return { evacuations: [], barangays: [newBarangay] };
  //       return {
  //         ...oldData,
  //         barangays: [...oldData.barangays, newBarangay],
  //       };
  //     });
  //   },
  //   onError: (error) => {
  //     console.error("Create barangay error:", error);
  //   },
  // });

  // Update mutation — updates barangay and updates cache
  // const updateBarangayMutation = useMutation({
  //   mutationFn: ({ id, data }: { id: string; data: Partial<RawBarangay> }) =>
  //     updateBarangayClient(id, data),
  //   onSuccess: (updatedBarangay) => {
  //     queryClient.setQueryData<{
  //       evacuations: RawEvacuationCenter[];
  //       barangays: RawBarangay[];
  //     }>(["evacuations"], (oldData) => {
  //       if (!oldData) return { evacuations: [], barangays: [updatedBarangay] };
  //       return {
  //         ...oldData,
  //         barangays: oldData.barangays.map((b) =>
  //           b.id === updatedBarangay.id ? updatedBarangay : b
  //         ),
  //       };
  //     });
  //   },
  //   onError: (error) => {
  //     console.error("Update barangay error:", error);
  //   },
  // });

  // const deleteBarangayMutation = useMutation({
  //   mutationFn: (id: string) => deleteBarangayClient(id),
  //   onSuccess: (_, deletedBarangayId) => {
  //     queryClient.setQueryData(
  //       ["evacuations"],
  //       (oldData: {
  //         barangays: RawBarangay[];
  //         evacuations: RawEvacuationCenter[];
  //       }) => {
  //         if (!oldData) return oldData;

  //         const updatedEvacuations = oldData.evacuations.map((center) => {
  //           // Remove deleted barangay ID from join array
  //           const updatedJoin = center.evacuation_center_barangays?.filter(
  //             (rel) => rel.barangay_id !== deletedBarangayId
  //           );

  //           // Note: your memoized center.barangays are computed on the fly, so we don't update here

  //           return {
  //             ...center,
  //             evacuation_center_barangays: updatedJoin,
  //             // 'barangays' field is determined client-side by mapping these join IDs
  //           };
  //         });

  //         // Remove barangay from master barangays list
  //         const updatedBarangays = oldData.barangays.filter(
  //           (b) => b.id !== deletedBarangayId
  //         );

  //         return {
  //           ...oldData,
  //           evacuations: updatedEvacuations,
  //           barangays: updatedBarangays,
  //         };
  //       }
  //     );
  //   },
  // });

  // const onDeleteBarangay = (id: string) => {
  //   deleteBarangayMutation.mutate(id);
  // };

  // const handleSave = async (
  //   barangayData: Omit<RawBarangay, "id" | "created_at">
  // ) => {
  //   try {
  //     if (modalMode === "add") {
  //       await createBarangayMutation.mutateAsync(barangayData);
  //     } else if (modalMode === "edit" && selectedBarangay) {
  //       await updateBarangayMutation.mutateAsync({
  //         id: selectedBarangay.id,
  //         data: barangayData,
  //       });
  //     }
  //     setIsModalOpen(false);
  //   } catch (error) {
  //     console.error("Error saving barangay:", error);
  //     alert(error instanceof Error ? error.message : "Unknown error");
  //   }
  // };

  // Open modal for adding new barangay
  const handleAdd = () => {
    openUpdateAddModal("add");
    // setSelectedBarangay(undefined);
    // setModalMode("add");
    // setIsModalOpen(true);
  };

  // Open modal for editing barangay
  const handleEdit = (barangay: RawBarangay) => {
    openUpdateAddModal("edit", barangay);
    // setSelectedBarangay(barangay);
    // setModalMode("edit");
    // setIsModalOpen(true);
  };

  // Open modal for deleting barangay
  const handleDelete = (id: string, name: string) => {
    // setBarangayToDelete({ id, name });
    // setIsDeleteModalOpen(true);
    openDeleteModal(id, name);
  };

  // Helpers for external actions
  const handleViewMap = (barangay: RawBarangay) => {
    const url = `https://www.google.com/maps?q=${barangay.latitude},${barangay.longitude}`;
    window.open(url, "_blank");
  };

  // Use barangays directly from props (React Query cache)
  // This always reflects up-to-date data after cache updates
  const barangays = mainBarangays;

  return (
    <div className="h-auto">
      <div className="max-w-7xl mx-auto">
        <BarangayList
          barangays={barangays}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewMap={handleViewMap}
          onCall={callNumber}
        />

        {/* <BarangayModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          barangay={selectedBarangay}
          mode={modalMode}
        />

        <DeleteBarangayModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          barangayName={barangayToDelete?.name ?? ""}
          barangayId={barangayToDelete?.id ?? ""}
          onDelete={onDeleteBarangay}
        /> */}
      </div>
    </div>
  );
};
