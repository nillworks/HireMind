"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Briefcase,
  Users,
  RefreshCw,
} from "lucide-react";
import fetchClient from "@/lib/utils/fetchClient";

const isValidUrl = (str?: string): str is string => {
  if (!str) return false;
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
};

interface RecentJob {
  _id: string;
  title: string;
  companyName: string;
  companyLogo?: string;
  status: "pending" | "approved" | "rejected";
  applicationCount: number;
  createdAt: string;
}

interface RecentUser {
  _id: string;
  userId: string;
  name: string;
  email: string;
  userImage?: string;
  company: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

const statusConfig = {
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
    icon: Clock,
  },
  approved: {
    label: "Approved",
    className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
    icon: CheckCircle2,
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400",
    icon: XCircle,
  },
};

const ActivitySection = () => {
  const [recentJobs, setRecentJobs] = useState<RecentJob[]>([]);
  const [recentRequests, setRecentRequests] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [jobsData, requestsData] = await Promise.all([
        fetchClient<{ success: boolean; data: RecentJob[] }>(
          "/api/admin/jobs?limit=5"
        ),
        fetchClient<{ success: boolean; data: RecentUser[] }>(
          "/api/admin/recruiter-requests?limit=5"
        ),
      ]);
      setRecentJobs(jobsData.data ?? []);
      setRecentRequests(requestsData.data ?? []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-5 w-32 bg-Border dark:bg-secondary rounded animate-pulse" />
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-14 bg-Border dark:bg-secondary rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Recent Jobs */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold font-PrimaryFont text-TextPrimary dark:text-surface flex items-center gap-2">
            <Briefcase size={16} className="text-PrimaryColor" />
            Recent Jobs
          </h3>
          <button
            onClick={() => fetchData()}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <RefreshCw size={14} className="text-TextMuted" />
          </button>
        </div>
        {recentJobs.length === 0 ? (
          <p className="text-sm font-SecondaryFont text-TextMuted py-4 text-center">
            No jobs yet.
          </p>
        ) : (
          <div className="space-y-2">
            {recentJobs.map((job) => {
              const badge = statusConfig[job.status] || statusConfig.pending;
              const BadgeIcon = badge.icon;
              return (
                <div
                  key={job._id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/30 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
                >
                  {isValidUrl(job.companyLogo) ? (
                    <Image
                      src={job.companyLogo}
                      alt={job.companyName}
                      width={36}
                      height={36}
                      className="size-9 rounded-lg object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-PrimaryColor to-SrcPrimaryColor flex-shrink-0">
                      <span className="text-xs font-bold font-PrimaryFont text-white">
                        {job.companyName?.charAt(0).toUpperCase() || "C"}
                      </span>
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-SecondaryFont font-medium text-TextPrimary dark:text-surface truncate">
                      {job.title}
                    </p>
                    <p className="text-xs font-SecondaryFont text-TextMuted truncate">
                      {job.companyName} · {job.applicationCount} applications
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-SecondaryFont font-medium px-1.5 py-0.5 rounded-full flex-shrink-0 ${badge.className}`}
                  >
                    <BadgeIcon size={10} />
                    {badge.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Recruiter Requests */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold font-PrimaryFont text-TextPrimary dark:text-surface flex items-center gap-2">
            <Users size={16} className="text-SrcPrimaryColor" />
            Recent Recruiter Requests
          </h3>
        </div>
        {recentRequests.length === 0 ? (
          <p className="text-sm font-SecondaryFont text-TextMuted py-4 text-center">
            No requests yet.
          </p>
        ) : (
          <div className="space-y-2">
            {recentRequests.map((req) => {
              const badge = statusConfig[req.status] || statusConfig.pending;
              const BadgeIcon = badge.icon;
              return (
                <div
                  key={req._id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/30 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
                >
                  {isValidUrl(req.userImage) ? (
                    <Image
                      src={req.userImage}
                      alt={req.name}
                      width={36}
                      height={36}
                      className="size-9 rounded-lg object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-PrimaryColor to-SrcPrimaryColor flex-shrink-0">
                      <span className="text-xs font-bold font-PrimaryFont text-white">
                        {req.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-SecondaryFont font-medium text-TextPrimary dark:text-surface truncate">
                      {req.name}
                    </p>
                    <p className="text-xs font-SecondaryFont text-TextMuted truncate">
                      {req.company}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-SecondaryFont font-medium px-1.5 py-0.5 rounded-full flex-shrink-0 ${badge.className}`}
                  >
                    <BadgeIcon size={10} />
                    {badge.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivitySection;
