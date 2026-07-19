"use client";

import Link from "next/link";
import { Crown, Briefcase, Users } from "lucide-react";

interface PlanUsageBarProps {
  plan: string;
  role: string;
  usage: number;
  limit: number;
}

const PlanUsageBar = ({ plan, role, usage, limit }: PlanUsageBarProps) => {
  const isFree = plan === "free_seeker" || plan === "recruiter_free";
  if (!isFree) return null;

  const isSeeker = role === "seeker";
  const percent = limit > 0 ? Math.min(100, Math.round((usage / limit) * 100)) : 0;
  const remaining = Math.max(0, limit - usage);
  const label = isSeeker ? "applications" : "job posts";
  const Icon = isSeeker ? Briefcase : Users;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-Border dark:border-secondary bg-white dark:bg-[#1e293b] px-4 py-3">
      <div className="flex items-center gap-2 shrink-0">
        <Icon size={14} className={percent >= 80 ? "text-red-500" : "text-TextMuted"} />
        <span className="text-xs font-semibold font-SecondaryFont text-TextPrimary dark:text-white whitespace-nowrap">
          {usage}/{limit} {label}
        </span>
      </div>

      <div className="flex-1 h-1.5 rounded-full bg-Border dark:bg-secondary overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            percent >= 80 ? "bg-red-500" : percent >= 50 ? "bg-amber-500" : "bg-emerald-500"
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {percent >= 80 ? (
        <Link
          href="/plans"
          className="inline-flex items-center gap-1 text-[10px] font-bold font-SecondaryFont text-PrimaryColor hover:underline whitespace-nowrap"
        >
          <Crown size={10} />
          Upgrade
        </Link>
      ) : (
        <span className="text-[10px] font-semibold font-SecondaryFont text-TextMuted whitespace-nowrap">
          {remaining} left
        </span>
      )}
    </div>
  );
};

export default PlanUsageBar;
