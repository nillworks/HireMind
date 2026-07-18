"use client";

import { useEffect, useState } from "react";
import DashboardSidebar from "@/components/shared/DashboardSidebar";
import DashboardTopBar from "@/components/shared/DashboardTopBar";
import { cn } from "@/lib/utils";
import fetchClient from "@/lib/utils/fetchClient";

interface User {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
}

function calculateSeekerCompletion(profile: Record<string, unknown> | null, user: User): number {
  let filled = 0;
  let total = 10;

  if (user.name) filled++;
  if (user.email) filled++;
  if (user.image) filled++;
  if (profile?.phone) filled++;
  if (profile?.bio) filled++;
  if (profile?.location) filled++;
  if (profile?.resumeUrl) filled++;
  if (Array.isArray(profile?.skills) && (profile.skills as unknown[]).length > 0) filled++;
  if (Array.isArray(profile?.education) && (profile.education as unknown[]).length > 0) filled++;
  if (Array.isArray(profile?.experience) && (profile.experience as unknown[]).length > 0) filled++;

  return Math.round((filled / total) * 100);
}

function calculateRecruiterCompletion(profile: Record<string, unknown> | null, user: User): number {
  let filled = 0;
  let total = 9;

  if (user.name) filled++;
  if (user.email) filled++;
  if (user.image) filled++;
  if (profile?.companyName) filled++;
  if (profile?.companyLogo) filled++;
  if (profile?.companyDescription) filled++;
  if (profile?.companyLocation) filled++;
  if (profile?.industry) filled++;
  if (profile?.phone) filled++;

  return Math.round((filled / total) * 100);
}

function calculateAdminCompletion(user: User): number {
  let filled = 0;
  let total = 3;

  if (user.name) filled++;
  if (user.email) filled++;
  if (user.image) filled++;

  return Math.round((filled / total) * 100);
}

export default function DashboardShell({
  user,
  children,
}: {
  user: User | null;
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("dashboardSidebarCollapsed");
    if (saved) setSidebarCollapsed(saved === "true");
  }, []);

  useEffect(() => {
    if (!user) return;

    const role = (user.role as string)?.toLowerCase();

    if (role === "admin") {
      setProfileCompletion(calculateAdminCompletion(user));
      return;
    }

    const endpoint = role === "recruiter" ? "/api/recruiter-profile/profile" : "/api/seeker/profile";

    fetchClient<{ data?: Record<string, unknown> | null }>(endpoint)
      .then((json) => {
        const profile = json?.data ?? null;
        if (role === "recruiter") {
          setProfileCompletion(calculateRecruiterCompletion(profile, user));
        } else {
          setProfileCompletion(calculateSeekerCompletion(profile, user));
        }
      })
      .catch(() => {
        setProfileCompletion(role === "admin" ? calculateAdminCompletion(user) : 30);
      });
  }, [user]);

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);

  return (
    <div className="flex h-screen bg-Background dark:bg-dark-bg">
      <DashboardSidebar user={user} collapsed={sidebarCollapsed} onToggle={toggleSidebar} profileCompletion={profileCompletion} />
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
