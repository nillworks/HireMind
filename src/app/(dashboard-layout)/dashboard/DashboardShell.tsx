"use client";

import { useEffect, useState } from "react";
import DashboardSidebar from "@/components/shared/DashboardSidebar";
import DashboardTopBar from "@/components/shared/DashboardTopBar";
import { cn } from "@/lib/utils";

interface User {
  name?: string;
  email?: string;
  image?: string;
  role?: string;
}

export default function DashboardShell({
  user,
  children,
}: {
  user: User | null;
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("dashboardSidebarCollapsed");
    if (saved) setSidebarCollapsed(saved === "true");
  }, []);

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);

  return (
    <div className="flex h-screen bg-Background dark:bg-dark-bg">
      <DashboardSidebar user={user} collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      <div
        className={cn(
          "flex flex-1 flex-col transition-all duration-300 ease-out",
          sidebarCollapsed ? "ml-[72px]" : "ml-[260px]"
        )}
      >
        <DashboardTopBar
          user={user}
          onToggleSidebar={toggleSidebar}
          sidebarCollapsed={sidebarCollapsed}
        />
        <main className="flex-1 overflow-y-auto px-4 lg:px-6 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
