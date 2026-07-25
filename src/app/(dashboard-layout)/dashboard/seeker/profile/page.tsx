import type { Metadata } from "next";
import SeekerProfilePageComponent from "@/components/DashboardLayoutUi/Seeker/Profile/SeekerProfilePage";

export const metadata: Metadata = {
  title: "My Profile | HireMind",
  description: "Manage your job seeker profile, skills, and experience.",
};

const SeekerProfileRoute = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-PrimaryFont text-TextPrimary dark:text-surface">
        My Profile
      </h1>
      <p className="text-sm font-SecondaryFont text-TextMuted">
        Keep your profile updated to get better job matches.
      </p>
      <SeekerProfilePageComponent />
    </div>
  );
};

export default SeekerProfileRoute;
