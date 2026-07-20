"use client";

import { useState } from "react";
import { generateCoverLetter, type CoverLetterInput } from "@/lib/api/ai";
import { ArrowLeft, Copy, Download, RefreshCw, Sparkles, Check } from "lucide-react";
import Link from "next/link";

const TONE_OPTIONS = [
  { value: "formal", label: "Formal" },
  { value: "friendly", label: "Friendly" },
  { value: "confident", label: "Confident" },
] as const;

const LENGTH_OPTIONS = [
  { value: "short", label: "Short (~150 words)" },
  { value: "medium", label: "Medium (~250 words)" },
  { value: "long", label: "Long (~350 words)" },
] as const;

export default function CoverLetterPage() {
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [category, setCategory] = useState("");
  const [skills, setSkills] = useState("");
  const [tone, setTone] = useState<CoverLetterInput["tone"]>("formal");
  const [length, setLength] = useState<CoverLetterInput["length"]>("medium");
  const [output, setOutput] = useState("");
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!jobTitle.trim() || !company.trim() || !skills.trim()) return;

    setGenerating(true);
    setOutput("");

    await generateCoverLetter(
      { jobTitle: jobTitle.trim(), company: company.trim(), category: category.trim(), skills: skills.trim(), tone, length },
      (chunk) => setOutput((prev) => prev + chunk),
      () => setGenerating(false),
      (err) => {
        setOutput(`Error: ${err.message}`);
        setGenerating(false);
      },
    );
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cover-letter-${jobTitle.replace(/\s+/g, "-").toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/seeker" className="p-2 rounded-xl hover:bg-BorderLight dark:hover:bg-secondary/15 transition-colors">
          <ArrowLeft size={20} className="text-TextSecondary" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold font-PrimaryFont text-TextPrimary dark:text-white flex items-center gap-2">
            <Sparkles size={24} className="text-SrcPrimaryColor" />
            Cover Letter Generator
          </h1>
          <p className="text-sm font-SecondaryFont text-TextSecondary dark:text-text-secondary mt-0.5">
            Create a professional, AI-powered cover letter in seconds
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-Border dark:border-secondary/40 p-5 space-y-4">
            <h2 className="text-sm font-semibold font-PrimaryFont text-TextPrimary dark:text-white">Job Details</h2>
            <div>
              <label className="block text-xs font-medium font-SecondaryFont text-TextSecondary dark:text-text-secondary mb-1.5">Job Title *</label>
              <input
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Software Engineer"
                className="w-full rounded-xl border border-Border dark:border-secondary/40 bg-white dark:bg-[#0B1120] px-3.5 py-2.5 text-sm text-TextPrimary dark:text-white placeholder:text-TextMuted focus:outline-none focus:ring-2 focus:ring-PrimaryColor/30 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium font-SecondaryFont text-TextSecondary dark:text-text-secondary mb-1.5">Company Name *</label>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Google"
                className="w-full rounded-xl border border-Border dark:border-secondary/40 bg-white dark:bg-[#0B1120] px-3.5 py-2.5 text-sm text-TextPrimary dark:text-white placeholder:text-TextMuted focus:outline-none focus:ring-2 focus:ring-PrimaryColor/30 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium font-SecondaryFont text-TextSecondary dark:text-text-secondary mb-1.5">Job Category</label>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Engineering, Marketing, Design"
                className="w-full rounded-xl border border-Border dark:border-secondary/40 bg-white dark:bg-[#0B1120] px-3.5 py-2.5 text-sm text-TextPrimary dark:text-white placeholder:text-TextMuted focus:outline-none focus:ring-2 focus:ring-PrimaryColor/30 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium font-SecondaryFont text-TextSecondary dark:text-text-secondary mb-1.5">Your Skills / Experience *</label>
              <textarea
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="List your relevant skills, experience, and achievements..."
                rows={4}
                className="w-full rounded-xl border border-Border dark:border-secondary/40 bg-white dark:bg-[#0B1120] px-3.5 py-2.5 text-sm text-TextPrimary dark:text-white placeholder:text-TextMuted focus:outline-none focus:ring-2 focus:ring-PrimaryColor/30 transition-all resize-none"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-Border dark:border-secondary/40 p-5 space-y-4">
            <h2 className="text-sm font-semibold font-PrimaryFont text-TextPrimary dark:text-white">Style Preferences</h2>
            <div>
              <label className="block text-xs font-medium font-SecondaryFont text-TextSecondary dark:text-text-secondary mb-1.5">Tone</label>
              <div className="flex gap-2">
                {TONE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setTone(opt.value)}
                    className={`flex-1 rounded-xl px-3 py-2 text-xs font-medium font-SecondaryFont transition-all ${
                      tone === opt.value
                        ? "bg-PrimaryColor text-white shadow-sm"
                        : "bg-BorderLight dark:bg-secondary/15 text-TextSecondary dark:text-text-secondary hover:bg-Border dark:hover:bg-secondary/30"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium font-SecondaryFont text-TextSecondary dark:text-text-secondary mb-1.5">Length</label>
              <div className="flex gap-2">
                {LENGTH_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setLength(opt.value)}
                    className={`flex-1 rounded-xl px-3 py-2 text-xs font-medium font-SecondaryFont transition-all ${
                      length === opt.value
                        ? "bg-SrcPrimaryColor text-white shadow-sm"
                        : "bg-BorderLight dark:bg-secondary/15 text-TextSecondary dark:text-text-secondary hover:bg-Border dark:hover:bg-secondary/30"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating || !jobTitle.trim() || !company.trim() || !skills.trim()}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor text-white px-5 py-3 text-sm font-semibold font-SecondaryFont hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {generating ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : (
              <Sparkles size={16} />
            )}
            {generating ? "Generating..." : "Generate Cover Letter"}
          </button>
        </div>

        <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-Border dark:border-secondary/40 p-5 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold font-PrimaryFont text-TextPrimary dark:text-white">Preview</h2>
            {output && !generating && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-lg hover:bg-BorderLight dark:hover:bg-secondary/15 transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? <Check size={16} className="text-SrcPrimaryColor" /> : <Copy size={16} className="text-TextSecondary" />}
                </button>
                <button
                  onClick={handleDownload}
                  className="p-2 rounded-lg hover:bg-BorderLight dark:hover:bg-secondary/15 transition-colors"
                  title="Download as TXT"
                >
                  <Download size={16} className="text-TextSecondary" />
                </button>
              </div>
            )}
          </div>
          <div className="flex-1 rounded-xl bg-gray-50 dark:bg-[#0B1120] border border-Border dark:border-secondary/40 p-4 overflow-y-auto max-h-[500px]">
            {generating && !output && (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-PrimaryColor border-t-transparent" />
                  <span className="text-xs font-SecondaryFont text-TextMuted animate-pulse">Writing your cover letter...</span>
                </div>
              </div>
            )}
            {!generating && !output && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Sparkles size={32} className="text-TextMuted mb-2" />
                <p className="text-xs font-SecondaryFont text-TextMuted">Fill in the details and generate your cover letter</p>
              </div>
            )}
            {output && (
              <pre className="text-sm font-SecondaryFont text-TextPrimary dark:text-white whitespace-pre-wrap font-sans leading-relaxed">
                {output}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
