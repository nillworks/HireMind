"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import fetchClient from "@/lib/utils/fetchClient";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";

interface ApproveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestId: string;
  applicantName: string;
}

const ApproveDialog = ({
  open,
  onOpenChange,
  requestId,
  applicantName,
}: ApproveDialogProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleApprove = async () => {
    setLoading(true);
    try {
      await fetchClient(`/api/admin/recruiter-requests/${requestId}/approve`, {
        method: "PATCH",
      });
      toast.success(`${applicantName} approved as recruiter`);
      onOpenChange(false);
      router.refresh();
    } catch {
      toast.error("Failed to approve request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="font-PrimaryFont">
            Approve Recruiter Request
          </DialogTitle>
          <DialogDescription className="font-SecondaryFont">
            Approve{" "}
            <span className="font-medium text-TextPrimary dark:text-surface">
              {applicantName}
            </span>{" "}
            as a recruiter? They will gain access to recruiter features.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800">
          <ShieldCheck
            size={18}
            className="text-emerald-600 dark:text-emerald-400 flex-shrink-0"
          />
          <p className="text-xs font-SecondaryFont text-emerald-700 dark:text-emerald-400">
            This will grant the user recruiter privileges and they can start
            posting jobs.
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="font-SecondaryFont cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleApprove}
            disabled={loading}
            className="font-SecondaryFont bg-SrcPrimaryColor hover:bg-SrcPrimaryColor/90 text-white cursor-pointer"
          >
            {loading ? "Approving..." : "Approve"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApproveDialog;
