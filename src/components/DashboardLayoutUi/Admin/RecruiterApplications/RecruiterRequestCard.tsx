"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ShieldCheck,
  XCircle,
  Building2,
  Mail,
  Calendar,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RecruiterRequest } from "@/lib/api/admin/recruiterRequest.types";
import ApproveDialog from "./ApproveDialog";
import RejectDialog from "./RejectDialog";

interface RecruiterRequestCardProps {
  request: RecruiterRequest;
}

const statusBadge = {
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

const RecruiterRequestCard = ({ request }: RecruiterRequestCardProps) => {
  const [approveDialog, setApproveDialog] = useState(false);
  const [rejectDialog, setRejectDialog] = useState(false);

  const initials =
    request.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  const badge = statusBadge[request.status] || statusBadge.pending;
  const BadgeIcon = badge.icon;

  return (
    <>
      <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary overflow-hidden hover:shadow-md transition-shadow">
        {/* Gradient top bar */}
        <div
          className={`h-1.5 ${
            request.status === "approved"
              ? "bg-gradient-to-r from-emerald-400 to-SrcPrimaryColor"
              : request.status === "rejected"
                ? "bg-gradient-to-r from-red-400 to-PrimaryColor"
                : "bg-gradient-to-r from-PrimaryColor via-amber-400 to-SrcPrimaryColor"
          }`}
        />

        <div className="p-5 space-y-4">
          {/* Applicant info + status badge */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              {request.userImage ? (
                <Image
                  src={request.userImage}
                  alt={request.name}
                  width={48}
                  height={48}
                  className="size-12 rounded-xl object-cover flex-shrink-0"
                />
              ) : (
                <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-PrimaryColor to-SrcPrimaryColor flex-shrink-0">
                  <span className="text-base font-bold font-PrimaryFont text-white">
                    {initials}
                  </span>
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-PrimaryFont font-semibold text-TextPrimary dark:text-surface truncate">
                  {request.name}
                </h3>
                <p className="text-sm font-SecondaryFont text-TextMuted flex items-center gap-1.5 mt-0.5">
                  <Mail size={13} className="flex-shrink-0" />
                  {request.email}
                </p>
              </div>
            </div>
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-SecondaryFont font-medium px-2 py-1 rounded-full border flex-shrink-0 ${badge.className}`}
            >
              <BadgeIcon size={12} />
              {badge.label}
            </span>
          </div>

          {/* Details */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-SecondaryFont text-TextSecondary dark:text-surface/80">
              <Building2
                size={14}
                className="text-SrcPrimaryColor flex-shrink-0"
              />
              <span>{request.company}</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-SecondaryFont text-TextMuted">
              <Calendar size={14} className="flex-shrink-0" />
              <span>
                Applied{" "}
                {new Date(request.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>

          {/* Rejection reason */}
          {request.status === "rejected" && request.rejectionReason && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800">
              <p className="text-xs font-SecondaryFont font-medium text-red-700 dark:text-red-400 mb-1">
                Rejection reason:
              </p>
              <p className="text-sm font-SecondaryFont text-red-800 dark:text-red-300">
                {request.rejectionReason}
              </p>
            </div>
          )}

          {/* Actions — only for pending */}
          {request.status === "pending" && (
            <div className="flex items-center gap-3 pt-1">
              <Button
                size="sm"
                onClick={() => setApproveDialog(true)}
                className="h-9 px-4 text-sm font-SecondaryFont font-medium bg-SrcPrimaryColor hover:bg-SrcPrimaryColor/90 text-white cursor-pointer"
              >
                <ShieldCheck size={15} className="mr-1.5" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setRejectDialog(true)}
                className="h-9 px-4 text-sm font-SecondaryFont font-medium border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 cursor-pointer"
              >
                <XCircle size={15} className="mr-1.5" />
                Reject
              </Button>
            </div>
          )}
        </div>
      </div>

      <ApproveDialog
        open={approveDialog}
        onOpenChange={setApproveDialog}
        requestId={request._id}
        applicantName={request.name}
      />
      <RejectDialog
        open={rejectDialog}
        onOpenChange={setRejectDialog}
        requestId={request._id}
        applicantName={request.name}
      />
    </>
  );
};

export default RecruiterRequestCard;
