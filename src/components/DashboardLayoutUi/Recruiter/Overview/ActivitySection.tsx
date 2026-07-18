import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Clock,
  CheckCircle,
  XCircle,
  FileText,
} from "lucide-react";
import type { RecruiterJob } from "@/lib/api/recruiter/recruiterJobsApi";

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

const statusConfig: Record<
  string,
  { label: string; icon: React.ElementType; color: string; bg: string }
> = {
  pending: {
    label: "Pending",
    icon: Clock,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/20",
  },
  approved: {
    label: "Approved",
    icon: CheckCircle,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/20",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-100 dark:bg-red-900/20",
  },
};

const UserAvatar = ({
  user,
}: {
  user: { name?: string | null; image?: string | null } | null;
}) => {
  const name = user?.name || "R";
  const initial = name.charAt(0).toUpperCase();
  const hasImage =
    user?.image &&
    (user.image.startsWith("http://") || user.image.startsWith("https://"));

  if (hasImage) {
    return (
      <Image
        src={user!.image!}
        alt={name}
        width={36}
        height={36}
        className="size-9 rounded-lg object-cover"
      />
    );
  }

  return (
    <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-PrimaryColor to-SrcPrimaryColor">
      <span className="text-sm font-bold font-PrimaryFont text-white">
        {initial}
      </span>
    </div>
  );
};

interface ActivitySectionProps {
  jobs: RecruiterJob[];
  user: { name?: string | null; image?: string | null } | null;
}

const ActivitySection = ({ jobs, user }: ActivitySectionProps) => {
  const recentJobs = [...jobs]
    .filter((j) => j.createdAt)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 4);

  return (
    <div className="mt-6 rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold font-PrimaryFont text-TextPrimary dark:text-surface">
          Recent Activity
        </h3>
        <Link
          href="/dashboard/recruiter/my-jobs"
          className="text-xs font-SecondaryFont font-medium text-SrcPrimaryColor hover:text-SrcPrimaryColorHover transition-colors"
        >
          View All
        </Link>
      </div>

      {recentJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="size-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
            <FileText size={20} className="text-TextMuted" />
          </div>
          <p className="text-sm font-SecondaryFont text-TextMuted max-w-[200px]">
            No recent activity yet. Post your first job to get started!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentJobs.map((job) => {
            const status = statusConfig[job.status] || statusConfig.pending;
            const StatusIcon = status.icon;

            return (
              <div
                key={job._id}
                className="flex items-center gap-3 p-3 rounded-xl bg-Background dark:bg-dark-bg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <UserAvatar user={user} />

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-SecondaryFont font-medium text-TextPrimary dark:text-surface truncate">
                    {job.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className={`text-[10px] font-SecondaryFont font-medium px-1.5 py-0.5 rounded ${status.bg} ${status.color}`}
                    >
                      {status.label}
                    </span>
                    <span className="text-[10px] font-SecondaryFont text-TextMuted">
                      {job.applicationCount || 0} applications
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-SecondaryFont text-TextMuted whitespace-nowrap">
                  {timeAgo(job.createdAt)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActivitySection;
