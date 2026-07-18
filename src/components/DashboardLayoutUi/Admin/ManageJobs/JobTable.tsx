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
  Briefcase,
  LayoutGrid,
  List,
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
import JobCardView from "./JobCardView";
import JobFilters from "./JobFilters";

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

const statusFilters = ["all", "pending", "approved", "rejected"];

interface JobTableProps {
  jobs: AdminJob[];
  currentStatus: string;
}

const JobTable = ({ jobs, currentStatus }: JobTableProps) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(currentStatus);
  const [deleteDialog, setDeleteDialog] = useState<AdminJob | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"card" | "table">("table");
  const router = useRouter();

  const filtered = (jobs || []).filter((j) => {
    const matchesSearch =
      j.title?.toLowerCase().includes(search.toLowerCase()) ||
      j.companyName?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || j.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

  const handleStatusFilter = (s: string) => {
    setStatusFilter(s);
    const params = new URLSearchParams();
    if (s !== "all") params.set("status", s);
    const qs = params.toString() ? `?${params.toString()}` : "";
    router.push(`/dashboard/admin/jobs${qs}`);
  };

  const formatDate = (date?: string) =>
    date
      ? new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "N/A";

  return (
    <div className="space-y-5">
      {/* Search + Status Filters + View Toggle */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-TextMuted">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search by title or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-Border dark:border-secondary bg-white dark:bg-[#1e293b] text-sm font-SecondaryFont text-TextPrimary dark:text-surface placeholder:text-TextMuted focus:outline-none focus:ring-2 focus:ring-PrimaryColor/30 transition-all"
          />
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex items-center rounded-xl border border-Border dark:border-secondary overflow-hidden">
            <button
              type="button"
              onClick={() => setViewMode("card")}
              className={`flex items-center justify-center size-10 transition-colors cursor-pointer ${
                viewMode === "card"
                  ? "bg-SrcPrimaryColor text-white"
                  : "bg-white dark:bg-[#1e293b] text-TextMuted hover:bg-Background dark:hover:bg-dark-bg"
              }`}
              aria-label="Card view"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`flex items-center justify-center size-10 transition-colors cursor-pointer ${
                viewMode === "table"
                  ? "bg-SrcPrimaryColor text-white"
                  : "bg-white dark:bg-[#1e293b] text-TextMuted hover:bg-Background dark:hover:bg-dark-bg"
              }`}
              aria-label="Table view"
            >
              <List size={16} />
            </button>
          </div>
          {statusFilters.map((s) => (
            <button
              key={s}
              onClick={() => handleStatusFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-SecondaryFont font-medium transition-all cursor-pointer ${
                statusFilter === s
                  ? "bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor text-white shadow-md"
                  : "bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary text-TextMuted hover:text-TextPrimary dark:hover:text-surface"
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* View */}
      {viewMode === "card" ? (
        <JobCardView jobs={filtered} />
      ) : (
      <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary overflow-hidden">
        {/* Header */}
        <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 border-b border-Border dark:border-secondary bg-gray-50 dark:bg-gray-800/50">
          <div className="col-span-5 text-xs font-SecondaryFont font-semibold text-TextMuted uppercase tracking-wider">
            Job
          </div>
          <div className="col-span-3 text-xs font-SecondaryFont font-semibold text-TextMuted uppercase tracking-wider">
            Details
          </div>
          <div className="col-span-2 text-xs font-SecondaryFont font-semibold text-TextMuted uppercase tracking-wider">
            Status
          </div>
          <div className="col-span-2 text-xs font-SecondaryFont font-semibold text-TextMuted uppercase tracking-wider text-right">
            Actions
          </div>
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <Briefcase size={32} className="mx-auto text-TextMuted mb-3" />
            <p className="text-sm font-SecondaryFont text-TextMuted">
              {search || statusFilter !== "all"
                ? "No jobs match your filters."
                : "No jobs found."}
            </p>
          </div>
        ) : (
          filtered.map((job) => {
            const st = statusConfig[job.status] || statusConfig.pending;
            const hasLogo =
              job.companyLogo &&
              (job.companyLogo.startsWith("http://") ||
                job.companyLogo.startsWith("https://"));
            const isLoading = loading?.startsWith(job._id);

            return (
              <div
                key={job._id}
                className="flex flex-col sm:grid sm:grid-cols-12 gap-3 sm:gap-4 items-start sm:items-center px-5 py-4 border-b border-Border/50 dark:border-secondary/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
              >
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
                <div className="col-span-12 sm:col-span-3 flex items-center gap-3 text-xs font-SecondaryFont text-TextMuted">
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
                    className={`inline-flex items-center text-[11px] font-SecondaryFont font-medium px-2.5 py-1 rounded-full border ${st.className}`}
                  >
                    {st.label}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-6 sm:col-span-2 flex items-center sm:justify-end gap-1.5">
                  {job.status !== "approved" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAction(job, "approve")}
                      disabled={isLoading}
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
                      onClick={() => handleAction(job, "reject")}
                      disabled={isLoading}
                      className="h-7 px-2.5 text-[11px] font-SecondaryFont font-medium border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-900/20 cursor-pointer"
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
                    className="h-7 px-2.5 text-[11px] font-SecondaryFont font-medium border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
      )}

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
    </div>
  );
};

export default JobTable;
