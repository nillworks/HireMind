"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Eye,
  Pencil,
  Trash2,
  Briefcase,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RecruiterJob } from "@/lib/api/recruiter/recruiterJobsApi";
import DeleteJobDialog from "./DeleteJobDialog";
import ApplicantsModal from "./ApplicantsModal";
import {
  statusConfig,
  jobTypeConfig,
  formatJobType,
  formatSalary,
  formatDate,
} from "./job-helpers";

interface JobTableRowProps {
  job: RecruiterJob;
  onDeleted: () => void;
}

const JobTableRow = ({ job, onDeleted }: JobTableRowProps) => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [applicantsOpen, setApplicantsOpen] = useState(false);

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
      <tr className="group border-b border-Border dark:border-secondary last:border-b-0 hover:bg-Background/50 dark:hover:bg-dark-bg/50 transition-colors">
        <td className="py-3.5 px-4">
          <div className="flex items-center gap-3 min-w-0">
            {hasValidLogo ? (
              <div className="relative size-9 shrink-0 rounded-lg overflow-hidden border border-Border dark:border-secondary">
                <Image
                  src={job.companyLogo}
                  alt={job.companyName}
                  fill
                  className="object-cover"
                  sizes="36px"
                />
              </div>
            ) : (
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-PrimaryColorLight to-SrcPrimaryColorLight dark:from-PrimaryColorDark/20 dark:to-SrcPrimaryColorDark/20">
                <Briefcase size={16} className="text-PrimaryColor" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold font-PrimaryFont text-TextPrimary dark:text-surface truncate">
                {job.title}
              </p>
              <p className="text-xs font-SecondaryFont text-TextMuted truncate">
                {job.companyName}
              </p>
            </div>
          </div>
        </td>

        <td className="py-3.5 px-4 hidden md:table-cell">
          <span
            className={`inline-flex items-center rounded-lg px-2 py-0.5 text-[11px] font-medium font-SecondaryFont ${jobType}`}
          >
            {formatJobType(job.jobType)}
          </span>
        </td>

        <td className="py-3.5 px-4 hidden lg:table-cell">
          <p className="text-sm font-SecondaryFont text-TextSecondary dark:text-text-secondary truncate max-w-[140px]">
            {job.location || "N/A"}
          </p>
        </td>

        <td className="py-3.5 px-4 hidden xl:table-cell">
          <p className="text-sm font-SecondaryFont text-TextSecondary dark:text-text-secondary whitespace-nowrap">
            {formatSalary(job.salaryMin, job.salaryMax)}
          </p>
        </td>

        <td className="py-3.5 px-4 hidden lg:table-cell text-center">
          <span className="inline-flex items-center gap-1 text-sm font-SecondaryFont text-TextSecondary dark:text-text-secondary">
            {job.applicationCount ?? 0}
          </span>
        </td>

        <td className="py-3.5 px-4">
          <span
            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium font-SecondaryFont ${status.className}`}
          >
            {status.label}
          </span>
        </td>

        <td className="py-3.5 px-4 hidden xl:table-cell">
          <p className="text-sm font-SecondaryFont text-TextMuted whitespace-nowrap">
            {formatDate(job.createdAt)}
          </p>
        </td>

        <td className="py-3.5 px-4">
          <div className="flex items-center gap-1.5">
            <Link href={`/jobs/${job._id}`} className="cursor-pointer">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 rounded-lg text-TextMuted hover:text-PrimaryColor hover:bg-PrimaryColorLight dark:hover:bg-PrimaryColorDark/20 p-0 transition-colors cursor-pointer"
                aria-label="View job"
              >
                <Eye size={15} />
              </Button>
            </Link>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setApplicantsOpen(true)}
              className="h-8 w-8 rounded-lg text-TextMuted hover:text-SrcPrimaryColor hover:bg-SrcPrimaryColorLight dark:hover:bg-SrcPrimaryColorDark/20 p-0 transition-colors cursor-pointer"
              aria-label="View applicants"
            >
              <UserCheck size={15} />
            </Button>
            <Link href={`/dashboard/recruiter/my-jobs/${job._id}/edit`} className="cursor-pointer">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 rounded-lg text-TextMuted hover:text-SrcPrimaryColor hover:bg-SrcPrimaryColorLight dark:hover:bg-SrcPrimaryColorDark/20 p-0 transition-colors cursor-pointer"
                aria-label="Edit job"
              >
                <Pencil size={15} />
              </Button>
            </Link>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setDeleteOpen(true)}
              className="h-8 w-8 rounded-lg text-TextMuted hover:text-PrimaryColor hover:bg-PrimaryColorLight dark:hover:bg-PrimaryColorDark/20 p-0 transition-colors cursor-pointer"
              aria-label="Delete job"
            >
              <Trash2 size={15} />
            </Button>
          </div>
        </td>
      </tr>

      <DeleteJobDialog
        jobId={job._id}
        jobTitle={job.title}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onDeleted={onDeleted}
      />

      <ApplicantsModal
        jobId={job._id}
        jobTitle={job.title}
        open={applicantsOpen}
        onOpenChange={setApplicantsOpen}
      />
    </>
  );
};

export default JobTableRow;
