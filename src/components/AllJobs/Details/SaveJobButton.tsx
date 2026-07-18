"use client";

import { useState, useEffect, useCallback } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleSaveJob, checkIfSaved } from "@/lib/api/public/savedJobsApi";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

interface SaveJobButtonProps {
  jobId: string;
  className?: string;
}

const SaveJobButton = ({ jobId, className }: SaveJobButtonProps) => {
  const { data: session } = useSession();
  const [isSaved, setIsSaved] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!session?.user) {
      setChecking(false);
      return;
    }
    checkIfSaved(jobId)
      .then((res) => setIsSaved(res.saved))
      .catch(() => {})
      .finally(() => setChecking(false));
  }, [jobId, session?.user]);

  const handleToggle = useCallback(async () => {
    if (!session?.user) return;
    try {
      const res = await toggleSaveJob(jobId);
      setIsSaved(res.saved);
      toast.success(res.saved ? "Job saved" : "Job removed from saved");
    } catch {
      toast.error("Failed to save job");
    }
  }, [jobId, session?.user]);

  if (!session?.user) return null;

  return (
    <button
      onClick={handleToggle}
      disabled={checking}
      className={cn(
        "flex-1 h-10 rounded-xl border font-SecondaryFont text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer",
        isSaved
          ? "border-PrimaryColor bg-PrimaryColorLight dark:bg-PrimaryColorDark/20 text-PrimaryColor"
          : "border-Border dark:border-secondary text-TextSecondary hover:border-PrimaryColor hover:text-PrimaryColor",
        className
      )}
    >
      <Heart
        size={16}
        className={cn(
          "transition-all duration-200",
          isSaved && "fill-PrimaryColor"
        )}
      />
      {isSaved ? "Saved" : "Save"}
    </button>
  );
};

export default SaveJobButton;
