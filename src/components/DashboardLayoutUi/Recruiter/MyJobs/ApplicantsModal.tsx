"use client";

import { useState, useEffect } from "react";
import {
  Users,
  ExternalLink,
  FileText,
  CheckCircle2,
  XCircle,
  Eye,
  Clock,
  Loader2,
  ChevronDown,
  MessageSquare,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getJobApplicants,
  updateApplicationStatus,
  type Applicant,
} from "@/lib/api/recruiter/applicantsApi";
import { toast } from "sonner";

interface ApplicantsModalProps {
  jobId: string;
  jobTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "Pending", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", icon: Clock },
  reviewed: { label: "Reviewed", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", icon: Eye },
  accepted: { label: "Accepted", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", icon: CheckCircle2 },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", icon: XCircle },
};

const ApplicantsModal = ({ jobId, jobTitle, open, onOpenChange }: ApplicantsModalProps) => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackTarget, setFeedbackTarget] = useState<{ appId: string; action: "accepted" | "rejected" } | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setApplicants([]);
    getJobApplicants(jobId)
      .then((data) => setApplicants(data))
      .catch(() => setApplicants([]))
      .finally(() => setLoading(false));
  }, [jobId, open]);

  const handleStatusChange = async (appId: string, status: "reviewed" | "accepted" | "rejected", feedback?: string) => {
    setUpdatingId(appId);
    try {
      const res = await updateApplicationStatus(appId, status, feedback);
      if (res.success) {
        setApplicants((prev) =>
          prev.map((a) => (a._id === appId ? { ...a, status, feedback: feedback || a.feedback } : a))
        );
        toast.success(`Application ${status}`);
      } else {
        toast.error("Failed to update status");
      }
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const openFeedbackDialog = (appId: string, action: "accepted" | "rejected") => {
    setFeedbackTarget({ appId, action });
    setFeedbackText("");
    setFeedbackOpen(true);
  };

  const submitFeedback = async () => {
    if (!feedbackTarget) return;
    if (feedbackTarget.action === "rejected" && !feedbackText.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    setSubmittingFeedback(true);
    await handleStatusChange(feedbackTarget.appId, feedbackTarget.action, feedbackText.trim());
    setSubmittingFeedback(false);
    setFeedbackOpen(false);
    setFeedbackTarget(null);
    setFeedbackText("");
  };

  const stats = {
    total: applicants.length,
    pending: applicants.filter((a) => a.status === "pending").length,
    reviewed: applicants.filter((a) => a.status === "reviewed").length,
    accepted: applicants.filter((a) => a.status === "accepted").length,
    rejected: applicants.filter((a) => a.status === "rejected").length,
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] bg-Surface dark:bg-[#1e293b] border-Border dark:border-secondary flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold font-PrimaryFont text-TextPrimary dark:text-white">
              Applicants — {jobTitle}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-5 gap-2">
            {[
              { label: "Total", value: stats.total, color: "text-TextPrimary dark:text-white" },
              { label: "Pending", value: stats.pending, color: "text-amber-600 dark:text-amber-400" },
              { label: "Reviewed", value: stats.reviewed, color: "text-blue-600 dark:text-blue-400" },
              { label: "Accepted", value: stats.accepted, color: "text-emerald-600 dark:text-emerald-400" },
              { label: "Rejected", value: stats.rejected, color: "text-red-600 dark:text-red-400" },
            ].map((s) => (
              <div key={s.label} className="text-center py-2 rounded-lg bg-BorderLight dark:bg-[#0f172a]">
                <p className={`text-lg font-bold font-PrimaryFont ${s.color}`}>{s.value}</p>
                <p className="text-[10px] font-SecondaryFont text-TextMuted uppercase">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto min-h-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <Loader2 size={24} className="animate-spin text-PrimaryColor" />
                <p className="text-sm font-SecondaryFont text-TextMuted">Loading applicants...</p>
              </div>
            ) : applicants.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="size-14 rounded-full bg-BorderLight dark:bg-secondary/20 flex items-center justify-center">
                  <Users size={24} className="text-TextMuted" />
                </div>
                <p className="text-sm font-semibold font-PrimaryFont text-TextPrimary dark:text-white">
                  No applicants yet
                </p>
                <p className="text-xs font-SecondaryFont text-TextMuted text-center max-w-xs">
                  When someone applies for this job, they will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {applicants.map((app) => {
                  const status = statusConfig[app.status] || statusConfig.pending;
                  const StatusIcon = status.icon;
                  const isExpanded = expandedId === app._id;
                  return (
                    <div
                      key={app._id}
                      className="rounded-xl border border-Border dark:border-secondary bg-white dark:bg-[#0f172a] overflow-hidden"
                    >
                      <div className="flex items-center gap-3 p-4">
                        <div className="size-10 rounded-full overflow-hidden bg-gradient-to-br from-PrimaryColor/20 to-SrcPrimaryColor/20 shrink-0 flex items-center justify-center">
                          {app.user?.image ? (
                            <img src={app.user.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-sm font-bold font-PrimaryFont text-PrimaryColor">
                              {app.user?.name?.charAt(0) || "?"}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold font-PrimaryFont text-TextPrimary dark:text-white truncate">
                            {app.user?.name || "Unknown User"}
                          </p>
                          <p className="text-xs font-SecondaryFont text-TextMuted truncate">
                            {app.user?.email || "No email"}
                          </p>
                        </div>
                        <span className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium font-SecondaryFont ${status.color}`}>
                          <StatusIcon size={10} />
                          {status.label}
                        </span>
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : app._id)}
                          className="shrink-0 p-1.5 rounded-lg text-TextMuted hover:text-TextPrimary hover:bg-BorderLight dark:hover:bg-secondary/20 transition-colors cursor-pointer"
                        >
                          <ChevronDown size={16} className={`transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                        </button>
                      </div>

                      {isExpanded && (
                        <div className="px-4 pb-4 pt-0 border-t border-Border dark:border-secondary space-y-3">
                          <div className="grid grid-cols-2 gap-3 pt-3">
                            {app.resumeUrl && (
                              <a
                                href={app.resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-lg bg-PrimaryColorLight dark:bg-PrimaryColorDark/20 px-3 py-2 text-xs font-semibold font-SecondaryFont text-PrimaryColor hover:bg-PrimaryColor/20 transition-colors"
                              >
                                <FileText size={14} />
                                Resume
                                <ExternalLink size={10} />
                              </a>
                            )}
                            {app.portfolioUrl && (
                              <a
                                href={app.portfolioUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-lg bg-SrcPrimaryColorLight dark:bg-SrcPrimaryColorDark/20 px-3 py-2 text-xs font-semibold font-SecondaryFont text-SrcPrimaryColor hover:bg-SrcPrimaryColor/20 transition-colors"
                              >
                                <ExternalLink size={14} />
                                Portfolio
                              </a>
                            )}
                          </div>

                          {app.coverLetter && (
                            <div className="rounded-lg bg-BorderLight dark:bg-[#1e293b] p-3">
                              <p className="text-[11px] font-semibold font-PrimaryFont text-TextMuted uppercase mb-1">
                                Cover Letter
                              </p>
                              <p className="text-xs font-SecondaryFont text-TextSecondary dark:text-text-secondary leading-relaxed whitespace-pre-wrap">
                                {app.coverLetter}
                              </p>
                            </div>
                          )}

                          {app.feedback && (
                            <div className="rounded-lg bg-gradient-to-r from-PrimaryColor/5 to-SrcPrimaryColor/5 border border-PrimaryColor/20 p-3">
                              <p className="text-[11px] font-semibold font-PrimaryFont text-TextMuted uppercase mb-1 flex items-center gap-1">
                                <MessageSquare size={10} />
                                Your Feedback
                              </p>
                              <p className="text-xs font-SecondaryFont text-TextSecondary dark:text-text-secondary leading-relaxed">
                                {app.feedback}
                              </p>
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <p className="text-[11px] font-SecondaryFont text-TextMuted">
                              Applied {new Date(app.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </p>
                            <div className="flex gap-2">
                              {app.status !== "reviewed" && (
                                <button
                                  onClick={() => handleStatusChange(app._id, "reviewed")}
                                  disabled={updatingId === app._id}
                                  className="inline-flex items-center gap-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 text-[11px] font-semibold font-SecondaryFont text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors disabled:opacity-50 cursor-pointer"
                                >
                                  {updatingId === app._id ? <Loader2 size={10} className="animate-spin" /> : <Eye size={10} />}
                                  Review
                                </button>
                              )}
                              {app.status !== "accepted" && (
                                <button
                                  onClick={() => openFeedbackDialog(app._id, "accepted")}
                                  disabled={updatingId === app._id}
                                  className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 text-[11px] font-semibold font-SecondaryFont text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors disabled:opacity-50 cursor-pointer"
                                >
                                  {updatingId === app._id ? <Loader2 size={10} className="animate-spin" /> : <CheckCircle2 size={10} />}
                                  Accept
                                </button>
                              )}
                              {app.status !== "rejected" && (
                                <button
                                  onClick={() => openFeedbackDialog(app._id, "rejected")}
                                  disabled={updatingId === app._id}
                                  className="inline-flex items-center gap-1 rounded-lg bg-red-50 dark:bg-red-900/20 px-3 py-1.5 text-[11px] font-semibold font-SecondaryFont text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50 cursor-pointer"
                                >
                                  {updatingId === app._id ? <Loader2 size={10} className="animate-spin" /> : <XCircle size={10} />}
                                  Reject
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
        <DialogContent className="sm:max-w-md bg-Surface dark:bg-[#1e293b] border-Border dark:border-secondary">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold font-PrimaryFont text-TextPrimary dark:text-white">
              {feedbackTarget?.action === "accepted" ? "Accept Application" : "Reject Application"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <p className="text-sm font-SecondaryFont text-TextSecondary dark:text-text-secondary">
              {feedbackTarget?.action === "accepted"
                ? "Add a message for the applicant (optional). They will be notified of your decision."
                : "Please provide a reason for rejection. The applicant will be notified."}
            </p>

            <div>
              <label className="block text-sm font-medium font-SecondaryFont text-TextPrimary dark:text-white mb-1.5">
                Feedback {feedbackTarget?.action === "rejected" && <span className="text-PrimaryColor">*</span>}
              </label>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={4}
                required={feedbackTarget?.action === "rejected"}
                placeholder={
                  feedbackTarget?.action === "accepted"
                    ? "e.g. We were impressed with your experience. Welcome to the team!"
                    : "e.g. We decided to go with a candidate more aligned with the required skills."
                }
                className="w-full rounded-xl border border-Border dark:border-secondary bg-BackgroundLight dark:bg-[#0f172a] px-4 py-3 text-sm font-SecondaryFont text-TextPrimary dark:text-white placeholder:text-TextMuted dark:placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-PrimaryColor/50 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setFeedbackOpen(false);
                  setFeedbackTarget(null);
                  setFeedbackText("");
                }}
                className="flex-1 h-11 rounded-xl border border-Border dark:border-secondary text-sm font-semibold font-SecondaryFont text-TextSecondary dark:text-white hover:bg-BorderLight dark:hover:bg-secondary/15 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={submitFeedback}
                disabled={submittingFeedback || (feedbackTarget?.action === "rejected" && !feedbackText.trim())}
                className={`flex-1 h-11 rounded-xl text-white text-sm font-semibold font-SecondaryFont flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
                  feedbackTarget?.action === "accepted"
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600"
                    : "bg-gradient-to-r from-red-500 to-red-600"
                }`}
              >
                {submittingFeedback ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : feedbackTarget?.action === "accepted" ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <XCircle size={16} />
                )}
                {submittingFeedback
                  ? "Submitting..."
                  : feedbackTarget?.action === "accepted"
                  ? "Accept Applicant"
                  : "Reject Applicant"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApplicantsModal;
