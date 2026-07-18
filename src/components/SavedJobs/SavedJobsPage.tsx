"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, ArrowRight, Sparkles } from "lucide-react";
import JobCard from "@/components/shared/JobCard";
import JobCardSkeleton from "@/components/AllJobs/JobCardSkeleton";
import { getSavedJobs, type SavedJob } from "@/lib/api/public/savedJobsApi";
import { getJobById, type Job } from "@/lib/api/public/jobsApi";

const SavedJobsPage = () => {
  const [savedJobs, setSavedJobs] = useState<(SavedJob & { job: Job | null })[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const items = await getSavedJobs();
        const jobs = await Promise.all(
          items.map(async (item) => {
            const job = await getJobById(item.jobId);
            return { ...item, job };
          })
        );
        setSavedJobs(jobs.filter((j) => j.job !== null));
      } catch {
        setSavedJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSaved();
  }, []);

  return (
    <div className="min-h-screen bg-Background dark:bg-[#0f172a]">
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-PrimaryColorLight dark:bg-PrimaryColorDark/20 px-4 py-2 mb-4">
              <Bookmark className="size-4 text-PrimaryColor" />
              <span className="text-sm font-medium font-SecondaryFont text-PrimaryColor">
                Your Collection
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold font-PrimaryFont text-TextPrimary dark:text-white">
              Saved{" "}
              <span className="bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor bg-clip-text text-transparent">
                Jobs
              </span>
            </h1>
            <p className="mt-3 text-lg font-SecondaryFont text-TextSecondary dark:text-text-secondary max-w-2xl mx-auto">
              Jobs you&apos;ve saved for later — apply when you&apos;re ready.
            </p>
          </div>

          <div className="mt-8">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <JobCardSkeleton key={i} />
                ))}
              </div>
            ) : savedJobs.length === 0 ? (
              <div className="text-center py-20">
                <div className="size-16 rounded-full bg-BorderLight dark:bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                  <Bookmark className="size-8 text-TextMuted" />
                </div>
                <h3 className="text-lg font-semibold font-PrimaryFont text-TextPrimary dark:text-white">
                  No saved jobs yet
                </h3>
                <p className="mt-2 text-sm font-SecondaryFont text-TextMuted max-w-sm mx-auto">
                  Browse jobs and tap the heart icon to save them here for
                  later.
                </p>
                <Link
                  href="/jobs"
                  className="inline-flex items-center gap-2 mt-6 px-6 py-2.5 rounded-xl bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor text-white font-SecondaryFont font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <Sparkles className="size-4" />
                  Browse Jobs
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedJobs.map((item) => (
                    <JobCard key={item._id} job={item.job!} />
                  ))}
                </div>

                <div className="mt-10 text-center">
                  <Link
                    href="/jobs"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-SrcPrimaryColor text-SrcPrimaryColor hover:bg-SrcPrimaryColorLight font-SecondaryFont font-semibold text-sm transition-colors cursor-pointer"
                  >
                    Find More Jobs
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SavedJobsPage;
