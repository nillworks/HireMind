"use client";

import { useState } from "react";
import {
  Check,
  Zap,
  Crown,
  Loader2,
  Briefcase,
  Users,
} from "lucide-react";
import { createCheckoutSession, type Plan } from "@/lib/api/public/plansApi";
import { toast } from "sonner";

interface PlanCardProps {
  plan: Plan;
  currentPlanId?: string;
  onUpgrade?: () => void;
}

const PlanCard = ({ plan, currentPlanId, onUpgrade }: PlanCardProps) => {
  const [loading, setLoading] = useState(false);
  const isCurrent = plan.id === currentPlanId;
  const isPopular = plan.id === "pro_seeker" || plan.id === "pro_recruiter";

  const handleUpgrade = async () => {
    if (plan.isFree || isCurrent) return;
    setLoading(true);
    try {
      const { url } = await createCheckoutSession(plan.id);
      if (url) {
        window.location.href = url;
      } else {
        toast.error("No checkout URL returned. Check server logs.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-6 transition-all duration-300 ${
        isCurrent
          ? "border-SrcPrimaryColor bg-white dark:bg-[#1e293b] shadow-md"
          : isPopular
          ? "border-PrimaryColor bg-white dark:bg-[#1e293b] shadow-lg scale-[1.02]"
          : "border-Border dark:border-secondary bg-white dark:bg-[#1e293b] hover:shadow-lg hover:-translate-y-0.5"
      }`}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor px-3 py-1 text-[10px] font-bold font-SecondaryFont text-white uppercase tracking-wider">
            <Crown size={10} />
            Most Popular
          </span>
        </div>
      )}

      {isCurrent && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 rounded-full bg-SrcPrimaryColor px-3 py-1 text-[10px] font-bold font-SecondaryFont text-white uppercase tracking-wider">
            Current Plan
          </span>
        </div>
      )}

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div
            className={`p-2 rounded-xl ${
              plan.role === "seeker"
                ? "bg-PrimaryColorLight dark:bg-PrimaryColorDark/20"
                : "bg-SrcPrimaryColorLight dark:bg-SrcPrimaryColorDark/20"
            }`}
          >
            {plan.role === "seeker" ? (
              <Briefcase size={18} className="text-PrimaryColor" />
            ) : (
              <Users size={18} className="text-SrcPrimaryColor" />
            )}
          </div>
          <h3 className="text-base font-bold font-PrimaryFont text-TextPrimary dark:text-white">
            {plan.name}
          </h3>
        </div>
        <p className="text-xs font-SecondaryFont text-TextMuted">
          {plan.description}
        </p>
      </div>

      <div className="mb-5">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold font-PrimaryFont text-TextPrimary dark:text-white">
            {plan.priceLabel}
          </span>
        </div>
        {plan.limits.maxApplications && (
          <p className="text-xs font-SecondaryFont text-TextMuted mt-1">
            {plan.limits.maxApplications} applications/month
          </p>
        )}
        {plan.limits.maxJobPosts && (
          <p className="text-xs font-SecondaryFont text-TextMuted mt-1">
            {plan.limits.maxJobPosts} job posts/month
          </p>
        )}
      </div>

      <ul className="space-y-2.5 mb-6 flex-1">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <Check
              size={14}
              className={`shrink-0 mt-0.5 ${
                plan.role === "seeker"
                  ? "text-PrimaryColor"
                  : "text-SrcPrimaryColor"
              }`}
            />
            <span className="text-xs font-SecondaryFont text-TextSecondary dark:text-text-secondary">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <button
        onClick={handleUpgrade}
        disabled={isCurrent || plan.isFree || loading}
        className={`w-full h-11 rounded-xl text-sm font-semibold font-SecondaryFont flex items-center justify-center gap-2 transition-all cursor-pointer disabled:cursor-not-allowed ${
          isCurrent
            ? "bg-BorderLight dark:bg-secondary/20 text-TextMuted"
            : plan.isFree
            ? "bg-BorderLight dark:bg-secondary/20 text-TextMuted"
            : isPopular
            ? "bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor text-white hover:opacity-90"
            : plan.role === "seeker"
            ? "bg-PrimaryColor text-white hover:opacity-90"
            : "bg-SrcPrimaryColor text-white hover:opacity-90"
        }`}
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : isCurrent ? (
          "Current Plan"
        ) : plan.isFree ? (
          "Free Plan"
        ) : (
          <>
            <Zap size={14} />
            Upgrade Now
          </>
        )}
      </button>
    </div>
  );
};

export default PlanCard;
