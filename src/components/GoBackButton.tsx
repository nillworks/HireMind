"use client";

import { ArrowLeft } from "lucide-react";

export default function GoBackButton({ className = "" }: { className?: string }) {
  return (
    <button
      onClick={() => window.history.back()}
      className={className}
    >
      <ArrowLeft size={16} />
      Go Back
    </button>
  );
}
