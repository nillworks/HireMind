"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import {
  getPlans,
  getCurrentSubscription,
  type Plan,
  type SubscriptionData,
} from "@/lib/api/public/plansApi";
import PlanCard from "./PlanCard";
import CurrentPlanCard from "./CurrentPlanCard";
import { Sparkles } from "lucide-react";

const PlansPage = () => {
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role || "seeker";
  const userPlan = (session?.user as any)?.plan || "free_seeker";
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [plansData, subData] = await Promise.all([
        getPlans(),
        getCurrentSubscription(),
      ]);
      setPlans(plansData);
      setSubscription(subData);
    } catch {
      // keep defaults
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const myPlans = plans.filter((p) => p.role === userRole);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-Border dark:bg-secondary rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary p-6 animate-pulse"
            >
              <div className="h-10 w-10 bg-Border dark:bg-secondary rounded-xl mb-4" />
              <div className="h-5 w-32 bg-Border dark:bg-secondary rounded mb-2" />
              <div className="h-3 w-full bg-Border dark:bg-secondary rounded mb-4" />
              <div className="h-8 w-20 bg-Border dark:bg-secondary rounded mb-4" />
              <div className="space-y-2 mb-4">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-3 bg-Border dark:bg-secondary rounded" />
                ))}
              </div>
              <div className="h-10 w-full bg-Border dark:bg-secondary rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-PrimaryFont text-TextPrimary dark:text-white">
          Choose Your <span className="text-PrimaryColor">Plan</span>
        </h1>
        <p className="text-sm font-SecondaryFont text-TextSecondary dark:text-text-secondary mt-1">
          {userRole === "recruiter"
            ? "Upgrade to post more jobs and access premium recruiting tools"
            : "Upgrade to apply to more jobs and unlock AI-powered career tools"}
        </p>
      </div>

      {subscription && (
        <CurrentPlanCard
          subscription={subscription}
          onCancelled={fetchData}
        />
      )}

      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={18} className={userRole === "recruiter" ? "text-SrcPrimaryColor" : "text-PrimaryColor"} />
          <h2 className="text-lg font-bold font-PrimaryFont text-TextPrimary dark:text-white">
            {userRole === "recruiter" ? "Recruiter Plans" : "Job Seeker Plans"}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl">
          {myPlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              currentPlanId={userPlan}
              onUpgrade={fetchData}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlansPage;
