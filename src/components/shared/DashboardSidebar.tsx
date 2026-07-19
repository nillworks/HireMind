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
  Sparkles,
  FileCheck,
  PlusCircle,
  Globe,
  UserCheck,
  Bot,
  ScrollText,
  UserCircle,
  BadgeCheck,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";

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
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
  plan?: string | null;
}

interface DashboardSidebarProps {
  user: User | null;
  expanded?: boolean;
  profileCompletion?: number;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const getCompletionColor = (percent: number) => {
  if (percent >= 100) return { stroke: "#10B981", text: "text-emerald-500" };
  if (percent >= 70) return { stroke: "#22C55E", text: "text-green-500" };
  if (percent >= 40) return { stroke: "#F59E0B", text: "text-amber-500" };
  return { stroke: "#EF4444", text: "text-red-500" };
};

const seekerSections: SidebarSection[] = [
  {
    title: "Main",
    items: [
      { label: "Overview", href: "/dashboard/seeker", icon: LayoutDashboard },
      { label: "My Applications", href: "/dashboard/seeker/applications", icon: FileCheck },
      { label: "Saved Jobs", href: "/dashboard/seeker/saved-jobs", icon: Heart },
      { label: "Apply as Recruiter", href: "/dashboard/seeker/apply-recruiter", icon: UserPlus },
      { label: "Profile", href: "/dashboard/seeker/profile", icon: UserCircle },
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
      { label: "Profile", href: "/dashboard/recruiter/profile", icon: UserCircle },
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
      { label: "Manage Plans", href: "/dashboard/admin/plans", icon: CreditCard },
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

export default function DashboardSidebar({
  user,
  expanded = false,
  profileCompletion = 0,
  mobileOpen = false,
  onMobileClose,
  onMouseEnter,
  onMouseLeave,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    onMobileClose?.();
  }, [pathname, onMobileClose]);

  if (!mounted) return null;

  const role = user?.role || "seeker";
  const sections = getSectionsByRole(role);
  const completion = Math.min(100, Math.max(0, profileCompletion));
  const completionColor = getCompletionColor(completion);
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completion / 100) * circumference;

  const showFullText = expanded || mobileOpen;

  return (
    <aside
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col bg-white dark:bg-[#0B1120] border-r border-Border dark:border-secondary/40 transition-all duration-300 ease-out",
        "max-lg:transition-transform max-lg:duration-300",
        expanded ? "lg:w-[260px]" : "lg:w-[72px]",
        "max-lg:w-[280px] max-lg:shadow-2xl",
        mobileOpen ? "max-lg:translate-x-0" : "max-lg:-translate-x-full",
        expanded && "lg:shadow-xl lg:z-50"
      )}
    >
      <div className="flex h-16 items-center gap-3 px-4 border-b border-Border dark:border-secondary/40">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-PrimaryColor to-SrcPrimaryColor shadow-sm shrink-0">
            <span className="text-white font-bold font-PrimaryFont text-sm">T</span>
          </div>
          <AnimatePresence initial={false}>
            {showFullText && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="text-lg font-bold font-PrimaryFont text-TextPrimary dark:text-surface tracking-tight whitespace-nowrap overflow-hidden"
              >
                TalentAI
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      <div className="flex items-center gap-3 px-4 py-3 border-b border-Border dark:border-secondary/40">
        <div className="relative flex size-11 shrink-0 items-center justify-center">
          <svg className="absolute inset-0 -rotate-90" width="44" height="44" viewBox="0 0 44 44">
            <circle cx="22" cy="22" r={radius} fill="none" stroke="currentColor" strokeWidth="2" className="text-Border dark:text-secondary/30" />
            <circle cx="22" cy="22" r={radius} fill="none" stroke={completionColor.stroke} strokeWidth="2" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className="transition-all duration-700 ease-out" />
          </svg>
          <div className="relative flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-PrimaryColor/20 to-SrcPrimaryColor/20 overflow-hidden">
            {user?.image ? (
              <Image width={36} height={36} className="rounded-full object-cover" src={user.image} alt={user.name || "User"} />
            ) : (
              <span className="font-semibold font-SecondaryFont text-sm text-TextPrimary dark:text-surface">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            )}
          </div>
          {completion >= 100 && showFullText && (
            <div className="absolute -bottom-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-emerald-500">
              <BadgeCheck size={10} className="text-white" />
            </div>
          )}
        </div>
        <AnimatePresence initial={false}>
          {showFullText && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="flex flex-col overflow-hidden min-w-0"
            >
              <span className="text-sm font-semibold font-SecondaryFont text-TextPrimary dark:text-surface truncate">
                {user?.name || "User"}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-SecondaryFont text-TextMuted truncate">
                  {role === "admin" ? "Administrator" : role === "recruiter" ? "Recruiter" : "Job Seeker"}
                </span>
                {user?.plan && user.plan !== "free_seeker" && user.plan !== "recruiter_free" && (
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-bold font-SecondaryFont text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                    PRO
                  </span>
                )}
                <span className={`text-[10px] font-semibold font-SecondaryFont ${completionColor.text} whitespace-nowrap`}>
                  {completion}%
                </span>
              </div>
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
              {showFullText && (
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
                        title={!showFullText ? item.label : undefined}
                        className={cn(
                          "group relative flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm font-medium font-SecondaryFont transition-all duration-200",
                          !showFullText && "justify-center px-2",
                          isActive
                            ? "bg-gradient-to-r from-PrimaryColorLight to-SrcPrimaryColorLight dark:from-PrimaryColorDark/20 dark:to-SrcPrimaryColorDark/20 text-PrimaryColor dark:text-SrcPrimaryColorLight"
                            : "text-TextSecondary dark:text-text-secondary hover:bg-BorderLight dark:hover:bg-secondary/15 hover:text-TextPrimary dark:hover:text-surface"
                        )}
                      >
                        <item.icon size={18} className={cn("shrink-0 transition-transform duration-200", showFullText && "group-hover:scale-110")} />
                        {showFullText && <span className="truncate">{item.label}</span>}
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
          onClick={() => onMobileClose?.()}
          title={!showFullText ? "Back to site" : undefined}
          className={cn(
            "flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm font-medium font-SecondaryFont text-TextSecondary dark:text-text-secondary hover:bg-BorderLight dark:hover:bg-secondary/15 hover:text-TextPrimary dark:hover:text-surface transition-all duration-200",
            !showFullText && "justify-center px-2"
          )}
        >
          <ExternalLink size={18} className="shrink-0" />
          {showFullText && <span>Back to site</span>}
        </Link>
      </div>
    </aside>
  );
}
