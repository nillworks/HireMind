"use client";

import { useState, useRef } from "react";
import { analyzeResume, type ResumeAnalysis } from "@/lib/api/ai";
import {
  ArrowLeft, Upload, FileText, Download, Sparkles,
  CheckCircle2, AlertCircle, Lightbulb, Star, RefreshCw,
} from "lucide-react";
import Link from "next/link";

export default function ResumeAnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"upload" | "paste">("upload");
  const [wordCount, setWordCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAnalyze = async () => {
    setError("");
    setLoading(true);
    setAnalysis(null);

    try {
      const result = await analyzeResume(file || undefined, mode === "paste" ? resumeText : undefined);
      setAnalysis(result.analysis);
      setWordCount(result.wordCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = () => {
    if (!analysis) return;
    const report = [
      "=== Resume Analysis Report ===",
      `Score: ${analysis.score}/100`,
      "",
      "Skills Identified:",
      ...analysis.skills.map((s) => `  - ${s}`),
      "",
      `Experience: ${analysis.experience}`,
      `Education: ${analysis.education}`,
      "",
      "Strengths:",
      ...analysis.strengths.map((s) => `  + ${s}`),
      "",
      "Areas to Improve:",
      ...analysis.weaknesses.map((w) => `  - ${w}`),
      "",
      "Suggestions:",
      ...analysis.suggestions.map((su) => `  * ${su}`),
    ].join("\n");

    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume-analysis-report.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/seeker" className="p-2 rounded-xl hover:bg-BorderLight dark:hover:bg-secondary/15 transition-colors">
          <ArrowLeft size={20} className="text-TextSecondary" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold font-PrimaryFont text-TextPrimary dark:text-white flex items-center gap-2">
            <FileText size={24} className="text-SrcPrimaryColor" />
            Resume Analyzer
          </h1>
          <p className="text-sm font-SecondaryFont text-TextSecondary dark:text-text-secondary mt-0.5">
            Get AI-powered insights on your resume to improve your job prospects
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-Border dark:border-secondary/40 p-5 space-y-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode("upload")}
            className={`px-4 py-2 rounded-xl text-xs font-medium font-SecondaryFont transition-all ${
              mode === "upload"
                ? "bg-PrimaryColor text-white"
                : "bg-BorderLight dark:bg-secondary/15 text-TextSecondary dark:text-text-secondary"
            }`}
          >
            Upload File
          </button>
          <button
            onClick={() => setMode("paste")}
            className={`px-4 py-2 rounded-xl text-xs font-medium font-SecondaryFont transition-all ${
              mode === "paste"
                ? "bg-PrimaryColor text-white"
                : "bg-BorderLight dark:bg-secondary/15 text-TextSecondary dark:text-text-secondary"
            }`}
          >
            Paste Text
          </button>
        </div>

        {mode === "upload" ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-Border dark:border-secondary/40 rounded-xl p-8 text-center cursor-pointer hover:border-PrimaryColor/50 dark:hover:border-PrimaryColor/30 transition-colors"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
            />
            {file ? (
              <div className="flex flex-col items-center gap-2">
                <FileText size={32} className="text-PrimaryColor" />
                <p className="text-sm font-medium font-SecondaryFont text-TextPrimary dark:text-white">{file.name}</p>
                <p className="text-xs font-SecondaryFont text-TextMuted">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload size={32} className="text-TextMuted" />
                <p className="text-sm font-SecondaryFont text-TextMuted">Click to upload PDF, DOCX, or TXT</p>
              </div>
            )}
          </div>
        ) : (
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume content here..."
            rows={8}
            className="w-full rounded-xl border border-Border dark:border-secondary/40 bg-white dark:bg-[#0B1120] px-3.5 py-2.5 text-sm text-TextPrimary dark:text-white placeholder:text-TextMuted focus:outline-none focus:ring-2 focus:ring-PrimaryColor/30 transition-all resize-none"
          />
        )}

        <button
          onClick={handleAnalyze}
          disabled={loading || (mode === "upload" ? !file : !resumeText.trim())}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor text-white px-5 py-3 text-sm font-semibold font-SecondaryFont hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <RefreshCw size={16} className="animate-spin" />
          ) : (
            <Sparkles size={16} />
          )}
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-2xl p-4">
          <p className="text-sm font-SecondaryFont text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {loading && (
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-Border dark:border-secondary/40 p-8 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-PrimaryColor border-t-transparent mx-auto mb-3" />
          <p className="text-sm font-SecondaryFont text-TextMuted animate-pulse">Analyzing your resume...</p>
        </div>
      )}

      {analysis && !loading && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-Border dark:border-secondary/40 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold font-PrimaryFont text-TextPrimary dark:text-white">Overall Score</h2>
              <button onClick={handleDownloadReport} className="flex items-center gap-1.5 text-xs font-medium font-SecondaryFont text-TextSecondary hover:text-PrimaryColor transition-colors">
                <Download size={14} />
                Download Report
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative size-20">
                <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeWidth="3" className="text-Border dark:text-secondary/30" />
                  <circle
                    cx="18" cy="18" r="15.5" fill="none" stroke={analysis.score >= 70 ? "#10B981" : analysis.score >= 40 ? "#F59E0B" : "#EF4444"}
                    strokeWidth="3" strokeLinecap="round"
                    strokeDasharray={`${(analysis.score / 100) * 97.4} ${97.4 - (analysis.score / 100) * 97.4}`}
                    className="transition-all duration-700"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-lg font-bold font-PrimaryFont text-TextPrimary dark:text-white">
                  {analysis.score}
                </span>
              </div>
              <div className="text-xs font-SecondaryFont text-TextSecondary">
                <p>Word count: {wordCount}</p>
                <p>Skills found: {analysis.skills.length}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-Border dark:border-secondary/40 p-5">
              <h3 className="text-xs font-semibold font-SecondaryFont text-TextPrimary dark:text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-500" />
                Strengths
              </h3>
              <ul className="space-y-2">
                {analysis.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs font-SecondaryFont text-TextSecondary">
                    <span className="mt-0.5 size-1.5 rounded-full bg-emerald-500 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-Border dark:border-secondary/40 p-5">
              <h3 className="text-xs font-semibold font-SecondaryFont text-TextPrimary dark:text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <AlertCircle size={14} className="text-amber-500" />
                Areas to Improve
              </h3>
              <ul className="space-y-2">
                {analysis.weaknesses.map((w, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs font-SecondaryFont text-TextSecondary">
                    <span className="mt-0.5 size-1.5 rounded-full bg-amber-500 shrink-0" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-Border dark:border-secondary/40 p-5">
            <h3 className="text-xs font-semibold font-SecondaryFont text-TextPrimary dark:text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Lightbulb size={14} className="text-PrimaryColor" />
              Suggestions
            </h3>
            <ul className="space-y-2">
              {analysis.suggestions.map((su, i) => (
                <li key={i} className="flex items-start gap-2 text-xs font-SecondaryFont text-TextSecondary">
                  <span className="mt-0.5 size-1.5 rounded-full bg-PrimaryColor shrink-0" />
                  {su}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-Border dark:border-secondary/40 p-5">
            <h3 className="text-xs font-semibold font-SecondaryFont text-TextPrimary dark:text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Star size={14} className="text-SrcPrimaryColor" />
              Experience & Education
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium font-SecondaryFont text-TextPrimary dark:text-white mb-1">Experience</p>
                <p className="text-xs font-SecondaryFont text-TextSecondary leading-relaxed">{analysis.experience || "Not specified"}</p>
              </div>
              <div>
                <p className="text-xs font-medium font-SecondaryFont text-TextPrimary dark:text-white mb-1">Education</p>
                <p className="text-xs font-SecondaryFont text-TextSecondary leading-relaxed">{analysis.education || "Not specified"}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
