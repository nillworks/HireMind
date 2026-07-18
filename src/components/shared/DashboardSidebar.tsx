"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Briefcase,
  Heart,
  ExternalLink,
  BarChart3,
  Users,
  FileText,
  UserPlus,
  BookOpen,
  MessageSquareText,
  Sparkles,
  ChevronLeft,
  CheckSquare,
  FileCheck,
  PlusCircle,
  Shield,
  Ban,
  Globe,
  UserCheck,
  UserCog,
  Bot,
  ScrollText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

interface User {
  name?: string;
  email?: string;
  image?: string;
  role?: string;
}

interface DashboardSidebarProps {
  user: User | null;
}

const seekerSections: SidebarSection[] = [
  {
    title: "Main",
    items: [
      { label: "Overview", href: "/dashboard/seeker", icon: LayoutDashboard },
      { label: "My Applications", href: "/dashboard/seeker/applications", icon: FileCheck },
      { label: "Saved Jobs", href: "/dashboard/seeker/saved-jobs", icon: Heart },
      { label: "Apply as Recruiter", href: "/dashboard/seeker/apply-recruiter", icon: UserPlus },
    ],
  },
  {
    title: "AI Tools",
    items: [
      { label: "Cover Letter Generator", href: "/dashboard/seeker/ai-tools", icon: ScrollText },
      { label: "Job Recommendations", href: "/dashboard/seeker/recommendations", icon: Sparkles },
      { label: "Resume Analyzer", href: "/dashboard/seeker/resume-analyzer", icon: FileText },
    ],
  },
];

const recruiterSections: SidebarSection[] = [
  {
    title: "Main",
    items: [
      { label: "Overview", href: "/dashboard/recruiter", icon: LayoutDashboard },
      { label: "Post a Job", href: "/dashboard/recruiter/post-job", icon: PlusCircle },
      { label: "My Jobs", href: "/dashboard/recruiter/my-jobs", icon: Briefcase },
      { label: "Analytics", href: "/dashboard/recruiter/analytics", icon: BarChart3 },
    ],
  },
  {
    title: "AI Tools",
    items: [
      { label: "Resume Classifier", href: "/dashboard/recruiter/resume-classifier", icon: Bot },
    ],
  },
];

const adminSections: SidebarSection[] = [
  {
    title: "Main",
    items: [
      { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
      { label: "Manage Users", href: "/dashboard/admin/users", icon: Users },
      { label: "Manage Jobs", href: "/dashboard/admin/jobs", icon: Briefcase },
      { label: "Recruiter Applications", href: "/dashboard/admin/recruiters", icon: UserCheck },
    ],
  },
  {
    title: "Content",
    items: [
      { label: "Blog / Posts", href: "/dashboard/admin/posts", icon: BookOpen },
      { label: "Add Blog Post", href: "/dashboard/admin/posts/add", icon: FileText },
    ],
  },
  {
    title: "AI Oversight",
    items: [
      { label: "Website Content", href: "/dashboard/admin/content", icon: Globe },
    ],
  },
];

const getSectionsByRole = (role: string): SidebarSection[] => {
  switch (role) {
    case "admin":
      return adminSections;
    case "recruiter":
      return recruiterSections;
    case "seeker":
    default:
      return seekerSections;
  }
};

export default function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("dashboardSidebarCollapsed");
    if (saved) setCollapsed(saved === "true");
    setMounted(true);
  }, []);

  const toggleCollapsed = useCallback(() => {
    setCollapsed(prev => {
      localStorage.setItem("dashboardSidebarCollapsed", String(!prev));
      return !prev;
    });
  }, []);

  if (!mounted) return null;

  const role = user?.role || "seeker";
  const sections = getSectionsByRole(role);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col bg-white dark:bg-[#0B1120] border-r border-Border dark:border-secondary/40 transition-all duration-300 ease-out",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b border-Border dark:border-secondary/40">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-PrimaryColor to-SrcPrimaryColor shadow-sm">
            <span className="text-white font-bold font-PrimaryFont text-sm">T</span>
          </div>
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="text-lg font-bold font-PrimaryFont text-TextPrimary dark:text-surface tracking-tight"
              >
                TalentAI
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        <button
          onClick={toggleCollapsed}
          className="flex size-8 items-center justify-center rounded-lg text-TextSecondary dark:text-text-secondary hover:bg-BorderLight dark:hover:bg-secondary/20 transition-colors duration-200 cursor-pointer"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft
            size={16}
            className={cn("transition-transform duration-300", collapsed && "rotate-180")}
          />
        </button>
      </div>

      <div className="flex items-center gap-3 px-4 py-3 border-b border-Border dark:border-secondary/40">
        <div className="relative flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-PrimaryColor/20 to-SrcPrimaryColor/20">
          <span className="font-semibold font-SecondaryFont text-sm text-TextPrimary dark:text-surface">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </span>
        </div>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="flex flex-col overflow-hidden"
            >
              <span className="text-sm font-semibold font-SecondaryFont text-TextPrimary dark:text-surface truncate">
                {user?.name || "User"}
              </span>
              <span className="text-xs font-SecondaryFont text-TextMuted truncate">
                {role === "admin"
                  ? "Administrator"
                  : role === "recruiter"
                  ? "Recruiter"
                  : "Job Seeker"}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin">
        <AnimatePresence mode="wait">
          {sections.map((section) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 last:mb-0"
            >
              {!collapsed && (
                <h4 className="mb-2 px-2 text-xs font-semibold font-SecondaryFont uppercase tracking-widest text-TextMuted dark:text-text-secondary">
                  {section.title}
                </h4>
              )}
              <ul className="flex flex-col gap-0.5">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "group relative flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm font-medium font-SecondaryFont transition-all duration-200",
                          collapsed && "justify-center px-2",
                          isActive
                            ? "bg-gradient-to-r from-PrimaryColorLight to-SrcPrimaryColorLight dark:from-PrimaryColorDark/20 dark:to-SrcPrimaryColorDark/20 text-PrimaryColor dark:text-SrcPrimaryColorLight"
                            : "text-TextSecondary dark:text-text-secondary hover:bg-BorderLight dark:hover:bg-secondary/15 hover:text-TextPrimary dark:hover:text-surface"
                        )}
                      >
                        <item.icon
                          size={18}
                          className={cn(
                            "shrink-0 transition-transform duration-200",
                            !collapsed && "group-hover:scale-110"
                          )}
                        />
                        {!collapsed && (
                          <>
                            <span className="truncate">{item.label}</span>
                          </>
                        )}
                        {isActive && (
                          <motion.div
                            layoutId="sidebar-active"
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-gradient-to-b from-PrimaryColor to-SrcPrimaryColor"
                          />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          ))}
        </AnimatePresence>
      </nav>

      <div className="px-3 py-3 border-t border-Border dark:border-secondary/40">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm font-medium font-SecondaryFont text-TextSecondary dark:text-text-secondary hover:bg-BorderLight dark:hover:bg-secondary/15 hover:text-TextPrimary dark:hover:text-surface transition-all duration-200",
            collapsed && "justify-center px-2"
          )}
        >
          <ExternalLink size={18} className="shrink-0" />
          {!collapsed && <span>Back to site</span>}
        </Link>
      </div>
    </aside>
  );
}
