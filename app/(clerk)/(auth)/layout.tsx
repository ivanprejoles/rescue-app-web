import React from "react";

type Props = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: Props) => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-white">
      {children}
    </div>
  );
};

export default AuthLayout;
