"use client";

import { Toaster } from "sonner";

const CustomToast = () => {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 4000,
        style: {
          fontFamily: "var(--font-SecondaryFont)",
          borderRadius: "12px",
          padding: "12px 16px",
        },
        classNames: {
          success: "bg-SrcPrimaryColorLight border border-SrcPrimaryColor text-SrcPrimaryColorDark",
          error: "bg-PrimaryColorLight border border-PrimaryColor text-PrimaryColorDark",
          info: "bg-white border border-Border text-TextPrimary",
        },
      }}
    />
  );
};

export default CustomToast;
