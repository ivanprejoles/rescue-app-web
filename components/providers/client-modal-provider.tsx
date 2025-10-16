"use client";

import { useEffect, useState } from "react";
import { ProfileEditModal } from "../global/modal/update-profile-modal";
import { AssistReportModal } from "../global/modal/assist-report-modal";

const ClientModalProvider = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <>
      <ProfileEditModal />
      <AssistReportModal />
    </>
  );
};

export default ClientModalProvider;
