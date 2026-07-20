"use client";

import { useState } from "react";
import { classifyResumes, type ClassifierResult, type ClassifierCandidate } from "@/lib/api/ai";
import {
  Bot,
  Briefcase,
  Sparkles,
  Plus,
  X,
  Loader2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface CandidateEntry {
  id: string;
  name: string;
  resumeText: string;
}

export default function ResumeClassifier() {
  const [jobTitle, setJobTitle] = useState("");
  const [requirementInput, setRequirementInput] = useState("");
  const [requirements, setRequirements] = useState<string[]>([]);
  const [candidates, setCandidates] = useState<CandidateEntry[]>([
    { id: "1", name: "", resumeText: "" },
    { id: "2", name: "", resumeText: "" },
  ]);
  const [results, setResults] = useState<ClassifierResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedResults, setExpandedResults] = useState(true);

  const addRequirement = () => {
    const trimmed = requirementInput.trim();
    if (trimmed && !requirements.includes(trimmed)) {
      setRequirements([...requirements, trimmed]);
      setRequirementInput("");
    }
  };

  const removeRequirement = (idx: number) => {
    setRequirements(requirements.filter((_, i) => i !== idx));
  };

  const handleReqKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addRequirement();
    }
  };

  const addCandidate = () => {
    const nextId = String(candidates.length + 1);
    setCandidates([...candidates, { id: nextId, name: "", resumeText: "" }]);
  };

  const removeCandidate = (id: string) => {
    if (candidates.length <= 1) return;
    setCandidates(candidates.filter((c) => c.id !== id));
  };

  const updateCandidate = (id: string, field: keyof CandidateEntry, value: string) => {
    setCandidates(candidates.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const handleClassify = async () => {
    if (!jobTitle.trim()) {
      setError("Please enter a job title");
      return;
    }
    if (requirements.length === 0) {
      setError("Please add at least one job requirement");
      return;
    }

    const validCandidates = candidates.filter((c) => c.resumeText.trim().length >= 20);
    if (validCandidates.length === 0) {
      setError("Please provide resume text (min 20 chars) for at least one candidate");
      return;
    }

    setError("");
    setLoading(true);
    setResults(null);

    try {
      const apiCandidates: ClassifierCandidate[] = validCandidates.map((c) => ({
        userId: c.name.trim() || `Candidate ${c.id}`,
        resumeText: c.resumeText,
      }));

      const response = await classifyResumes(jobTitle.trim(), requirements, apiCandidates);
      const sorted = (response.classifications || []).sort((a, b) => b.score - a.score);
      setResults(sorted);
      setExpandedResults(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Classification failed");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "bg-green-500";
    if (score >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getScoreBg = (score: number) => {
    if (score >= 70) return "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800";
    if (score >= 40) return "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800";
    return "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800";
  };

  const getScoreText = (score: number) => {
    if (score >= 70) return "text-green-700 dark:text-green-400";
    if (score >= 40) return "text-yellow-700 dark:text-yellow-400";
    return "text-red-700 dark:text-red-400";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-PrimaryColorLight to-SrcPrimaryColorLight dark:from-PrimaryColor/20 dark:to-SrcPrimaryColor/20">
          <Bot size={24} className="text-SrcPrimaryColor" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-PrimaryFont text-TextPrimary dark:text-white">AI Resume Classifier</h1>
          <p className="text-sm font-SecondaryFont text-TextSecondary dark:text-text-secondary mt-0.5">
            Analyze and rank applicant resumes against your job requirements using AI
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary/40 p-5 space-y-5">
        <h2 className="text-base font-semibold font-PrimaryFont text-TextPrimary dark:text-white flex items-center gap-2">
          <Briefcase size={16} className="text-PrimaryColor" />
          Job Details
        </h2>

        <div>
          <label className="block text-xs font-medium font-SecondaryFont text-TextSecondary dark:text-text-secondary mb-1.5">
            Job Title
          </label>
          <input
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g., Senior Software Engineer"
            className="w-full rounded-xl border border-Border dark:border-secondary/40 bg-transparent px-3.5 py-2.5 text-sm text-TextPrimary dark:text-white placeholder:text-TextMuted focus:outline-none focus:ring-2 focus:ring-PrimaryColor/30"
          />
        </div>

        <div>
          <label className="block text-xs font-medium font-SecondaryFont text-TextSecondary dark:text-text-secondary mb-1.5">
            Job Requirements
          </label>
          <div className="flex items-center gap-2 mb-2">
            <input
              value={requirementInput}
              onChange={(e) => setRequirementInput(e.target.value)}
              onKeyDown={handleReqKeyDown}
              placeholder="Type a requirement and press Enter"
              className="flex-1 rounded-xl border border-Border dark:border-secondary/40 bg-transparent px-3.5 py-2.5 text-sm text-TextPrimary dark:text-white placeholder:text-TextMuted focus:outline-none focus:ring-2 focus:ring-PrimaryColor/30"
            />
            <button
              onClick={addRequirement}
              disabled={!requirementInput.trim()}
              className="size-9 rounded-xl bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor flex items-center justify-center text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0"
            >
              <Plus size={14} />
            </button>
          </div>
          {requirements.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {requirements.map((req, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-BorderLight dark:bg-secondary/20 text-xs font-medium text-TextPrimary dark:text-white"
                >
                  {req}
                  <button onClick={() => removeRequirement(i)} className="hover:text-red-500 transition-colors">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary/40 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold font-PrimaryFont text-TextPrimary dark:text-white flex items-center gap-2">
            <Sparkles size={16} className="text-SrcPrimaryColor" />
            Candidates
          </h2>
          <button
            onClick={addCandidate}
            className="inline-flex items-center gap-1 text-xs font-medium text-SrcPrimaryColor hover:opacity-80 transition-opacity"
          >
            <Plus size={12} />
            Add Candidate
          </button>
        </div>

        <div className="space-y-3">
          {candidates.map((candidate, idx) => (
            <div
              key={candidate.id}
              className="rounded-xl border border-Border dark:border-secondary/40 p-3 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold font-SecondaryFont text-TextSecondary">
                  Candidate {idx + 1}
                </span>
                {candidates.length > 1 && (
                  <button
                    onClick={() => removeCandidate(candidate.id)}
                    className="text-TextMuted hover:text-red-500 transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              <input
                value={candidate.name}
                onChange={(e) => updateCandidate(candidate.id, "name", e.target.value)}
                placeholder="Candidate name (optional)"
                className="w-full rounded-lg border border-Border dark:border-secondary/40 bg-transparent px-3 py-1.5 text-xs text-TextPrimary dark:text-white placeholder:text-TextMuted focus:outline-none focus:ring-2 focus:ring-PrimaryColor/30"
              />
              <textarea
                value={candidate.resumeText}
                onChange={(e) => updateCandidate(candidate.id, "resumeText", e.target.value)}
                placeholder="Paste the candidate's resume text here..."
                rows={4}
                className="w-full rounded-lg border border-Border dark:border-secondary/40 bg-transparent px-3 py-1.5 text-xs text-TextPrimary dark:text-white placeholder:text-TextMuted focus:outline-none focus:ring-2 focus:ring-PrimaryColor/30 resize-y"
              />
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 p-3.5">
          <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
          <p className="text-xs font-SecondaryFont text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      <button
        onClick={handleClassify}
        disabled={loading}
        className="w-full rounded-2xl bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor text-white font-semibold font-PrimaryFont py-3.5 text-sm hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Classifying Resumes...
          </>
        ) : (
          <>
            <Bot size={16} />
            Classify Resumes with AI
          </>
        )}
      </button>

      {results !== null && (
        <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary/40 overflow-hidden">
          <button
            onClick={() => setExpandedResults(!expandedResults)}
            className="w-full flex items-center justify-between p-4 hover:bg-BorderLight dark:hover:bg-secondary/10 transition-colors"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-green-500" />
              <h2 className="text-base font-semibold font-PrimaryFont text-TextPrimary dark:text-white">
                Classification Results
              </h2>
              <span className="text-xs font-medium text-TextSecondary bg-BorderLight dark:bg-secondary/20 px-2 py-0.5 rounded-full">
                {results.length} candidate{results.length !== 1 ? "s" : ""}
              </span>
            </div>
            {expandedResults ? <ChevronUp size={16} className="text-TextMuted" /> : <ChevronDown size={16} className="text-TextMuted" />}
          </button>

          {expandedResults && (
            <div className="px-4 pb-4 space-y-2">
              {results.length === 0 ? (
                <p className="text-xs text-TextSecondary text-center py-6">No classifications returned. Try adjusting your requirements.</p>
              ) : (
                results.map((result, i) => (
                  <div
                    key={result.userId}
                    className={`rounded-xl border p-3.5 ${getScoreBg(result.score)}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-TextPrimary dark:text-white font-PrimaryFont">
                            {i + 1}. {result.userId}
                          </span>
                          <span className={`text-xs font-bold font-SecondaryFont ${getScoreText(result.score)}`}>
                            {result.score}/100
                          </span>
                        </div>
                        {result.tags && result.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {result.tags.map((tag, j) => (
                              <span
                                key={j}
                                className="inline-flex px-2 py-0.5 rounded-md bg-white dark:bg-[#1e293b] text-[10px] font-medium text-TextSecondary dark:text-text-secondary border border-Border dark:border-secondary/40"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="shrink-0">
                        <div className="relative size-9">
                          <div className="absolute inset-0 rounded-full bg-gray-200 dark:bg-secondary/30" />
                          <div
                            className={`absolute inset-0 rounded-full ${getScoreColor(result.score)}`}
                            style={{ clipPath: `inset(${100 - result.score}% 0 0 0)` }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className={`text-[10px] font-bold ${getScoreText(result.score)}`}>
                              {result.score}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
