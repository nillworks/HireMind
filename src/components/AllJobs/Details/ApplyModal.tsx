"use client";

import { useState } from "react";
import { Send, FileText, Loader2, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useSession } from "@/lib/auth-client";
import { applyForJob } from "@/lib/api/seeker/applicationsApi";
import { toast } from "sonner";
import type { Job } from "@/lib/api/public/jobsApi";

interface ApplyModalProps {
  job: Job;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplySuccess: () => void;
}

const ApplyModal = ({ job, open, onOpenChange, onApplySuccess }: ApplyModalProps) => {
  const { data: session } = useSession();
  const user = session?.user;
  const [resumeUrl, setResumeUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const wordCount = coverLetter.trim() ? coverLetter.trim().split(/\s+/).length : 0;
  const isOverLimit = wordCount > 120;
  const isUnderMin = wordCount > 0 && wordCount < 80;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!resumeUrl.trim()) {
      toast.error("Resume URL is required");
      return;
    }
    if (!portfolioUrl.trim()) {
      toast.error("Portfolio URL is required");
      return;
    }
    if (!coverLetter.trim()) {
      toast.error("Cover letter is required");
      return;
    }
    if (wordCount < 80) {
      toast.error("Cover letter must be at least 80 words");
      return;
    }
    if (wordCount > 120) {
      toast.error("Cover letter must be 120 words or less");
      return;
    }

    setSubmitting(true);
    try {
      const res = await applyForJob({
        jobId: job._id,
        resumeUrl: resumeUrl.trim(),
        portfolioUrl: portfolioUrl.trim(),
        coverLetter: coverLetter.trim() || undefined,
      });
      if (res.success) {
        setSuccess(true);
        onApplySuccess();
        toast.success("Application submitted successfully!");
      } else {
        toast.error(res.message || "Failed to submit application");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to submit application";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setResumeUrl("");
    setPortfolioUrl("");
    setCoverLetter("");
    onOpenChange(false);
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg bg-Surface dark:bg-[#1e293b] border-Border dark:border-secondary">
        {success ? (
          <div className="py-8 text-center space-y-4">
            <div className="inline-flex size-16 items-center justify-center rounded-full bg-SrcPrimaryColor/10 mx-auto">
              <CheckCircle size={32} className="text-SrcPrimaryColor" />
            </div>
            <h3 className="text-xl font-bold font-PrimaryFont text-TextPrimary dark:text-white">
              Application Submitted!
            </h3>
            <p className="text-sm font-SecondaryFont text-TextSecondary dark:text-text-secondary max-w-sm mx-auto">
              Your application for <span className="font-semibold text-PrimaryColor">{job.title}</span> at{" "}
              <span className="font-semibold text-SrcPrimaryColor">{job.companyName}</span> has been submitted successfully.
            </p>
            <button
              onClick={handleClose}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor px-6 py-2.5 text-sm font-semibold font-SecondaryFont text-white hover:opacity-90 transition-opacity cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="text-lg font-bold font-PrimaryFont text-TextPrimary dark:text-white">
                Apply for {job.title}
              </DialogTitle>
              <DialogDescription className="text-sm font-SecondaryFont text-TextSecondary dark:text-text-secondary">
                at {job.companyName}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium font-SecondaryFont text-TextPrimary dark:text-white mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={user.name || ""}
                  disabled
                  className="w-full rounded-xl border border-Border dark:border-secondary bg-BorderLight dark:bg-[#0f172a] px-4 py-3 text-sm font-SecondaryFont text-TextMuted dark:text-text-muted cursor-not-allowed"
                />
                <p className="text-xs font-SecondaryFont text-TextMuted dark:text-text-muted mt-1">
                  Name from your account
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium font-SecondaryFont text-TextPrimary dark:text-white mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user.email || ""}
                  disabled
                  className="w-full rounded-xl border border-Border dark:border-secondary bg-BorderLight dark:bg-[#0f172a] px-4 py-3 text-sm font-SecondaryFont text-TextMuted dark:text-text-muted cursor-not-allowed"
                />
                <p className="text-xs font-SecondaryFont text-TextMuted dark:text-text-muted mt-1">
                  Email from your account
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium font-SecondaryFont text-TextPrimary dark:text-white mb-1.5">
                  Resume URL <span className="text-PrimaryColor">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  placeholder="https://drive.google.com/your-resume"
                  className="w-full rounded-xl border border-Border dark:border-secondary bg-BackgroundLight dark:bg-[#0f172a] px-4 py-3 text-sm font-SecondaryFont text-TextPrimary dark:text-white placeholder:text-TextMuted dark:placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-PrimaryColor/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium font-SecondaryFont text-TextPrimary dark:text-white mb-1.5">
                  Portfolio URL <span className="text-PrimaryColor">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://yourportfolio.com"
                  className="w-full rounded-xl border border-Border dark:border-secondary bg-BackgroundLight dark:bg-[#0f172a] px-4 py-3 text-sm font-SecondaryFont text-TextPrimary dark:text-white placeholder:text-TextMuted dark:placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-PrimaryColor/50"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium font-SecondaryFont text-TextPrimary dark:text-white">
                    Cover Letter <span className="text-PrimaryColor">*</span>
                  </label>
                  <span className={`text-xs font-SecondaryFont ${isOverLimit ? "text-red-500 font-semibold" : isUnderMin ? "text-amber-500 font-semibold" : "text-TextMuted dark:text-text-muted"}`}>
                    {wordCount > 0 ? `${wordCount}/120 words` : "80–120 words"}
                  </span>
                </div>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={5}
                  required
                  placeholder={`Write a brief cover letter to stand out:\n\n• Introduce yourself and your background\n• Explain why you're interested in this role\n• Highlight your most relevant skills & experience\n• Mention what value you bring to ${job.companyName}\n• Keep it concise and professional (80–120 words)`}
                  className={`w-full rounded-xl border bg-BackgroundLight dark:bg-[#0f172a] px-4 py-3 text-sm font-SecondaryFont text-TextPrimary dark:text-white placeholder:text-TextMuted dark:placeholder:text-text-muted focus:outline-none focus:ring-2 resize-none ${
                    isOverLimit
                      ? "border-red-500 focus:ring-red-500/50"
                      : "border-Border dark:border-secondary focus:ring-PrimaryColor/50"
                  }`}
                />
                {isOverLimit && (
                  <p className="text-xs font-SecondaryFont text-red-500 mt-1">
                    Cover letter exceeds 120 word limit
                  </p>
                )}
                {isUnderMin && (
                  <p className="text-xs font-SecondaryFont text-amber-500 mt-1">
                    Minimum 80 words required ({80 - wordCount} more needed)
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 h-11 rounded-xl border border-Border dark:border-secondary text-sm font-semibold font-SecondaryFont text-TextSecondary dark:text-white hover:bg-BorderLight dark:hover:bg-secondary/15 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !resumeUrl.trim() || !portfolioUrl.trim() || !coverLetter.trim() || isOverLimit || isUnderMin}
                className="flex-1 h-11 rounded-xl bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor text-white text-sm font-semibold font-SecondaryFont flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Submit Application
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ApplyModal;
