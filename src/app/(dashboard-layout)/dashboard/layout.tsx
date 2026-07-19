import { Suspense } from "react";
import getUserSession from "@/lib/getUserSession";
import DashboardShell from "./DashboardShell";

export const dynamic = "force-dynamic";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getUserSession();

  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-Background dark:bg-dark-bg"><div className="h-8 w-8 animate-spin rounded-full border-2 border-PrimaryColor border-t-transparent"/></div>}>
      <DashboardShell user={user || null}>
        {children}
      </DashboardShell>
    </Suspense>
  );
};

export default DashboardLayout;
