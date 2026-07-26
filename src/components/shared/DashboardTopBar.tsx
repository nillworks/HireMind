"use client";

import { usePathname } from "next/navigation";
import {
  Bell,
  Search,
  Moon,
  Sun,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import DashboardSearch from "./DashboardSearch";

interface User {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
  plan?: string | null;
}

interface DashboardTopBarProps {
  user: User | null;
  onToggleSidebar?: () => void;
  mobileSidebarOpen?: boolean;
}

const pageTitles: Record<string, string> = {
  "/dashboard/seeker": "Overview",
  "/dashboard/seeker/applications": "My Applications",
  "/dashboard/seeker/saved-jobs": "Saved Jobs",
  "/dashboard/seeker/apply-recruiter": "Apply as Recruiter",
  "/dashboard/seeker/ai-tools": "Cover Letter Generator",
  "/dashboard/seeker/recommendations": "Job Recommendations",
  "/dashboard/seeker/resume-analyzer": "Resume Analyzer",
  "/dashboard/recruiter": "Overview",
  "/dashboard/recruiter/post-job": "Post a Job",
  "/dashboard/recruiter/my-jobs": "My Jobs",
  "/dashboard/recruiter/analytics": "Analytics",
  "/dashboard/recruiter/resume-classifier": "Resume Classifier",
  "/dashboard/admin": "Admin Overview",
  "/dashboard/admin/users": "Manage Users",
  "/dashboard/admin/jobs": "Manage Jobs",
  "/dashboard/admin/recruiters": "Recruiter Applications",
  "/dashboard/admin/posts": "Blog Posts",
  "/dashboard/admin/posts/add": "Add Blog Post",
  "/dashboard/admin/content": "Website Content",
};

export default function DashboardTopBar({
  user,
  onToggleSidebar,
  mobileSidebarOpen,
}: DashboardTopBarProps) {
  const pathname = usePathname();
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node))
        setShowNotifications(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const pageTitle = pageTitles[pathname] || "Dashboard";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-Border dark:border-secondary/40 bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-xl px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="flex size-9 items-center justify-center rounded-xl text-TextSecondary dark:text-text-secondary hover:bg-BorderLight dark:hover:bg-secondary/20 transition-colors duration-200 cursor-pointer"
          aria-label="Toggle sidebar"
        >
          {mobileSidebarOpen ? (
            <X size={18} className="lg:hidden" />
          ) : (
            <Menu size={18} className="lg:hidden" />
          )}
        </button>

        <div>
          <h1 className="text-lg font-bold font-PrimaryFont text-TextPrimary dark:text-surface">
            {pageTitle}
          </h1>
          <p className="text-xs font-SecondaryFont text-TextMuted hidden sm:block">
            Welcome back, {user?.name || "User"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="flex size-9 items-center justify-center rounded-xl text-TextSecondary dark:text-text-secondary hover:bg-BorderLight dark:hover:bg-secondary/20 transition-colors duration-200 cursor-pointer"
            aria-label="Search"
          >
            <Search size={18} />
          </button>
          <AnimatePresence>
            {showSearch && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute right-0 top-full mt-2 w-72"
              >
                <DashboardSearch
                  userRole={user?.role || 'seeker'}
                  onNavigate={() => setShowSearch(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={toggleDarkMode}
          className="flex size-9 items-center justify-center rounded-xl text-TextSecondary dark:text-text-secondary hover:bg-BorderLight dark:hover:bg-secondary/20 transition-colors duration-200 cursor-pointer"
          aria-label="Toggle dark mode"
        >
          <AnimatePresence mode="wait">
            {darkMode ? (
              <motion.span key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <Sun size={18} />
              </motion.span>
            ) : (
              <motion.span key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <Moon size={18} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex size-9 items-center justify-center rounded-xl text-TextSecondary dark:text-text-secondary hover:bg-BorderLight dark:hover:bg-secondary/20 transition-colors duration-200 cursor-pointer"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute right-2.5 top-2.5 flex size-2 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-PrimaryColor opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-PrimaryColor" />
            </span>
          </button>
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute right-0 top-full mt-2 w-80"
              >
                <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary shadow-lg overflow-hidden">
                  <div className="p-4 border-b border-Border dark:border-secondary">
                    <h3 className="text-sm font-semibold font-PrimaryFont text-TextPrimary dark:text-surface">Notifications</h3>
                  </div>
                  <div className="p-8 text-center">
                    <Bell size={24} className="mx-auto mb-2 text-TextMuted" />
                    <p className="text-sm font-SecondaryFont text-TextMuted">No new notifications</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-3 pl-2 border-l border-Border dark:border-secondary/40">
          <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-PrimaryColor/20 to-SrcPrimaryColor/20">
             <span className="font-semibold font-SecondaryFont text-sm text-TextPrimary dark:text-surface">
                        {user?.image ? (
                          <Image width={60} height={60} className="rounded-full" src={user?.image} alt="image" />
                        ) : (
                          user?.name?.charAt(0)?.toUpperCase() || "U"
                        )}
                      </span>
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-sm font-semibold font-SecondaryFont text-TextPrimary dark:text-surface leading-tight flex items-center gap-1.5">
              {user?.name || "User"}
              {user?.plan && user.plan !== "free_seeker" && user.plan !== "recruiter_free" && (
                <span className="inline-flex items-center gap-0.5 text-[9px] font-bold font-SecondaryFont text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                  PRO
                </span>
              )}
            </span>
            <span className="text-xs font-SecondaryFont text-TextMuted">
              {user?.role === "admin"
                ? "Administrator"
                : user?.role === "recruiter"
                ? "Recruiter"
                : "Job Seeker"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
