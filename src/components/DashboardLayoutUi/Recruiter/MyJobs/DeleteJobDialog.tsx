"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import fetchClient from "@/lib/utils/fetchClient";

interface DeleteJobDialogProps {
  jobId: string;
  jobTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: () => void;
}

const DeleteJobDialog = ({
  jobId,
  jobTitle,
  open,
  onOpenChange,
  onDeleted,
}: DeleteJobDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await fetchClient(`/api/recruiter/jobs/${jobId}`, {
        method: "DELETE",
      });
      toast.success("Job deleted successfully.");
      onOpenChange(false);
      onDeleted();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to delete job.";
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary">
        <DialogHeader>
          <div className="flex size-12 items-center justify-center rounded-xl bg-PrimaryColorLight dark:bg-PrimaryColorDark/20 mx-auto">
            <AlertTriangle
              size={24}
              className="text-PrimaryColor"
            />
          </div>
          <DialogTitle className="text-center font-PrimaryFont text-TextPrimary dark:text-surface pt-2">
            Delete Job
          </DialogTitle>
          <DialogDescription className="text-center font-SecondaryFont text-TextMuted">
            Are you sure you want to delete{" "}
            <span className="font-medium text-TextSecondary dark:text-text-secondary">
              &quot;{jobTitle}&quot;
            </span>
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="rounded-xl font-SecondaryFont border-Border dark:border-secondary text-TextSecondary dark:text-text-secondary hover:bg-Background dark:hover:bg-dark-bg"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-xl font-SecondaryFont bg-PrimaryColor hover:bg-PrimaryColorHover text-white transition-colors"
          >
            {isDeleting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Delete Job
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteJobDialog;
