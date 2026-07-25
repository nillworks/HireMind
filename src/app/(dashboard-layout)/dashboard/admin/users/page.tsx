import type { Metadata } from "next";
import ManageUsersPage from "@/components/DashboardLayoutUi/Admin/ManageUsers/ManageUsersPage";

export const metadata: Metadata = {
  title: "Manage Users | HireMind",
  description: "Admin panel to manage all platform users.",
};

const ManageUsersRoute = () => {
  return <ManageUsersPage />;
};

export default ManageUsersRoute;
