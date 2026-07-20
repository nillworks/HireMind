"use client";

import { useState } from "react";
import { Sparkles, X, Loader2, AlertCircle, CheckCircle2, FileText, Wand2 } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL;

interface JobPostData {
  title: string;
  companyName: string;
  category: string;
  jobType: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  shortDescription: string;
  fullDescription: string;
  requirements: string[];
}

interface JobPostHelperProps {
  onFill: (data: JobPostData) => void;
}

export default function JobPostHelper({ onFill }: JobPostHelperProps) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const wordCount = description.trim() ? description.trim().split(/\s+/).length : 0;
  const isMinMet = wordCount >= 20;

  const handleGenerate = async () => {
    if (!isMinMet) return;

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const tokenRes = await fetch("/api/auth/token", { credentials: "include" });
      const { token } = await tokenRes.json();

      const res = await fetch(`${API}/api/ai/generate-job-post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data?.message || "Generation failed");
      }

      const result: JobPostData = data.data;
      onFill(result);
      setSuccess("Job post generated! Fields have been filled.");
      setTimeout(() => {
        setOpen(false);
        setDescription("");
        setSuccess("");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate job post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="h-10 px-4 rounded-xl bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor text-white font-SecondaryFont font-medium text-sm hover:opacity-90 transition-all flex items-center gap-1.5 shadow-md hover:shadow-lg cursor-pointer"
      >
        <Sparkles size={14} />
        AI Assist
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-[#0f172a] border border-Border dark:border-secondary/40 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-Border dark:border-secondary/40">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-PrimaryColorLight to-SrcPrimaryColorLight dark:from-PrimaryColorDark/30 dark:to-SrcPrimaryColorDark/30">
                  <Sparkles size={16} className="text-PrimaryColor dark:text-PrimaryColorLight" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold font-PrimaryFont text-TextPrimary dark:text-white">
                    AI Job Post Assistant
                  </h3>
                  <p className="text-[10px] font-SecondaryFont text-TextSecondary">
                    Describe the job and let AI fill the form for you
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setOpen(false); setError(""); setSuccess(""); }}
                className="p-1.5 rounded-lg hover:bg-BorderLight dark:hover:bg-secondary/20 transition-colors"
              >
                <X size={16} className="text-TextMuted" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium font-SecondaryFont text-TextSecondary">
                  Describe the job you want to post
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the job role, responsibilities, required skills, company details, location, salary range, and any other relevant information. Be as detailed as possible..."
                  rows={8}
                  className="w-full rounded-xl border border-Border dark:border-secondary/40 bg-transparent px-3.5 py-2.5 text-sm text-TextPrimary dark:text-white placeholder:text-TextMuted focus:outline-none focus:ring-2 focus:ring-PrimaryColor/30 resize-y"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <FileText size={12} className="text-TextMuted" />
                  <span className={`text-xs font-medium font-SecondaryFont ${isMinMet ? "text-SrcPrimaryColor" : "text-TextMuted"}`}>
                    {wordCount} / 20 words minimum
                  </span>
                  {isMinMet && <CheckCircle2 size={12} className="text-SrcPrimaryColor" />}
                </div>
                <div className="h-1.5 w-28 rounded-full bg-BorderLight dark:bg-secondary/20 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300 bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor"
                    style={{ width: `${Math.min((wordCount / 20) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 p-3">
                  <AlertCircle size={14} className="text-red-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-red-700 dark:text-red-400">{error}</p>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 p-3">
                  <CheckCircle2 size={14} className="text-green-500 shrink-0" />
                  <p className="text-xs text-green-700 dark:text-green-400">{success}</p>
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={!isMinMet || loading}
                className="w-full rounded-xl bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor text-white font-semibold font-PrimaryFont py-3 text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Generate Job Post
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
