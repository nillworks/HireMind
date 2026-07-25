"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { LayoutDashboard, LogOut, User, BadgeCheck } from "lucide-react";
import VerifiedBadge from "@/components/shared/VerifiedBadge";
import fetchClient from "@/lib/utils/fetchClient";

interface ProfileDropdownProps {
  user: {
    name?: string;
    email?: string;
    image?: string;
    role?: string;
  };
  userLinks: {
    dashboard: { label: string; href: string };
    profile: { label: string; href: string };
    logout: { label: string; onClick?: () => void };
  };
}

function calculateSeekerCompletion(profile: Record<string, unknown> | null, user: { name?: string; email?: string; image?: string }): number {
  let filled = 0;
  const total = 10;
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

function calculateRecruiterCompletion(profile: Record<string, unknown> | null, user: { name?: string; email?: string; image?: string }): number {
  let filled = 0;
  const total = 9;
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

function calculateAdminCompletion(user: { name?: string; email?: string; image?: string }): number {
  let filled = 0;
  const total = 3;
  if (user.name) filled++;
  if (user.email) filled++;
  if (user.image) filled++;
  return Math.round((filled / total) * 100);
}

function getCompletionColor(percent: number) {
  if (percent >= 100) return "#10B981";
  if (percent >= 70) return "#22C55E";
  if (percent >= 40) return "#F59E0B";
  return "#EF4444";
}

export default function ProfileDropdown({ user, userLinks }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const role = (user.role as string)?.toLowerCase();
    if (role === "admin") {
      setCompletion(calculateAdminCompletion(user));
      return;
    }
    const endpoint = role === "recruiter" ? "/api/recruiter-profile/profile" : "/api/seeker/profile";
    fetchClient<{ data?: Record<string, unknown> | null }>(endpoint)
      .then((json) => {
        const profile = json?.data ?? null;
        if (role === "recruiter") {
          setCompletion(calculateRecruiterCompletion(profile, user));
        } else {
          setCompletion(calculateSeekerCompletion(profile, user));
        }
      })
      .catch(() => setCompletion(30));
  }, [user]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (completion / 100) * circumference;
  const strokeColor = getCompletionColor(completion);

  return (
    <div
      className="relative"
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 rounded-full shrink-0 transition-transform duration-300 hover:scale-105 focus:outline-none cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Open user menu"
      >
        <svg
          className="absolute inset-0 -rotate-90"
          width="40"
          height="40"
          viewBox="0 0 40 40"
        >
          <circle
            cx="20"
            cy="20"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-Border dark:text-secondary/30"
          />
          <circle
            cx="20"
            cy="20"
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-[3px] rounded-full overflow-hidden">
          <Image
            src={user.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=HireMind"}
            alt="User profile picture"
            fill
            unoptimized
            sizes="34px"
            className="object-cover"
          />
        </div>
        {completion >= 100 && (
          <div className="absolute -bottom-0.5 -right-0.5 flex size-3.5 items-center justify-center rounded-full bg-emerald-500">
            <BadgeCheck size={8} className="text-white" />
          </div>
        )}
      </button>

      <div
        className={`absolute right-0 top-full pt-2 w-60 origin-top-right transition-all duration-300 ease-out z-50 ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="w-full rounded-2xl bg-Surface border border-Border shadow-lg overflow-hidden">
          <div className="p-4 border-b border-Border bg-SrcPrimaryColorLight/30">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 shrink-0">
                <svg
                  className="absolute inset-0 -rotate-90"
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                >
                  <circle
                    cx="20"
                    cy="20"
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-Border dark:text-secondary/30"
                  />
                  <circle
                    cx="20"
                    cy="20"
                    r={radius}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                <div className="absolute inset-[3px] rounded-full overflow-hidden">
                  <Image
                    src={user.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=HireMind"}
                    alt="User profile picture"
                    fill
                    unoptimized
                    sizes="34px"
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold font-SecondaryFont text-TextPrimary truncate">
                    {user.name || "User"}
                  </p>
                  <VerifiedBadge size={12} />
                </div>
                <p className="text-xs font-SecondaryFont text-TextSecondary truncate mt-0.5">
                  {user.email || "user@example.com"}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[10px] font-semibold font-SecondaryFont" style={{ color: strokeColor }}>
                    {completion}% complete
                  </span>
                  {completion >= 100 && (
                    <BadgeCheck size={10} className="text-emerald-500" />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-2">
            <Link
              href={userLinks.dashboard.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium font-SecondaryFont text-TextSecondary hover:text-PrimaryColor hover:bg-PrimaryColorLight/50 transition-all duration-200"
            >
              <LayoutDashboard size={16} />
              {userLinks.dashboard.label}
            </Link>
            <Link
              href={userLinks.profile.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium font-SecondaryFont text-TextSecondary hover:text-PrimaryColor hover:bg-PrimaryColorLight/50 transition-all duration-200"
            >
              <User size={16} />
              {userLinks.profile.label}
            </Link>
          </div>

          <div className="p-2 border-t border-Border">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                if (userLinks.logout.onClick) userLinks.logout.onClick();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium font-SecondaryFont text-TextSecondary hover:text-PrimaryColor hover:bg-PrimaryColorLight/50 transition-all duration-200 cursor-pointer"
            >
              <LogOut size={16} />
              {userLinks.logout.label}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
