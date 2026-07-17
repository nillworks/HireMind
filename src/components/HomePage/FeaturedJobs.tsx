"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Clock, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Job {
  _id: string;
  title: string;
  companyName: string;
  companyLogo?: string;
  location: string;
  jobType: string;
  salaryMin: number;
  salaryMax: number;
  applicationCount: number;
  createdAt: string;
}

const FeaturedJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/jobs?limit=6&sort=most_applied`
        );
        const data = await res.json();
        setJobs(data.data?.jobs || []);
      } catch {
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <section className="py-20 bg-Surface">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold font-PrimaryFont text-TextPrimary tracking-tight"
          >
            Featured <span className="text-PrimaryColor">Jobs</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-3 font-SecondaryFont text-TextSecondary max-w-lg mx-auto"
          >
            Top opportunities handpicked for you based on popularity and demand
          </motion.p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border border-Border bg-Background animate-pulse"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-Border" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-Border rounded w-3/4" />
                    <div className="h-3 bg-Border rounded w-1/2" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-Border rounded w-full" />
                  <div className="h-3 bg-Border rounded w-2/3" />
                </div>
              </div>
            ))}
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
                className="group p-6 rounded-2xl border border-Border bg-Background hover:border-PrimaryColor/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {job.companyLogo ? (
                      <img
                        src={job.companyLogo}
                        alt={job.companyName}
                        className="w-12 h-12 rounded-xl object-cover border border-Border"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-PrimaryColor to-SrcPrimaryColor flex items-center justify-center text-white font-bold font-PrimaryFont text-lg">
                        {job.companyName?.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold font-PrimaryFont text-TextPrimary group-hover:text-PrimaryColor transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-sm font-SecondaryFont text-TextSecondary">
                        {job.companyName}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-SrcPrimaryColorLight text-SrcPrimaryColor text-xs font-semibold font-SecondaryFont">
                    {job.jobType}
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-PrimaryColorLight text-PrimaryColor text-xs font-semibold font-SecondaryFont">
                    ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs font-SecondaryFont text-TextMuted mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={14} />
                    {job.applicationCount} applicants
                  </span>
                </div>

                <Link
                  href={`/jobs/${job._id}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold font-SecondaryFont text-SrcPrimaryColor hover:text-SrcPrimaryColorHover transition-colors"
                >
                  View Details
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
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
