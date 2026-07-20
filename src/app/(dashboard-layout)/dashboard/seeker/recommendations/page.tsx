"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getJobRecommendations, type RecommendationResult } from "@/lib/api/ai";
import { useSession } from "@/lib/auth-client";
import { getSeekerProfileClient } from "@/lib/api/seeker/overviewApi";
import { getMyApplicationsClient } from "@/lib/api/seeker/overviewApi";
import { getSavedJobsClient } from "@/lib/api/seeker/overviewApi";
import { ArrowLeft, Sparkles, Briefcase, MapPin, DollarSign, Target } from "lucide-react";

export default function RecommendationsPage() {
  const { data: session } = useSession();
  const [recommendations, setRecommendations] = useState<RecommendationResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalJobs, setTotalJobs] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profile, applications, saved] = await Promise.all([
          getSeekerProfileClient().catch(() => null),
          getMyApplicationsClient().catch(() => []),
          getSavedJobsClient().catch(() => []),
        ]);

        const skills = profile?.skills || [];
        const appliedJobs = applications.map((a: any) => ({
          title: a.jobTitle || "",
          company: a.companyName || "",
          category: a.category || "",
        }));
        const savedJobs = saved.map((s: any) => ({
          title: s.jobTitle || "",
          company: s.companyName || "",
          category: s.category || "",
        }));

        const result = await getJobRecommendations({
          skills,
          appliedJobs,
          savedJobs,
          preferredLocation: profile?.location,
        });

        setRecommendations(result.recommendations);
        setTotalJobs(result.totalJobs);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to get recommendations");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const scoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-400";
  };

  const scoreBg = (score: number) => {
    if (score >= 80) return "bg-emerald-100 dark:bg-emerald-900/20";
    if (score >= 60) return "bg-amber-100 dark:bg-amber-900/20";
    return "bg-red-100 dark:bg-red-900/20";
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
            Job Recommendations
          </h1>
          <p className="text-sm font-SecondaryFont text-TextSecondary dark:text-text-secondary mt-0.5">
            Personalized job matches based on your skills and preferences
          </p>
        </div>
      </div>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-[#1e293b] rounded-2xl border border-Border dark:border-secondary/40 p-5 animate-pulse">
              <div className="h-5 w-48 bg-gray-200 dark:bg-secondary/20 rounded-lg mb-3" />
              <div className="h-4 w-32 bg-gray-200 dark:bg-secondary/20 rounded-lg mb-2" />
              <div className="h-4 w-full bg-gray-200 dark:bg-secondary/20 rounded-lg" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-2xl p-5">
          <p className="text-sm font-SecondaryFont text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {!loading && !error && recommendations.length === 0 && (
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-Border dark:border-secondary/40 p-10 text-center">
          <Target size={40} className="mx-auto text-TextMuted mb-3" />
          <h3 className="text-base font-semibold font-PrimaryFont text-TextPrimary dark:text-white mb-1">No recommendations yet</h3>
          <p className="text-xs font-SecondaryFont text-TextSecondary">Update your profile with skills and apply to jobs to get personalized recommendations.</p>
        </div>
      )}

      {!loading && recommendations.length > 0 && (
        <>
          <p className="text-xs font-SecondaryFont text-TextSecondary">
            Showing {recommendations.length} matches from {totalJobs} available jobs
          </p>
          <div className="space-y-3">
            {recommendations.map((rec) => (
              <Link
                key={rec.jobId}
                href={`/jobs/${rec.jobId}`}
                className="block bg-white dark:bg-[#1e293b] rounded-2xl border border-Border dark:border-secondary/40 p-5 hover:shadow-md hover:border-PrimaryColor/30 dark:hover:border-PrimaryColor/20 transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold font-PrimaryFont text-TextPrimary dark:text-white group-hover:text-PrimaryColor transition-colors truncate">
                      {rec.jobId}
                    </h3>
                    <p className="text-xs font-SecondaryFont text-TextSecondary mt-1.5 leading-relaxed">
                      {rec.reason}
                    </p>
                  </div>
                  <div className={`shrink-0 flex items-center gap-1.5 rounded-xl px-3 py-1.5 ${scoreBg(rec.matchScore)}`}>
                    <span className={`text-sm font-bold font-SecondaryFont ${scoreColor(rec.matchScore)}`}>
                      {rec.matchScore}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-3 text-xs font-SecondaryFont text-TextMuted">
                  <span className="flex items-center gap-1">
                    <Briefcase size={12} /> Match
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
