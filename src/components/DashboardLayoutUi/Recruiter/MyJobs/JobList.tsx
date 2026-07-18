"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Search,
  SlidersHorizontal,
  Briefcase,
  FolderOpen,
  LayoutGrid,
  List,
  ArrowUpDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { RecruiterJob } from "@/lib/api/recruiter/recruiterJobsApi";
import JobCard from "./JobCard";

interface JobListProps {
  initialJobs: RecruiterJob[];
}

const statusOptions = ["all", "pending", "approved", "rejected"] as const;

const jobTypeOptions = [
  "all",
  "full-time",
  "part-time",
  "remote",
  "contract",
] as const;

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "salary_high", label: "Salary High to Low" },
  { value: "salary_low", label: "Salary Low to High" },
  { value: "most_applied", label: "Most Applied" },
] as const;

const JobList = ({ initialJobs }: JobListProps) => {
  const [jobs, setJobs] = useState<RecruiterJob[]>(initialJobs);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [jobTypeFilter, setJobTypeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [showFilters, setShowFilters] = useState(false);

  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.companyName.toLowerCase().includes(query) ||
          job.location.toLowerCase().includes(query) ||
          job.category.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((job) => job.status === statusFilter);
    }

    if (jobTypeFilter !== "all") {
      result = result.filter((job) => job.jobType === jobTypeFilter);
    }

    switch (sortBy) {
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() -
            new Date(b.createdAt).getTime()
        );
        break;
      case "salary_high":
        result.sort((a, b) => (b.salaryMax ?? 0) - (a.salaryMax ?? 0));
        break;
      case "salary_low":
        result.sort((a, b) => (a.salaryMin ?? 0) - (b.salaryMin ?? 0));
        break;
      case "most_applied":
        result.sort(
          (a, b) => (b.applicationCount ?? 0) - (a.applicationCount ?? 0)
        );
        break;
      default:
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );
    }

    return result;
  }, [jobs, searchQuery, statusFilter, jobTypeFilter, sortBy]);

  const handleDeleteFromList = useCallback((jobId: string) => {
    setJobs((prev) => prev.filter((job) => job._id !== jobId));
  }, []);

  const stats = useMemo(
    () => ({
      total: jobs.length,
      pending: jobs.filter((j) => j.status === "pending").length,
      approved: jobs.filter((j) => j.status === "approved").length,
      rejected: jobs.filter((j) => j.status === "rejected").length,
    }),
    [jobs]
  );

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Total Jobs",
            value: stats.total,
            icon: Briefcase,
            bg: "bg-gradient-to-br from-PrimaryColorLight to-SrcPrimaryColorLight dark:from-PrimaryColorDark/20 dark:to-SrcPrimaryColorDark/20",
          },
          {
            label: "Pending",
            value: stats.pending,
            icon: ArrowUpDown,
            bg: "bg-amber-50 dark:bg-amber-900/20",
          },
          {
            label: "Approved",
            value: stats.approved,
            icon: LayoutGrid,
            bg: "bg-emerald-50 dark:bg-emerald-900/20",
          },
          {
            label: "Rejected",
            value: stats.rejected,
            icon: List,
            bg: "bg-red-50 dark:bg-red-900/20",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`flex items-center gap-3 rounded-xl ${stat.bg} p-3 border border-Border/50 dark:border-secondary/50`}
          >
            <stat.icon
              size={16}
              className="text-TextSecondary dark:text-text-secondary shrink-0"
            />
            <div>
              <p className="text-[11px] font-SecondaryFont text-TextMuted uppercase tracking-wider">
                {stat.label}
              </p>
              <p className="text-lg font-bold font-PrimaryFont text-TextPrimary dark:text-surface">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-TextMuted"
          />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, company, location..."
            className="pl-9 h-10 bg-white dark:bg-[#1e293b] border-Border dark:border-secondary text-TextPrimary dark:text-surface font-SecondaryFont placeholder:text-TextMuted rounded-xl"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className={`h-10 px-4 rounded-xl font-SecondaryFont font-medium border-Border dark:border-secondary transition-colors ${
            showFilters
              ? "bg-SrcPrimaryColorLight text-SrcPrimaryColor border-SrcPrimaryColor/30 dark:bg-SrcPrimaryColorDark/20"
              : "text-TextSecondary dark:text-text-secondary hover:bg-Background dark:hover:bg-dark-bg"
          }`}
        >
          <SlidersHorizontal size={16} />
          Filters
        </Button>
      </div>

      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary">
          <div className="space-y-1.5">
            <label className="text-[11px] font-SecondaryFont font-medium text-TextMuted uppercase tracking-wider">
              Status
            </label>
            <div className="flex flex-wrap gap-1.5">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-SecondaryFont font-medium transition-colors ${
                    statusFilter === status
                      ? "bg-SrcPrimaryColor text-white"
                      : "bg-Background dark:bg-dark-bg text-TextSecondary dark:text-text-secondary hover:bg-Border dark:hover:bg-secondary border border-Border dark:border-secondary"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden sm:block w-px bg-Border dark:bg-secondary" />

          <div className="space-y-1.5">
            <label className="text-[11px] font-SecondaryFont font-medium text-TextMuted uppercase tracking-wider">
              Job Type
            </label>
            <div className="flex flex-wrap gap-1.5">
              {jobTypeOptions.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setJobTypeFilter(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-SecondaryFont font-medium transition-colors ${
                    jobTypeFilter === type
                      ? "bg-PrimaryColor text-white"
                      : "bg-Background dark:bg-dark-bg text-TextSecondary dark:text-text-secondary hover:bg-Border dark:hover:bg-secondary border border-Border dark:border-secondary"
                  }`}
                >
                  {type === "all"
                    ? "All Types"
                    : type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden sm:block w-px bg-Border dark:bg-secondary" />

          <div className="space-y-1.5">
            <label className="text-[11px] font-SecondaryFont font-medium text-TextMuted uppercase tracking-wider">
              Sort By
            </label>
            <div className="flex flex-wrap gap-1.5">
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSortBy(opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-SecondaryFont font-medium transition-colors ${
                    sortBy === opt.value
                      ? "bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor text-white"
                      : "bg-Background dark:bg-dark-bg text-TextSecondary dark:text-text-secondary hover:bg-Border dark:hover:bg-secondary border border-Border dark:border-secondary"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredJobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onDeleted={() => handleDeleteFromList(job._id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-PrimaryColorLight to-SrcPrimaryColorLight dark:from-PrimaryColorDark/20 dark:to-SrcPrimaryColorDark/20 mb-4">
            <FolderOpen
              size={28}
              className="text-PrimaryColor"
            />
          </div>
          <h3 className="text-base font-semibold font-PrimaryFont text-TextPrimary dark:text-surface">
            {jobs.length === 0
              ? "No jobs posted yet"
              : "No matching jobs found"}
          </h3>
          <p className="text-sm font-SecondaryFont text-TextMuted mt-1 text-center max-w-sm">
            {jobs.length === 0
              ? "Start by posting your first job to attract top talent."
              : "Try adjusting your search or filter criteria."}
          </p>
          {jobs.length > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setJobTypeFilter("all");
                setSortBy("newest");
              }}
              className="mt-4 h-9 px-4 rounded-xl font-SecondaryFont text-sm border-Border dark:border-secondary text-SrcPrimaryColor hover:bg-SrcPrimaryColorLight dark:hover:bg-SrcPrimaryColorDark/20"
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}

      {filteredJobs.length > 0 && (
        <div className="text-center">
          <p className="text-xs font-SecondaryFont text-TextMuted">
            Showing {filteredJobs.length} of {jobs.length} job
            {jobs.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
};

export default JobList;
