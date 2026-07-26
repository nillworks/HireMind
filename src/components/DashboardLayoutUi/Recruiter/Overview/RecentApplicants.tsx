"use client";

import Link from "next/link";
import {
  Clock,
  Eye,
  CheckCircle2,
  XCircle,
  Users,
  Briefcase,
} from "lucide-react";
import type { RecentApplicant } from "@/lib/api/recruiter/recentApplicantsApi";

const statusConfig: Record<string, { label: string; color: string; dot: string; icon: React.ElementType }> = {
  pending: { label: "Pending", color: "text-amber-600 dark:text-amber-400", dot: "bg-amber-500", icon: Clock },
  reviewed: { label: "Reviewed", color: "text-blue-600 dark:text-blue-400", dot: "bg-blue-500", icon: Eye },
  accepted: { label: "Accepted", color: "text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500", icon: CheckCircle2 },
  rejected: { label: "Rejected", color: "text-red-600 dark:text-red-400", dot: "bg-red-500", icon: XCircle },
};

const timeAgo = (date: string) => {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return then.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

function AvatarCircle({ user, size = "sm" }: { user: RecentApplicant["user"]; size?: "sm" | "md" }) {
  const dim = size === "md" ? "size-10" : "size-7";
  if (user?.image) {
    return (
      <div className={`${dim} rounded-full ring-2 ring-white dark:ring-[#1e293b] overflow-hidden shrink-0`}>
        <img src={user.image} alt={user.name || ""} className="size-full object-cover" />
      </div>
    );
  }
  return (
    <div className={`${dim} rounded-full ring-2 ring-white dark:ring-[#1e293b] shrink-0 bg-gradient-to-br from-PrimaryColor/30 to-SrcPrimaryColor/30 flex items-center justify-center`}>
      <span className="text-[10px] font-bold font-PrimaryFont text-TextPrimary dark:text-surface">
        {(user?.name?.charAt(0) || "?").toUpperCase()}
      </span>
    </div>
  );
}

function AvatarStack({ applicants }: { applicants: RecentApplicant[] }) {
  return (
    <div className="flex -space-x-2">
      {applicants.slice(0, 3).map((app) => (
        <AvatarCircle key={app._id} user={app.user} />
      ))}
    </div>
  );
}

interface RecentApplicantsProps {
  applicants: RecentApplicant[];
}

const RecentApplicants = ({ applicants }: RecentApplicantsProps) => {
  const groups = applicants.reduce<Record<string, RecentApplicant[]>>((acc, app) => {
    const key = app.jobTitle || "Unknown Job";
    if (!acc[key]) acc[key] = [];
    acc[key].push(app);
    return acc;
  }, {});
  const groupEntries = Object.entries(groups);

  return (
    <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold font-PrimaryFont text-TextPrimary dark:text-surface">
          Recent Applicants
        </h3>
        <Link
          href="/dashboard/recruiter/my-jobs"
          className="text-xs font-SecondaryFont font-medium text-SrcPrimaryColor hover:text-SrcPrimaryColorHover transition-colors"
        >
          View All
        </Link>
      </div>

      {applicants.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="size-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
            <Users size={20} className="text-TextMuted" />
          </div>
          <p className="text-sm font-SecondaryFont text-TextMuted max-w-[200px]">
            No applications yet. Your jobs haven&apos;t received any applications yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {groupEntries.map(([jobTitle, apps]) => (
            <div key={jobTitle}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-lg bg-SrcPrimaryColor/10 flex items-center justify-center">
                    <Briefcase size={14} className="text-SrcPrimaryColor" />
                  </div>
                  <div>
                    <p className="text-sm font-medium font-SecondaryFont text-TextPrimary dark:text-surface">
                      {jobTitle}
                    </p>
                    <p className="text-[10px] font-SecondaryFont text-TextMuted">
                      {apps.length} applicant{apps.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                {apps.length > 0 && (
                  <AvatarStack applicants={apps} />
                )}
              </div>

              <div className="space-y-2">
                {apps.map((app) => {
                  const status = statusConfig[app.status] || statusConfig.pending;
                  const StatusIcon = status.icon;

                  return (
                    <div
                      key={app._id}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-Background dark:bg-dark-bg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <AvatarCircle user={app.user} size="md" />

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-SecondaryFont font-medium text-TextPrimary dark:text-surface truncate">
                          {app.user?.name || "Unknown Applicant"}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`flex items-center gap-1 text-[10px] font-medium font-SecondaryFont ${status.color}`}>
                            <StatusIcon size={10} />
                            {status.label}
                          </span>
                          <span className="text-[10px] font-SecondaryFont text-TextMuted">
                            {timeAgo(app.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentApplicants;
