"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  XCircle,
  Building2,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import fetchClient from "@/lib/utils/fetchClient";
import { toast } from "sonner";
import type { RecruiterRequest } from "@/lib/api/admin/recruiterRequest.types";
import ApproveDialog from "./ApproveDialog";
import RejectDialog from "./RejectDialog";

const statusConfig = {
  pending: {
    label: "Pending",
    className:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
    icon: Clock,
  },
  approved: {
    label: "Approved",
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
    icon: CheckCircle2,
  },
  rejected: {
    label: "Rejected",
    className:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
    icon: XCircle,
  },
};

interface RecruiterRequestTableProps {
  requests: RecruiterRequest[];
}

const RecruiterRequestTable = ({ requests }: RecruiterRequestTableProps) => {
  const [approveDialog, setApproveDialog] = useState<{
    open: boolean;
    request: RecruiterRequest | null;
  }>({ open: false, request: null });
  const [rejectDialog, setRejectDialog] = useState<{
    open: boolean;
    request: RecruiterRequest | null;
  }>({ open: false, request: null });
  const router = useRouter();

  return (
    <>
      <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-Border dark:border-secondary bg-gray-50 dark:bg-gray-800/50">
          <div className="col-span-4 text-xs font-SecondaryFont font-semibold text-TextMuted uppercase tracking-wider">
            Applicant
          </div>
          <div className="col-span-3 text-xs font-SecondaryFont font-semibold text-TextMuted uppercase tracking-wider hidden sm:block">
            Company
          </div>
          <div className="col-span-2 text-xs font-SecondaryFont font-semibold text-TextMuted uppercase tracking-wider hidden md:block">
            Status
          </div>
          <div className="col-span-3 text-xs font-SecondaryFont font-semibold text-TextMuted uppercase tracking-wider text-right">
            Actions
          </div>
        </div>

        {/* Rows */}
        {requests.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <p className="text-sm font-SecondaryFont text-TextMuted">
              No applications match your filters.
            </p>
          </div>
        ) : (
          requests.map((req) => {
            const badge = statusConfig[req.status] || statusConfig.pending;
            const BadgeIcon = badge.icon;
            const hasImage =
              req.userImage &&
              (req.userImage.startsWith("http://") ||
                req.userImage.startsWith("https://"));

            return (
              <div
                key={req._id}
                className="flex flex-col sm:grid sm:grid-cols-12 gap-3 sm:gap-4 items-start sm:items-center px-5 py-3.5 border-b border-Border/50 dark:border-secondary/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
              >
                {/* Applicant */}
                <div className="col-span-4 flex items-center gap-3 min-w-0">
                  {hasImage ? (
                    <Image
                      src={req.userImage!}
                      alt={req.name}
                      width={36}
                      height={36}
                      className="size-9 rounded-lg object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-PrimaryColor to-SrcPrimaryColor flex-shrink-0">
                      <span className="text-sm font-bold font-PrimaryFont text-white">
                        {req.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-SecondaryFont font-medium text-TextPrimary dark:text-surface truncate">
                      {req.name}
                    </p>
                    <p className="text-xs font-SecondaryFont text-TextMuted truncate">
                      {req.email}
                    </p>
                  </div>
                </div>

                {/* Company */}
                <div className="col-span-3 hidden sm:block">
                  <div className="flex items-center gap-1.5">
                    <Building2
                      size={13}
                      className="text-SrcPrimaryColor flex-shrink-0"
                    />
                    <span className="text-sm font-SecondaryFont text-TextSecondary dark:text-surface/80 truncate">
                      {req.company}
                    </span>
                  </div>
                </div>

                {/* Status */}
                <div className="col-span-2 hidden md:block">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-SecondaryFont font-medium px-2 py-1 rounded-full border ${badge.className}`}
                  >
                    <BadgeIcon size={12} />
                    {badge.label}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-3 flex items-center sm:justify-end gap-2">
                  {req.status === "pending" ? (
                    <>
                      <Button
                        size="sm"
                        onClick={() =>
                          setApproveDialog({ open: true, request: req })
                        }
                        className="h-8 px-3 text-xs font-SecondaryFont font-medium bg-SrcPrimaryColor hover:bg-SrcPrimaryColor/90 text-white cursor-pointer"
                      >
                        <ShieldCheck size={14} className="mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setRejectDialog({ open: true, request: req })
                        }
                        className="h-8 px-3 text-xs font-SecondaryFont font-medium border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 cursor-pointer"
                      >
                        <XCircle size={14} />
                      </Button>
                    </>
                  ) : (
                    <span className="text-xs font-SecondaryFont text-TextMuted italic">
                      {req.status === "approved" ? "Recruiter" : "N/A"}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Dialogs */}
      {approveDialog.request && (
        <ApproveDialog
          open={approveDialog.open}
          onOpenChange={(open) =>
            setApproveDialog({ open, request: approveDialog.request })
          }
          requestId={approveDialog.request._id}
          applicantName={approveDialog.request.name}
        />
      )}
      {rejectDialog.request && (
        <RejectDialog
          open={rejectDialog.open}
          onOpenChange={(open) =>
            setRejectDialog({ open, request: rejectDialog.request })
          }
          requestId={rejectDialog.request._id}
          applicantName={rejectDialog.request.name}
        />
      )}
    </>
  );
};

export default RecruiterRequestTable;
