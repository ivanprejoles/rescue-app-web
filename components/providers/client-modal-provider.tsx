"use client";

import { useEffect, useState } from "react";
import { ProfileEditModal } from "../global/modal/update-profile-modal";
import { ClientValidationForm } from "../global/Client/client-form-validation";

const ClientModalProvider = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <>
      <ClientValidationForm />
      <ProfileEditModal />
      {/* <AssistReportModal /> */}
    </>
  );
};

export default ClientModalProvider;
