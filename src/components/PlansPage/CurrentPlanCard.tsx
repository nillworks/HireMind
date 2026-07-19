"use client";

import { useState } from "react";
import {
  Crown,
  Loader2,
  AlertTriangle,
  X,
} from "lucide-react";
import {
  getCurrentSubscription,
  cancelSubscription,
  type SubscriptionData,
} from "@/lib/api/public/plansApi";
import { toast } from "sonner";

interface CurrentPlanCardProps {
  subscription: SubscriptionData;
  onCancelled: () => void;
}

const CurrentPlanCard = ({ subscription, onCancelled }: CurrentPlanCardProps) => {
  const [cancelling, setCancelling] = useState(false);

  const { plan, usage, limit } = subscription;
  const percent = limit > 0 ? Math.min(100, Math.round((usage / limit) * 100)) : 0;
  const isNearLimit = percent >= 80;
  const isAtLimit = percent >= 100;

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel your subscription? You'll be downgraded to the free plan.")) return;
    setCancelling(true);
    try {
      const success = await cancelSubscription();
      if (success) {
        toast.success("Subscription cancelled. You've been downgraded to the free plan.");
        onCancelled();
      } else {
        toast.error("Failed to cancel subscription");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold font-PrimaryFont text-TextPrimary dark:text-white">
          Current Plan
        </h3>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold font-SecondaryFont uppercase tracking-wider ${
            plan.isFree
              ? "bg-BorderLight dark:bg-secondary/20 text-TextMuted"
              : "bg-gradient-to-r from-PrimaryColor/10 to-SrcPrimaryColor/10 text-PrimaryColor"
          }`}
        >
          {!plan.isFree && <Crown size={10} />}
          {plan.name}
        </span>
      </div>

      <p className="text-xs font-SecondaryFont text-TextMuted mb-4">
        {plan.description}
      </p>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-SecondaryFont text-TextMuted">
            Usage this month
          </span>
          <span className="text-xs font-semibold font-SecondaryFont text-TextPrimary dark:text-white">
            {usage} / {limit || "Unlimited"}
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-Border dark:bg-secondary overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isAtLimit
                ? "bg-red-500"
                : isNearLimit
                ? "bg-amber-500"
                : plan.role === "seeker"
                ? "bg-PrimaryColor"
                : "bg-SrcPrimaryColor"
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>
        {isAtLimit && (
          <div className="flex items-center gap-1.5 mt-2">
            <AlertTriangle size={12} className="text-red-500" />
            <p className="text-[11px] font-SecondaryFont text-red-500">
              You&apos;ve reached your monthly limit. Upgrade for more.
            </p>
          </div>
        )}
        {isNearLimit && !isAtLimit && (
          <div className="flex items-center gap-1.5 mt-2">
            <AlertTriangle size={12} className="text-amber-500" />
            <p className="text-[11px] font-SecondaryFont text-amber-500">
              You&apos;re approaching your monthly limit.
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {plan.features.slice(0, 3).map((feature) => (
          <span
            key={feature}
            className="inline-flex items-center rounded-full bg-BorderLight dark:bg-secondary/20 px-2.5 py-1 text-[10px] font-medium font-SecondaryFont text-TextMuted"
          >
            {feature}
          </span>
        ))}
      </div>

      {!plan.isFree && (
        <button
          onClick={handleCancel}
          disabled={cancelling}
          className="inline-flex items-center gap-1.5 text-xs font-SecondaryFont font-medium text-red-500 hover:text-red-600 transition-colors cursor-pointer disabled:opacity-50"
        >
          {cancelling ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <X size={12} />
          )}
          Cancel Subscription
        </button>
      )}
    </div>
  );
};

export default CurrentPlanCard;
