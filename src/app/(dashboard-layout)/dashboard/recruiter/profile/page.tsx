import type { Metadata } from "next";
import RecruiterProfilePageComponent from "@/components/DashboardLayoutUi/Recruiter/Profile/RecruiterProfilePage";

export const metadata: Metadata = {
  title: "Company Profile | HireMind",
  description: "Manage your company profile and branding.",
};

const RecruiterProfileRoute = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-PrimaryFont text-TextPrimary dark:text-surface">
        Company Profile
      </h1>
      <p className="text-sm font-SecondaryFont text-TextMuted">
        Update your company details to attract top talent.
      </p>
      <RecruiterProfilePageComponent />
    </div>
  );
};

export default RecruiterProfileRoute;
