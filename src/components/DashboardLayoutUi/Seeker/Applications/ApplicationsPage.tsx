"use client";

import { useEffect, useState, Fragment } from "react";
import Link from "next/link";
import {
  Briefcase,
  ExternalLink,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  FileText,
  Loader2,
  Search,
  MessageSquare,
} from "lucide-react";
import { getMyApplications, withdrawApplication } from "@/lib/api/seeker/applicationsApi";
import { useSession } from "@/lib/auth-client";
import PlanUsageBar from "@/components/shared/PlanUsageBar";
import { toast } from "sonner";

interface ApplicationJob {
  _id: string;
  title: string;
  companyName: string;
  companyLogo: string;
  location: string;
  jobType: string;
}

interface Application {
  _id: string;
  jobId: string;
  userId: string;
  resumeUrl: string;
  portfolioUrl: string;
  coverLetter: string;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  feedback?: string;
  createdAt: string;
  job: ApplicationJob | null;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "Pending", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", icon: Clock },
  reviewed: { label: "Reviewed", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", icon: Eye },
  accepted: { label: "Accepted", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", icon: CheckCircle2 },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", icon: XCircle },
};

const ApplicationsPage = () => {
  const { data: session } = useSession();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [withdrawing, setWithdrawing] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [viewedFeedback, setViewedFeedback] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data = await getMyApplications();
      setApplications(data as Application[]);
    } catch {
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (applicationId: string) => {
    setWithdrawing(applicationId);
    try {
      const res = await withdrawApplication(applicationId);
      if (res.success) {
        setApplications((prev) => prev.filter((a) => a._id !== applicationId));
        toast.success("Application withdrawn");
      } else {
        toast.error("Failed to withdraw application");
      }
    } catch {
      toast.error("Failed to withdraw application");
    } finally {
      setWithdrawing(null);
    }
  };

  const filtered = applications.filter((app) => {
    const matchesSearch =
      !search ||
      app.job?.title?.toLowerCase().includes(search.toLowerCase()) ||
      app.job?.companyName?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    reviewed: applications.filter((a) => a.status === "reviewed").length,
    accepted: applications.filter((a) => a.status === "accepted").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-PrimaryFont text-TextPrimary dark:text-white">
          My Applications
        </h1>
        <p className="text-sm font-SecondaryFont text-TextSecondary dark:text-text-secondary mt-1">
          Track and manage all your job applications
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Total", value: stats.total, color: "text-TextPrimary dark:text-white" },
          { label: "Pending", value: stats.pending, color: "text-amber-600 dark:text-amber-400" },
          { label: "Reviewed", value: stats.reviewed, color: "text-blue-600 dark:text-blue-400" },
          { label: "Accepted", value: stats.accepted, color: "text-emerald-600 dark:text-emerald-400" },
          { label: "Rejected", value: stats.rejected, color: "text-red-600 dark:text-red-400" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-Surface dark:bg-[#1e293b] rounded-xl border border-Border dark:border-secondary p-4 text-center"
          >
            <p className={`text-2xl font-bold font-PrimaryFont ${stat.color}`}>
              {stat.value}
            </p>
            <p className="text-xs font-SecondaryFont text-TextMuted dark:text-text-muted mt-0.5">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <PlanUsageBar
        plan={(session?.user as any)?.plan || "free_seeker"}
        role="seeker"
        usage={applications.length}
        limit={5}
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-TextMuted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by job title or company..."
            className="w-full rounded-xl border border-Border dark:border-secondary bg-Surface dark:bg-[#1e293b] pl-9 pr-4 py-2.5 text-sm font-SecondaryFont text-TextPrimary dark:text-white placeholder:text-TextMuted focus:outline-none focus:ring-2 focus:ring-PrimaryColor/50"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-Border dark:border-secondary bg-Surface dark:bg-[#1e293b] px-4 py-2.5 text-sm font-SecondaryFont text-TextPrimary dark:text-white focus:outline-none focus:ring-2 focus:ring-PrimaryColor/50 cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <div className="bg-Surface dark:bg-[#1e293b] rounded-2xl border border-Border dark:border-secondary p-10">
          <div className="flex flex-col items-center justify-center gap-3">
            <Loader2 size={24} className="animate-spin text-PrimaryColor" />
            <p className="text-sm font-SecondaryFont text-TextMuted">Loading applications...</p>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-Surface dark:bg-[#1e293b] rounded-2xl border border-Border dark:border-secondary p-10">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="size-14 rounded-full bg-BorderLight dark:bg-secondary/20 flex items-center justify-center">
              <FileText size={24} className="text-TextMuted" />
            </div>
            <p className="text-sm font-semibold font-PrimaryFont text-TextPrimary dark:text-white">
              {search || statusFilter !== "all" ? "No matching applications" : "No applications yet"}
            </p>
            <p className="text-xs font-SecondaryFont text-TextMuted text-center max-w-xs">
              {search || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Start applying for jobs to see them here"}
            </p>
            {!search && statusFilter === "all" && (
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor px-5 py-2.5 text-sm font-semibold font-SecondaryFont text-white hover:opacity-90 transition-opacity mt-2"
              >
                <Briefcase size={16} />
                Browse Jobs
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-Surface dark:bg-[#1e293b] rounded-2xl border border-Border dark:border-secondary overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-Border dark:border-secondary">
                  <th className="text-left px-6 py-4 text-xs font-semibold font-PrimaryFont uppercase tracking-wider text-TextMuted">
                    Job
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold font-PrimaryFont uppercase tracking-wider text-TextMuted hidden sm:table-cell">
                    Location
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold font-PrimaryFont uppercase tracking-wider text-TextMuted hidden md:table-cell">
                    Applied
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold font-PrimaryFont uppercase tracking-wider text-TextMuted">
                    Status
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-semibold font-PrimaryFont uppercase tracking-wider text-TextMuted">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-Border dark:divide-secondary">
                {filtered.map((app) => {
                  const status = statusConfig[app.status] || statusConfig.pending;
                  const StatusIcon = status.icon;
                  const isExpanded = expandedId === app._id;
                  const hasUnviewedFeedback = app.feedback && !viewedFeedback.has(app._id);
                  return (
                    <Fragment key={app._id}>
                    <tr
                      className="hover:bg-BorderLight/50 dark:hover:bg-secondary/10 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-xl overflow-hidden bg-BorderLight dark:bg-secondary/20 shrink-0">
                            {app.job?.companyLogo ? (
                              <img
                                src={app.job.companyLogo}
                                alt={app.job?.companyName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center w-full h-full text-sm font-bold text-PrimaryColor">
                                {app.job?.companyName?.charAt(0) || "?"}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold font-PrimaryFont text-TextPrimary dark:text-white truncate">
                              {app.job?.title || "Unknown Job"}
                            </p>
                            <p className="text-xs font-SecondaryFont text-TextMuted truncate">
                              {app.job?.companyName || "Unknown Company"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span className="text-sm font-SecondaryFont text-TextSecondary dark:text-text-secondary">
                          {app.job?.location || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className="text-sm font-SecondaryFont text-TextSecondary dark:text-text-secondary">
                          {new Date(app.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium font-SecondaryFont ${status.color}`}
                        >
                          <StatusIcon size={12} />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/jobs/${app.jobId}`}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-PrimaryColorLight dark:bg-PrimaryColorDark/20 px-3 py-1.5 text-xs font-semibold font-SecondaryFont text-PrimaryColor hover:bg-PrimaryColor/20 transition-colors"
                          >
                            <ExternalLink size={12} />
                            View
                          </Link>
                          {app.feedback && (
                            <button
                              onClick={() => {
                                if (isExpanded) {
                                  setExpandedId(null);
                                } else {
                                  setExpandedId(app._id);
                                  setViewedFeedback((prev) => new Set(prev).add(app._id));
                                }
                              }}
                              className={`relative inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold font-SecondaryFont transition-colors cursor-pointer ${
                                isExpanded
                                  ? "bg-PrimaryColorLight dark:bg-PrimaryColorDark/20 text-PrimaryColor"
                                  : app.status === "rejected"
                                  ? "bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30"
                                  : app.status === "accepted"
                                  ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
                                  : app.status === "reviewed"
                                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                                  : "bg-BorderLight dark:bg-secondary/20 text-TextMuted hover:bg-Border dark:hover:bg-secondary/30"
                              }`}
                            >
                              <MessageSquare size={12} className={app.status === "rejected" && !isExpanded ? "animate-pulse" : ""} />
                              {app.status === "accepted" && !isExpanded && (
                                <span className="size-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold leading-none">+</span>
                              )}
                              {hasUnviewedFeedback && app.status === "rejected" && (
                                <span className="absolute -top-1 -right-1 size-2.5 rounded-full bg-red-500 animate-pulse border-2 border-white dark:border-[#1e293b]" />
                              )}
                            </button>
                          )}
                          {app.status === "pending" && (
                            <button
                              onClick={() => handleWithdraw(app._id)}
                              disabled={withdrawing === app._id}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 px-3 py-1.5 text-xs font-semibold font-SecondaryFont text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50 cursor-pointer"
                            >
                              {withdrawing === app._id ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : (
                                <XCircle size={12} />
                              )}
                              Withdraw
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {isExpanded && app.feedback && (
                      <tr key={`${app._id}-feedback`}>
                        <td colSpan={5} className="px-6 py-3 bg-BorderLight/30 dark:bg-secondary/5">
                          <div className="flex items-start gap-2">
                            <MessageSquare size={14} className="text-PrimaryColor mt-0.5 shrink-0" />
                            <div>
                              <p className="text-[11px] font-semibold font-PrimaryFont text-TextMuted uppercase mb-0.5">
                                Recruiter Feedback
                              </p>
                              <p className="text-xs font-SecondaryFont text-TextSecondary dark:text-text-secondary leading-relaxed">
                                {app.feedback}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-3 border-t border-Border dark:border-secondary">
            <p className="text-xs font-SecondaryFont text-TextMuted">
              Showing {filtered.length} of {applications.length} application{applications.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;
