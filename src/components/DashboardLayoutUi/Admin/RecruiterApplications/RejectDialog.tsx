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
import { XCircle } from "lucide-react";

interface RejectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestId: string;
  applicantName: string;
}

const RejectDialog = ({
  open,
  onOpenChange,
  requestId,
  applicantName,
}: RejectDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");
  const router = useRouter();

  const handleReject = async () => {
    setLoading(true);
    try {
      await fetchClient(`/api/admin/recruiter-requests/${requestId}/reject`, {
        method: "PATCH",
        body: JSON.stringify({ rejectionReason: reason }),
      });
      toast.success(`${applicantName} rejected`);
      onOpenChange(false);
      setReason("");
      router.refresh();
    } catch {
      toast.error("Failed to reject request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="font-PrimaryFont">
            Reject Recruiter Request
          </DialogTitle>
          <DialogDescription className="font-SecondaryFont">
            Reject{" "}
            <span className="font-medium text-TextPrimary dark:text-surface">
              {applicantName}
            </span>
            &apos;s recruiter application? They will be notified with your
            reason.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <label
            htmlFor="rejectionReason"
            className="text-sm font-SecondaryFont font-medium text-TextPrimary dark:text-surface"
          >
            Reason for rejection
          </label>
          <textarea
            id="rejectionReason"
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain why this application is being rejected..."
            className="w-full px-3 py-2.5 rounded-xl border border-Border dark:border-secondary bg-white dark:bg-[#0f172a] text-sm font-SecondaryFont text-TextPrimary dark:text-surface placeholder:text-TextMuted focus:outline-none focus:ring-2 focus:ring-PrimaryColor/30 transition-all resize-none"
          />
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800">
          <XCircle
            size={18}
            className="text-red-600 dark:text-red-400 flex-shrink-0"
          />
          <p className="text-xs font-SecondaryFont text-red-700 dark:text-red-400">
            The applicant will not be able to post jobs. They may reapply
            later.
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setReason("");
            }}
            className="font-SecondaryFont cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleReject}
            disabled={loading}
            className="font-SecondaryFont bg-red-600 hover:bg-red-700 text-white cursor-pointer"
          >
            {loading ? "Rejecting..." : "Reject"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectDialog;
