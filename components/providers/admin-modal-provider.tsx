"use client";

import { useEffect, useState } from "react";
import { DeleteBarangayModal } from "../global/modal/delete-barangay-modal";
import { BarangayModal } from "../global/modal/add-update-barangay-modal";
import { EvacuationCenterModal } from "../global/modal/add-update-evacuation-modal";
import { DeleteEvacuationModal } from "../global/modal/delete-evacuation-modal";
import { ReportModal } from "../global/modal/update-report-modal";
import { DeleteReportModal } from "../global/modal/delete-report-modal";
import { UpdateAddMapModal } from "../global/modal/add-marker-map-modal";
import { ProfileEditModal } from "../global/modal/update-profile-modal";
import { DeleteIncidentModal } from "../global/modal/delete-map-incident-modal";

const AdminModalProvider = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <>
      <DeleteBarangayModal />
      <DeleteEvacuationModal />
      <BarangayModal />
      <EvacuationCenterModal />
      <ReportModal />
      <DeleteReportModal />
      <UpdateAddMapModal />
      <ProfileEditModal />
      <DeleteIncidentModal />
    </>
  );
};

export default AdminModalProvider;
