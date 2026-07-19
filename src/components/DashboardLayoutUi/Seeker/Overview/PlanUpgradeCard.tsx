"use client";

import { Crown, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

interface PlanUpgradeCardProps {
  currentPlan?: string;
  usage?: number;
  limit?: number;
}

const PlanUpgradeCard = ({
  currentPlan = "free_seeker",
  usage = 0,
  limit = 5,
}: PlanUpgradeCardProps) => {
  const isFree = currentPlan === "free_seeker";
  const percent = limit > 0 ? Math.min(100, Math.round((usage / limit) * 100)) : 0;

  if (!isFree) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-SrcPrimaryColor/5 to-SrcPrimaryColor/10 border border-SrcPrimaryColor/20 p-5">
        <div className="flex items-center gap-2 mb-2">
          <Crown size={16} className="text-SrcPrimaryColor" />
          <h3 className="text-sm font-semibold font-PrimaryFont text-TextPrimary dark:text-white">
            Pro Plan Active
          </h3>
        </div>
        <p className="text-xs font-SecondaryFont text-TextMuted mb-3">
          You&apos;re on the Pro plan. Enjoy unlimited features!
        </p>
        <Link
          href="/plans"
          className="inline-flex items-center gap-1.5 text-xs font-semibold font-SecondaryFont text-SrcPrimaryColor hover:underline"
        >
          Manage Subscription
          <ArrowRight size={12} />
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-PrimaryColor/5 to-SrcPrimaryColor/5 border border-Border dark:border-secondary p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-PrimaryColor" />
          <h3 className="text-sm font-semibold font-PrimaryFont text-TextPrimary dark:text-white">
            Free Plan
          </h3>
        </div>
        <span className="text-[10px] font-semibold font-SecondaryFont text-TextMuted">
          {usage}/{limit} apps used
        </span>
      </div>

      <div className="w-full h-1.5 rounded-full bg-Border dark:bg-secondary overflow-hidden mb-3">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            percent >= 80 ? "bg-amber-500" : "bg-PrimaryColor"
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="text-xs font-SecondaryFont text-TextMuted mb-3">
        Upgrade to Pro for 50 applications/month and AI-powered tools.
      </p>

      <Link
        href="/plans"
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor px-4 py-2 text-xs font-semibold font-SecondaryFont text-white hover:opacity-90 transition-opacity"
      >
        <Crown size={12} />
        Upgrade to Pro
      </Link>
    </div>
  );
};

export default PlanUpgradeCard;
