import { redirect } from "next/navigation";
import getUserSession from "@/lib/getUserSession";

export const dynamic = "force-dynamic";

const DashboardIndexPage = async () => {
  const user = await getUserSession();

  if (!user) {
    redirect("/login");
  }

  const role = (user.role as string) || "seeker";
  redirect(`/dashboard/${role}`);
};

export default DashboardIndexPage;
