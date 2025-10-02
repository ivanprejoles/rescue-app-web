"use client";

import { useEffect, useState } from "react";
import { ProfileEditModal } from "../global/modal/update-profile-modal";

const ClientModalProvider = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <>
      <ProfileEditModal />
    </>
  );
};

export default ClientModalProvider;
