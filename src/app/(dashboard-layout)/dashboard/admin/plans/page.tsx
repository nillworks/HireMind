import type { Metadata } from "next";
import PlansManagementPage from "@/components/DashboardLayoutUi/Admin/Plans/PlansManagementPage";

export const metadata: Metadata = {
  title: "Manage Plans | HireMind",
  description: "Admin panel to manage subscription plans and pricing.",
};

const ManagePlansRoute = () => {
  return <PlansManagementPage />;
};

export default ManagePlansRoute;
