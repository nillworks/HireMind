"use client";

import Link from "next/link";
import {
  Clock,
  Eye,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Briefcase,
} from "lucide-react";
import type { ApplicationData } from "@/lib/api/seeker/overviewApi";

const statusConfig: Record<string, { label: string; color: string; dot: string; icon: React.ElementType }> = {
  pending: { label: "Pending", color: "text-amber-600 dark:text-amber-400", dot: "bg-amber-500", icon: Clock },
  reviewed: { label: "Reviewed", color: "text-blue-600 dark:text-blue-400", dot: "bg-blue-500", icon: Eye },
  accepted: { label: "Accepted", color: "text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500", icon: CheckCircle2 },
  rejected: { label: "Rejected", color: "text-red-600 dark:text-red-400", dot: "bg-red-500", icon: XCircle },
};

interface RecentApplicationsProps {
  applications: ApplicationData[];
}

const RecentApplications = ({ applications }: RecentApplicationsProps) => {
  return (
    <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-semibold font-PrimaryFont text-TextPrimary dark:text-surface">
          Recent Applications
        </h3>
        <Link
          href="/dashboard/seeker/applications"
          className="text-xs font-SecondaryFont font-medium text-PrimaryColor hover:underline flex items-center gap-1"
        >
          View All <ArrowRight size={10} />
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 gap-3">
          <div className="size-12 rounded-full bg-BorderLight dark:bg-secondary/20 flex items-center justify-center">
            <Briefcase size={20} className="text-TextMuted" />
          </div>
          <p className="text-sm font-semibold font-PrimaryFont text-TextPrimary dark:text-white">
            No applications yet
          </p>
          <p className="text-xs font-SecondaryFont text-TextMuted text-center max-w-[200px]">
            Start applying for jobs to track them here
          </p>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-[11px] top-2 bottom-2 w-px bg-Border dark:bg-secondary" />

          <div className="space-y-1">
            {applications.slice(0, 5).map((app, idx) => {
              const status = statusConfig[app.status] || statusConfig.pending;
              const StatusIcon = status.icon;
              return (
                <Link
                  key={app._id}
                  href={`/jobs/${app.jobId}`}
                  className="relative flex items-start gap-4 p-3 rounded-xl hover:bg-BorderLight/50 dark:hover:bg-secondary/10 transition-colors group"
                >
                  <div className="relative z-10 shrink-0 mt-0.5">
                    <span className={`flex size-6 items-center justify-center rounded-full border-2 border-white dark:border-[#1e293b] ${status.dot}`}>
                      <StatusIcon size={10} className="text-white" />
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold font-PrimaryFont text-TextPrimary dark:text-white truncate">
                        {app.job?.title || "Unknown Job"}
                      </p>
                      <ArrowRight size={12} className="text-TextMuted group-hover:text-PrimaryColor shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs font-SecondaryFont text-TextMuted truncate">
                        {app.job?.companyName || "Unknown Company"}
                      </p>
                      <span className="text-TextMuted">·</span>
                      <p className="text-xs font-SecondaryFont text-TextMuted">
                        {new Date(app.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <span className={`inline-flex items-center gap-1 mt-1.5 text-[10px] font-medium font-SecondaryFont ${status.color}`}>
                      <span className={`size-1.5 rounded-full ${status.dot}`} />
                      {status.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentApplications;
