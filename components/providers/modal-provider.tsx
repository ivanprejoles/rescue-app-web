"use client";

import { useEffect, useState } from "react";
import { DeleteBarangayModal } from "../global/modal/delete-barangay-modal";
import { BarangayModal } from "../global/modal/add-update-barangay-modal";
import { EvacuationCenterModal } from "../global/modal/add-update-evacuation-modal";
import { DeleteEvacuationModal } from "../global/modal/delete-evacuation-modal";
import { ReportModal } from "../global/modal/update-report-modal";
import { DeleteReportModal } from "../global/modal/delete-report-modal";

const ModalProvider = () => {
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
    </>
  );
};

export default ModalProvider;
