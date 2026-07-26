import { getRecruiterOverview } from "@/lib/api/recruiter/recruiterAnalyticsApi";
import { getRecentApplicants } from "@/lib/api/recruiter/recentApplicantsApi";
import getUserSession from "@/lib/getUserSession";
import { Briefcase, Users, TrendingUp } from "lucide-react";
import StatCard from "./StatCard";

function AvatarCircle({ src, name }: { src?: string; name?: string }) {
  if (src) {
    return (
      <div className="size-7 rounded-full ring-2 ring-white dark:ring-[#0f172a] overflow-hidden">
        <img src={src} alt={name || ""} className="size-full object-cover" />
      </div>
    );
  }
  return (
    <div className="size-7 rounded-full ring-2 ring-white dark:ring-[#0f172a] bg-gradient-to-br from-PrimaryColor/30 to-SrcPrimaryColor/30 flex items-center justify-center">
      <span className="text-[10px] font-bold font-PrimaryFont text-TextPrimary dark:text-surface">
        {(name?.charAt(0) || "?").toUpperCase()}
      </span>
    </div>
  );
}

const OverviewStatsSection = async () => {
  const [overview, user, recentApplicants] = await Promise.all([
    getRecruiterOverview(),
    getUserSession(),
    getRecentApplicants(3),
  ]);

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

  const top3 = recentApplicants.slice(0, 3);

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
        {top3.length > 0 && (
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-PrimaryColorLight to-SrcPrimaryColorLight dark:from-PrimaryColorDark/20 dark:to-SrcPrimaryColorDark/20">
            <div className="flex -space-x-2">
              {top3.map((app) => (
                <AvatarCircle
                  key={app._id}
                  src={app.user?.image}
                  name={app.user?.name}
                />
              ))}
            </div>
            <span className="text-xs font-SecondaryFont font-medium text-TextSecondary dark:text-text-secondary">
              +{overview?.totalApplications ?? 0} applicants
            </span>
          </div>
        )}
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
