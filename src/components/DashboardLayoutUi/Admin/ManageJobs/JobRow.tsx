"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  CheckCircle,
  XCircle,
  Trash2,
  MapPin,
  Building2,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import fetchClient from "@/lib/utils/fetchClient";
import type { AdminJob } from "@/lib/api/admin/jobs.types";

const statusConfig: Record<
  string,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
  },
  approved: {
    label: "Approved",
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
  },
  rejected: {
    label: "Rejected",
    className:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
  },
};

interface JobRowProps {
  job: AdminJob;
}

const JobRow = ({ job }: JobRowProps) => {
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const status = statusConfig[job.status] || statusConfig.pending;

  const handleAction = async (action: "approve" | "reject") => {
    setLoading(action);
    try {
      await fetchClient(`/api/admin/jobs/${job._id}/${action}`, {
        method: "PATCH",
      });
      toast.success(
        action === "approve"
          ? `"${job.title}" approved`
          : `"${job.title}" rejected`,
      );
      router.refresh();
    } catch {
      toast.error(`Failed to ${action} job`);
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async () => {
    setLoading("delete");
    try {
      await fetchClient(`/api/admin/jobs/${job._id}`, { method: "DELETE" });
      toast.success(`"${job.title}" deleted`);
      setDeleteDialog(false);
      router.refresh();
    } catch {
      toast.error("Failed to delete job");
    } finally {
      setLoading(null);
    }
  };

  const hasLogo =
    job.companyLogo &&
    (job.companyLogo.startsWith("http://") ||
      job.companyLogo.startsWith("https://"));

  const formatDate = (date?: string) =>
    date
      ? new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "N/A";

  return (
    <>
      <div className="flex flex-col sm:grid sm:grid-cols-12 gap-3 sm:gap-4 items-start sm:items-center px-5 py-4 border-b border-Border/50 dark:border-secondary/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
        {/* Company + Title */}
        <div className="col-span-12 sm:col-span-5 flex items-center gap-3 min-w-0">
          {hasLogo ? (
            <Image
              src={job.companyLogo!}
              alt={job.companyName}
              width={40}
              height={40}
              className="size-10 rounded-lg object-cover flex-shrink-0"
            />
          ) : (
            <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-PrimaryColor to-SrcPrimaryColor flex-shrink-0">
              <Building2 size={18} className="text-white" />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-SecondaryFont font-semibold text-TextPrimary dark:text-surface truncate">
              {job.title}
            </p>
            <p className="text-xs font-SecondaryFont text-TextMuted truncate">
              {job.companyName}
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="col-span-12 sm:col-span-3 hidden sm:flex items-center gap-3 text-xs font-SecondaryFont text-TextMuted">
          {job.location && (
            <span className="flex items-center gap-1">
              <MapPin size={12} />
              {job.location}
            </span>
          )}
          {job.createdAt && (
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {formatDate(job.createdAt)}
            </span>
          )}
        </div>

        {/* Status */}
        <div className="col-span-6 sm:col-span-2">
          <span
            className={`inline-flex items-center text-[11px] font-SecondaryFont font-medium px-2.5 py-1 rounded-full border ${status.className}`}
          >
            {status.label}
          </span>
        </div>

        {/* Actions */}
        <div className="col-span-6 sm:col-span-2 flex items-center justify-end gap-1.5">
          {job.status !== "approved" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAction("approve")}
              disabled={loading !== null}
              className="h-7 px-2.5 text-[11px] font-SecondaryFont font-medium border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-900/20 cursor-pointer"
            >
              <CheckCircle size={13} className="mr-1" />
              Approve
            </Button>
          )}
          {job.status !== "rejected" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAction("reject")}
              disabled={loading !== null}
              className="h-7 px-2.5 text-[11px] font-SecondaryFont font-medium border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-900/20 cursor-pointer"
            >
              <XCircle size={13} className="mr-1" />
              Reject
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setDeleteDialog(true)}
            disabled={loading !== null}
            className="h-7 px-2.5 text-[11px] font-SecondaryFont font-medium border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 cursor-pointer"
          >
            <Trash2 size={13} />
          </Button>
        </div>
      </div>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="font-PrimaryFont">Delete Job</DialogTitle>
            <DialogDescription className="font-SecondaryFont">
              Are you sure you want to delete{" "}
              <span className="font-medium text-TextPrimary dark:text-surface">
                {job.title}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog(false)}
              className="font-SecondaryFont cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={loading === "delete"}
              className="font-SecondaryFont bg-red-600 hover:bg-red-700 text-white cursor-pointer"
            >
              {loading === "delete" ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default JobRow;
