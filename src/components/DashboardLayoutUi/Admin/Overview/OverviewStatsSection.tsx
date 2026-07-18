import { getAdminOverview } from "@/lib/api/admin/adminAnalyticsApi";
import getUserSession from "@/lib/getUserSession";
import { Users, Briefcase, FileText, ShieldCheck } from "lucide-react";
import StatCard from "./StatCard";

const OverviewStatsSection = async () => {
  const overview = await getAdminOverview();
  const user = await getUserSession();

  const stats = [
    {
      label: "Total Users",
      value: overview?.totalUsers ?? 0,
      icon: Users,
      gradient: "from-PrimaryColor to-PrimaryColorDark",
      bgLight: "bg-PrimaryColorLight dark:bg-PrimaryColorDark/20",
    },
    {
      label: "Total Jobs",
      value: overview?.totalJobs ?? 0,
      icon: Briefcase,
      gradient: "from-SrcPrimaryColor to-SrcPrimaryColorDark",
      bgLight: "bg-SrcPrimaryColorLight dark:bg-SrcPrimaryColorDark/20",
    },
    {
      label: "Total Applications",
      value: overview?.totalApplications ?? 0,
      icon: FileText,
      gradient: "from-PrimaryColor to-SrcPrimaryColor",
      bgLight:
        "bg-gradient-to-r from-PrimaryColorLight to-SrcPrimaryColorLight dark:from-PrimaryColorDark/20 dark:to-SrcPrimaryColorDark/20",
    },
    {
      label: "Active Recruiters",
      value: overview?.totalRecruiters ?? 0,
      icon: ShieldCheck,
      gradient: "from-SrcPrimaryColor to-PrimaryColor",
      bgLight: "bg-SrcPrimaryColorLight dark:bg-SrcPrimaryColorDark/20",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-PrimaryFont text-TextPrimary dark:text-surface">
            Welcome back, {user?.name || "Admin"}
          </h2>
          <p className="text-sm font-SecondaryFont text-TextMuted mt-1">
            Here&apos;s what&apos;s happening with your platform today.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-PrimaryColorLight to-SrcPrimaryColorLight dark:from-PrimaryColorDark/20 dark:to-SrcPrimaryColorDark/20">
          <ShieldCheck size={16} className="text-SrcPrimaryColor" />
          <span className="text-xs font-SecondaryFont font-medium text-TextSecondary dark:text-surface/80">
            Admin Panel
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
    </div>
  );
};

export default OverviewStatsSection;
