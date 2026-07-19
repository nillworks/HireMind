"use client";

import { Crown, ArrowRight, Zap, Briefcase, Users } from "lucide-react";
import Link from "next/link";

interface PlanUpgradeCardProps {
  currentPlan?: string;
  role?: string;
  usage?: number;
  limit?: number;
}

const PlanUpgradeCard = ({
  currentPlan = "free_seeker",
  role = "seeker",
  usage = 0,
  limit = 5,
}: PlanUpgradeCardProps) => {
  const isFree = currentPlan === "free_seeker" || currentPlan === "recruiter_free";
  const isPro = !isFree;
  const isSeeker = role === "seeker";
  const percent = limit > 0 ? Math.min(100, Math.round((usage / limit) * 100)) : 0;
  const remaining = Math.max(0, limit - usage);
  const limitLabel = isSeeker ? "applications" : "job posts";

  const Icon = isSeeker ? Briefcase : Users;
  const color = isSeeker ? "PrimaryColor" : "SrcPrimaryColor";

  if (isPro) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-emerald-500/5 to-emerald-600/10 border border-emerald-500/20 p-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10">
            <Crown size={16} className="text-emerald-500" />
          </div>
          <h3 className="text-sm font-semibold font-PrimaryFont text-TextPrimary dark:text-white">
            Pro Plan Active
          </h3>
        </div>
        <p className="text-xs font-SecondaryFont text-TextMuted mb-3">
          Unlimited {limitLabel}. Full access to all premium features.
        </p>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold font-SecondaryFont text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
            <Crown size={8} /> PRO
          </span>
          <Link
            href="/plans"
            className="inline-flex items-center gap-1.5 text-xs font-semibold font-SecondaryFont text-emerald-500 hover:underline"
          >
            Manage Subscription
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-amber-500/5 to-amber-600/10 border border-amber-500/20 p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10">
            <Icon size={16} className="text-amber-500" />
          </div>
          <h3 className="text-sm font-semibold font-PrimaryFont text-TextPrimary dark:text-white">
            Free Plan
          </h3>
        </div>
        <span className={`text-[10px] font-bold font-SecondaryFont px-2 py-0.5 rounded-full ${
          percent >= 80
            ? "text-red-500 bg-red-500/10"
            : "text-amber-600 bg-amber-500/10"
        }`}>
          {remaining} {limitLabel} left
        </span>
      </div>

      <div className="w-full h-2 rounded-full bg-Border dark:bg-secondary overflow-hidden mb-3">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            percent >= 80 ? "bg-red-500" : percent >= 50 ? "bg-amber-500" : "bg-emerald-500"
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="text-xs font-SecondaryFont text-TextMuted mb-3">
        You&apos;ve used <span className="font-semibold text-TextPrimary dark:text-white">{usage}/{limit}</span> {limitLabel} this month.
        {percent >= 80 && " Upgrade to Pro for unlimited!"}
      </p>

      <Link
        href="/plans"
        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold font-SecondaryFont text-white hover:opacity-90 transition-opacity ${
          isSeeker
            ? "bg-gradient-to-r from-PrimaryColor to-PrimaryColorDark"
            : "bg-gradient-to-r from-SrcPrimaryColor to-SrcPrimaryColorDark"
        }`}
      >
        <Crown size={12} />
        Upgrade to Pro
      </Link>
    </div>
  );
};

export default PlanUpgradeCard;
