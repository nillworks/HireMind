import type { Metadata } from "next";
import AdminProfileForm from "@/components/DashboardLayoutUi/Admin/Profile/AdminProfileForm";

export const metadata: Metadata = {
  title: "My Profile | HireMind",
  description: "Update your admin profile name and picture.",
};

const AdminProfileRoute = () => {
  return (
    <div className="container mx-auto space-y-6">
      <h1 className="text-2xl font-bold font-PrimaryFont text-TextPrimary dark:text-surface">
        My Profile
      </h1>
      <p className="text-sm font-SecondaryFont text-TextMuted">
        Manage your admin profile information.
      </p>
      <AdminProfileForm />
    </div>
  );
};

export default AdminProfileRoute;
