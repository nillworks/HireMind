"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import JobCard from "@/components/shared/JobCard";
import { type Job } from "@/lib/api/public/jobsApi";

const FeaturedJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/featured?limit=6`
        );
        const data = await res.json();
        setJobs(data.data ?? []);
      } catch {
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <section className="py-10 bg-Background dark:bg-[#0f172a]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full bg-PrimaryColorLight dark:bg-PrimaryColorDark/20 px-4 py-2 mb-4"
          >
            <Sparkles className="size-4 text-PrimaryColor" />
            <span className="text-sm font-medium font-SecondaryFont text-PrimaryColor">
              Top Opportunities
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold font-PrimaryFont text-TextPrimary dark:text-white tracking-tight"
          >
            Featured{" "}
            <span className="bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor bg-clip-text text-transparent">
              Jobs
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-3 font-SecondaryFont text-TextSecondary dark:text-text-secondary max-w-lg mx-auto"
          >
            Top opportunities handpicked for you based on popularity and demand
          </motion.p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary overflow-hidden"
              >
                <div className="h-1 bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="size-12 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse shrink-0" />
                    <div className="space-y-2 flex-1">
                      <div className="h-5 w-3/4 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
                      <div className="h-4 w-1/2 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-6 w-16 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    <div className="h-6 w-20 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-16">
            <div className="size-16 rounded-full bg-BorderLight dark:bg-secondary/20 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="size-8 text-TextMuted" />
            </div>
            <h3 className="text-lg font-semibold font-PrimaryFont text-TextPrimary dark:text-white">
              No featured jobs yet
            </h3>
            <p className="mt-2 text-sm font-SecondaryFont text-TextMuted max-w-sm mx-auto">
              Check back soon for top opportunities from leading companies.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job, index) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <JobCard job={job} />
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link href="/jobs">
            <Button
              variant="outline"
              className="px-6 py-2.5 rounded-xl border-SrcPrimaryColor text-SrcPrimaryColor hover:bg-SrcPrimaryColorLight font-SecondaryFont font-semibold cursor-pointer"
            >
              <span className="flex items-center gap-2">
                Browse All Jobs
                <ArrowRight size={16} />
              </span>
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedJobs;
