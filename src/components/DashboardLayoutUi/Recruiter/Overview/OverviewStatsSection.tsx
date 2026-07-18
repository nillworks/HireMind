import { getRecruiterOverview } from "@/lib/api/recruiter/recruiterAnalyticsApi";
import getUserSession from "@/lib/getUserSession";
import { Briefcase, Users, TrendingUp } from "lucide-react";
import StatCard from "./StatCard";

const OverviewStatsSection = async () => {
  const overview = await getRecruiterOverview();
  const user = await getUserSession();

  const stats = [
    {
      label: "Total Jobs Posted",
      value: overview?.totalJobs ?? 0,
      icon: Briefcase,
      gradient: "from-PrimaryColor to-PrimaryColorDark",
      bgLight: "bg-PrimaryColorLight",
    },
    {
      label: "Total Applications",
      value: overview?.totalApplications ?? 0,
      icon: Users,
      gradient: "from-SrcPrimaryColor to-SrcPrimaryColorDark",
      bgLight: "bg-SrcPrimaryColorLight",
    },
    {
      label: "Active Listings",
      value: overview?.totalJobs ?? 0,
      icon: TrendingUp,
      gradient: "from-PrimaryColor to-SrcPrimaryColor",
      bgLight:
        "bg-gradient-to-r from-PrimaryColorLight to-SrcPrimaryColorLight",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-PrimaryFont text-TextPrimary dark:text-surface">
            Welcome back, {user?.name || "Recruiter"}
          </h2>
          <p className="text-sm font-SecondaryFont text-TextMuted mt-1">
            Here&apos;s what&apos;s happening with your job listings today.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-PrimaryColorLight to-SrcPrimaryColorLight dark:from-PrimaryColorDark/20 dark:to-SrcPrimaryColorDark/20">
          <div className="flex -space-x-2">
            {["/avatar1", "/avatar2", "/avatar3"].map((_, i) => (
              <div
                key={i}
                className="size-7 rounded-full border-2 border-white dark:border-dark-bg bg-gradient-to-br from-PrimaryColor/30 to-SrcPrimaryColor/30"
              />
            ))}
          </div>
          <span className="text-xs font-SecondaryFont font-medium text-TextSecondary dark:text-text-secondary">
            +{overview?.totalApplications ?? 0} applicants
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
    </div>
  );
};

export default OverviewStatsSection;
