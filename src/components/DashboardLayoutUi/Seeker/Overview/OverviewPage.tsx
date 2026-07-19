"use client";

import { useEffect, useState } from "react";
import {
  Briefcase,
  Bookmark,
  TrendingUp,
  Clock,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import {
  getSeekerProfileClient,
  getMyApplicationsClient,
  getSavedJobsClient,
  calculateProfileCompletion,
  type ProfileData,
  type ApplicationData,
} from "@/lib/api/seeker/overviewApi";
import StatCard from "./StatCard";
import ProfileCompletionCard from "./ProfileCompletionCard";
import RecentApplications from "./RecentApplications";
import QuickActionsCard from "./QuickActionsCard";
import OverviewSkeleton from "./OverviewSkeleton";


const OverviewPage = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [savedJobsCount, setSavedJobsCount] = useState(0);
  const [completionPercent, setCompletionPercent] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [profileData, appsData, savedData] = await Promise.all([
          getSeekerProfileClient(),
          getMyApplicationsClient(),
          getSavedJobsClient(),
        ]);
        setProfile(profileData);
        setApplications(appsData);
        setSavedJobsCount(savedData.length);
        setCompletionPercent(calculateProfileCompletion(profileData));
      } catch {
        // keep defaults
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const userName = session?.user?.name || "Seeker";
  const userImage = session?.user?.image || undefined;

  const pendingCount = applications.filter((a) => a.status === "pending").length;

  if (loading) {
    return <OverviewSkeleton />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-PrimaryFont text-TextPrimary dark:text-white">
          Welcome back, <span className="text-PrimaryColor">{userName.split(" ")[0]}</span>
        </h1>
        <p className="text-sm font-SecondaryFont text-TextSecondary dark:text-text-secondary mt-1">
          Here&apos;s an overview of your job search progress
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Total Applications"
          value={applications.length}
          icon={Briefcase}
          gradient="from-PrimaryColor to-PrimaryColorDark"
          bgLight="bg-PrimaryColorLight dark:bg-PrimaryColorDark/20"
        />
        <StatCard
          label="Saved Jobs"
          value={savedJobsCount}
          icon={Bookmark}
          gradient="from-SrcPrimaryColor to-SrcPrimaryColorDark"
          bgLight="bg-SrcPrimaryColorLight dark:bg-SrcPrimaryColorDark/20"
        />
        <StatCard
          label="Pending Review"
          value={pendingCount}
          icon={Clock}
          gradient="from-amber-400 to-amber-600"
          bgLight="bg-amber-100 dark:bg-amber-900/20"
        />
        <StatCard
          label="Profile Score"
          value={completionPercent}
          icon={TrendingUp}
          gradient="from-emerald-400 to-emerald-600"
          bgLight="bg-emerald-100 dark:bg-emerald-900/20"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <QuickActionsCard />
        </div>
        <div className="space-y-5">
          <ProfileCompletionCard
            profile={profile}
            completionPercent={completionPercent}
            userName={userName}
            userImage={userImage}
          />
        </div>
      </div>

      <RecentApplications applications={applications} />
    </div>
  );
};

export default OverviewPage;
