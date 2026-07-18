"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  DollarSign,
  Users,
  Calendar,
  Eye,
  Pencil,
  Trash2,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RecruiterJob } from "@/lib/api/recruiter/recruiterJobsApi";
import DeleteJobDialog from "./DeleteJobDialog";
import {
  statusConfig,
  jobTypeConfig,
  formatJobType,
  formatSalary,
  formatDate,
} from "./job-helpers";

interface JobCardProps {
  job: RecruiterJob;
  onDeleted: () => void;
}

const JobCard = ({ job, onDeleted }: JobCardProps) => {
  const [deleteOpen, setDeleteOpen] = useState(false);

  const hasValidLogo =
    job.companyLogo &&
    (job.companyLogo.startsWith("http://") ||
      job.companyLogo.startsWith("https://"));

  const status = statusConfig[job.status] ?? statusConfig.pending;
  const jobType =
    jobTypeConfig[job.jobType] ??
    "bg-Border text-TextSecondary dark:bg-secondary dark:text-text-secondary";

  return (
    <>
      <div className="group relative rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 min-w-0">
            {hasValidLogo ? (
              <div className="relative size-10 shrink-0 rounded-xl overflow-hidden border border-Border dark:border-secondary">
                <Image
                  src={job.companyLogo}
                  alt={job.companyName}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
            ) : (
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-PrimaryColorLight to-SrcPrimaryColorLight dark:from-PrimaryColorDark/20 dark:to-SrcPrimaryColorDark/20">
                <Briefcase size={18} className="text-PrimaryColor" />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="text-sm font-semibold font-PrimaryFont text-TextPrimary dark:text-surface truncate">
                {job.title}
              </h3>
              <p className="text-xs font-SecondaryFont text-TextMuted truncate">
                {job.companyName}
              </p>
            </div>
          </div>
          <span
            className={`shrink-0 inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium font-SecondaryFont ${status.className}`}
          >
            {status.label}
          </span>
        </div>

        <div className="space-y-2.5 mb-4">
          <div className="flex items-center gap-4 text-xs font-SecondaryFont text-TextSecondary dark:text-text-secondary">
            <span
              className={`inline-flex items-center rounded-lg px-2 py-0.5 text-[11px] font-medium ${jobType}`}
            >
              {formatJobType(job.jobType)}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin size={12} className="text-TextMuted" />
              {job.location || "N/A"}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs font-SecondaryFont text-TextSecondary dark:text-text-secondary">
            <DollarSign size={12} className="text-SrcPrimaryColor shrink-0" />
            <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
          </div>

          <div className="flex items-center gap-1 text-xs font-SecondaryFont text-TextMuted">
            <Users size={12} className="shrink-0" />
            <span>
              {job.applicationCount ?? 0} application
              {(job.applicationCount ?? 0) !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-SecondaryFont text-TextMuted">
            <span className="inline-flex items-center gap-1">
              <Calendar size={12} className="shrink-0" />
              Posted {formatDate(job.createdAt)}
            </span>
            <span className="inline-flex items-center gap-1">
              Deadline {formatDate(job.deadline)}
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-Border dark:border-secondary flex items-center gap-2">
          <Link
            href={`/dashboard/recruiter/my-jobs/${job._id}`}
            className="flex-1 cursor-pointer"
          >
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full h-8 rounded-lg font-SecondaryFont text-xs border-Border dark:border-secondary text-TextSecondary dark:text-text-secondary hover:bg-PrimaryColorLight dark:hover:bg-PrimaryColorDark/20 hover:text-PrimaryColor hover:border-PrimaryColor/30 transition-colors cursor-pointer"
            >
              <Eye size={14} />
              View
            </Button>
          </Link>
          <Link
            href={`/dashboard/recruiter/my-jobs/${job._id}/edit`}
            className="flex-1 cursor-pointer"
          >
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full h-8 rounded-lg font-SecondaryFont text-xs border-Border dark:border-secondary text-TextSecondary dark:text-text-secondary hover:bg-SrcPrimaryColorLight dark:hover:bg-SrcPrimaryColorDark/20 hover:text-SrcPrimaryColor hover:border-SrcPrimaryColor/30 transition-colors cursor-pointer"
            >
              <Pencil size={14} />
              Edit
            </Button>
          </Link>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setDeleteOpen(true)}
            className="h-8 w-8 shrink-0 rounded-lg border-Border dark:border-secondary text-TextMuted hover:bg-PrimaryColorLight dark:hover:bg-PrimaryColorDark/20 hover:text-PrimaryColor hover:border-PrimaryColor/30 transition-colors p-0 cursor-pointer"
          >
            <Trash2 size={14} />
          </Button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
      </div>

      <DeleteJobDialog
        jobId={job._id}
        jobTitle={job.title}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onDeleted={onDeleted}
      />
    </>
  );
};

export default JobCard;
