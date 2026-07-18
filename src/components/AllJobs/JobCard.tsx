import { type Job } from "@/lib/api/public/jobsApi";

interface JobCardProps {
  job: Job;
}

const JobCard = ({ job }: JobCardProps) => {
  const daysLeft = Math.ceil(
    (new Date(job.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <a
      href={`/jobs/${job._id}`}
      className="group relative flex flex-col rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-PrimaryColor/5 hover:-translate-y-1"
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor" />

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative size-12 rounded-xl overflow-hidden bg-BorderLight dark:bg-secondary/20 shrink-0">
              {job.companyLogo ? (
                <img
                  src={job.companyLogo}
                  alt={job.companyName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-lg font-bold font-PrimaryFont text-PrimaryColor">
                  {job.companyName?.charAt(0)}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-semibold font-PrimaryFont text-TextPrimary dark:text-surface truncate group-hover:text-PrimaryColor transition-colors">
                {job.title}
              </h3>
              <p className="text-sm font-SecondaryFont text-TextMuted truncate">
                {job.companyName}
              </p>
            </div>
          </div>
        </div>

        <p className="text-sm font-SecondaryFont text-TextSecondary dark:text-text-secondary line-clamp-2 mb-4">
          {job.shortDescription}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center gap-1 rounded-full bg-PrimaryColorLight dark:bg-PrimaryColorDark/20 px-2.5 py-1 text-xs font-medium font-SecondaryFont text-PrimaryColor">
            {job.jobType}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-SrcPrimaryColorLight dark:bg-SrcPrimaryColorDark/20 px-2.5 py-1 text-xs font-medium font-SecondaryFont text-SrcPrimaryColor">
            {job.category}
          </span>
        </div>

        <div className="mt-auto space-y-2">
          <div className="flex items-center justify-between text-xs font-SecondaryFont text-TextMuted">
            <span>{job.location}</span>
            <span>
              ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs font-SecondaryFont text-TextMuted">
            <span>{job.applicationCount} applicants</span>
            <span className={daysLeft <= 7 ? "text-PrimaryColor font-medium" : ""}>
              {daysLeft > 0 ? `${daysLeft} days left` : "Expired"}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-Border dark:border-secondary">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-full overflow-hidden bg-BorderLight dark:bg-secondary/20">
                {job.recruiterImage ? (
                  <img
                    src={job.recruiterImage}
                    alt={job.recruiterName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-[10px] font-bold text-SrcPrimaryColor">
                    {job.recruiterName?.charAt(0)}
                  </div>
                )}
              </div>
              <span className="text-xs font-SecondaryFont text-TextMuted truncate max-w-[100px]">
                {job.recruiterName}
              </span>
            </div>
            <span className="text-xs font-semibold font-SecondaryFont text-PrimaryColor group-hover:text-SrcPrimaryColor transition-colors">
              View Details →
            </span>
          </div>
        </div>
      </div>
    </a>
  );
};

export default JobCard;
