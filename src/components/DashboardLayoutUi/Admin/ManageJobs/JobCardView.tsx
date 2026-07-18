"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  XCircle,
  Trash2,
  MapPin,
  Building2,
  Calendar,
  DollarSign,
  Briefcase,
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

const statusConfig: Record<string, { label: string; className: string }> = {
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

const formatDate = (date?: string) =>
  date
    ? new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";

const formatSalary = (min?: number, max?: number) =>
  `${min ? min.toLocaleString() : "0"} – ${max ? max.toLocaleString() : "0"} BDT`;

interface JobCardViewProps {
  jobs: AdminJob[];
}

const JobCardView = ({ jobs }: JobCardViewProps) => {
  const [deleteDialog, setDeleteDialog] = useState<AdminJob | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleAction = async (job: AdminJob, action: "approve" | "reject") => {
    setLoading(`${job._id}-${action}`);
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
    if (!deleteDialog) return;
    setLoading(`${deleteDialog._id}-delete`);
    try {
      await fetchClient(`/api/admin/jobs/${deleteDialog._id}`, {
        method: "DELETE",
      });
      toast.success(`"${deleteDialog.title}" deleted`);
      setDeleteDialog(null);
      router.refresh();
    } catch {
      toast.error("Failed to delete job");
    } finally {
      setLoading(null);
    }
  };

  if (jobs.length === 0) {
    return (
      <div className="px-5 py-16 text-center">
        <Briefcase size={32} className="mx-auto text-TextMuted mb-3" />
        <p className="text-sm font-SecondaryFont text-TextMuted">No jobs found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {jobs.map((job) => {
          const st = statusConfig[job.status] || statusConfig.pending;
          const hasLogo =
            job.companyLogo &&
            (job.companyLogo.startsWith("http://") ||
              job.companyLogo.startsWith("https://"));
          const isLoading = loading?.startsWith(job._id);

          return (
            <div
              key={job._id}
              className="group relative rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary p-5 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 min-w-0">
                  {hasLogo ? (
                    <div className="relative size-10 shrink-0 rounded-xl overflow-hidden border border-Border dark:border-secondary">
                      <Image
                        src={job.companyLogo!}
                        alt={job.companyName}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                  ) : (
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-PrimaryColor to-SrcPrimaryColor">
                      <Building2 size={18} className="text-white" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold font-PrimaryFont text-TextPrimary dark:text-surface truncate">
                      {job.title}
                    </h3>
                    <p className="text-xs font-SecondaryFont text-TextMuted truncate">
                      {job.companyName}
                    </p>
                  </div>
                </div>
                <span
                  className={`shrink-0 inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium font-SecondaryFont ${st.className}`}
                >
                  {st.label}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-2 mb-4">
                {job.location && (
                  <div className="flex items-center gap-1.5 text-xs font-SecondaryFont text-TextSecondary dark:text-text-secondary">
                    <MapPin size={12} className="text-TextMuted" />
                    {job.location}
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-xs font-SecondaryFont text-TextSecondary dark:text-text-secondary">
                  <DollarSign size={12} className="text-SrcPrimaryColor" />
                  {formatSalary(job.salaryMin, job.salaryMax)}
                </div>
                {job.createdAt && (
                  <div className="flex items-center gap-1.5 text-xs font-SecondaryFont text-TextMuted">
                    <Calendar size={12} />
                    Posted {formatDate(job.createdAt)}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-Border dark:border-secondary flex items-center gap-2">
                {job.status !== "approved" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAction(job, "approve")}
                    disabled={isLoading}
                    className="flex-1 h-8 rounded-lg text-[11px] font-SecondaryFont font-medium border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-900/20 cursor-pointer"
                  >
                    <CheckCircle size={13} className="mr-1" />
                    Approve
                  </Button>
                )}
                {job.status !== "rejected" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAction(job, "reject")}
                    disabled={isLoading}
                    className="flex-1 h-8 rounded-lg text-[11px] font-SecondaryFont font-medium border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-900/20 cursor-pointer"
                  >
                    <XCircle size={13} className="mr-1" />
                    Reject
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDeleteDialog(job)}
                  disabled={isLoading}
                  className="h-8 w-8 shrink-0 rounded-lg p-0 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 cursor-pointer"
                >
                  <Trash2 size={13} />
                </Button>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </div>
          );
        })}
      </div>

      {/* Delete Dialog */}
      <Dialog
        open={!!deleteDialog}
        onOpenChange={(open) => !open && setDeleteDialog(null)}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="font-PrimaryFont">Delete Job</DialogTitle>
            <DialogDescription className="font-SecondaryFont">
              Are you sure you want to delete{" "}
              <span className="font-medium text-TextPrimary dark:text-surface">
                {deleteDialog?.title}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog(null)}
              className="font-SecondaryFont cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={loading?.includes("delete")}
              className="font-SecondaryFont bg-red-600 hover:bg-red-700 text-white cursor-pointer"
            >
              {loading?.includes("delete") ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default JobCardView;
