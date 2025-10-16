"use client";

import { RawBarangay } from "@/lib/types";
import { BarangayList } from "./barangay-list";
import { callNumber } from "@/lib/utils";
import { useUpdateAddBarangayModalStore } from "@/hooks/modals/use-update-add-barangay-modal";
import { useDeleteBarangayModalStore } from "@/hooks/modals/use-delete-barangay-modal";

interface Props {
  mainBarangays: RawBarangay[];
}

export const BarangayManagement = ({ mainBarangays }: Props) => {
  const { openModal: openUpdateAddModal } = useUpdateAddBarangayModalStore();
  const { openModal: openDeleteModal } = useDeleteBarangayModalStore();

  // Open modal for adding new barangay
  const handleAdd = () => {
    openUpdateAddModal("add");
  };

  // Open modal for editing barangay
  const handleEdit = (barangay: RawBarangay) => {
    openUpdateAddModal("edit", barangay);
  };

  // Open modal for deleting barangay
  const handleDelete = (id: string, name: string) => {
    openDeleteModal(id, name);
  };

  // Helpers for external actions
  const handleViewMap = (barangay: RawBarangay) => {
    const url = `https://www.google.com/maps?q=${barangay.latitude},${barangay.longitude}`;
    window.open(url, "_blank");
  };

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
      </div>
    </div>
  );
};
