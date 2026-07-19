export type PlanType = "free_seeker" | "pro_seeker" | "recruiter_free" | "pro_recruiter";

export interface Plan {
  _id?: string;
  id: PlanType;
  name: string;
  description: string;
  price: number;
  priceLabel: string;
  interval: "month" | "year";
  role: "seeker" | "recruiter";
  features: string[];
  limits: {
    maxApplications?: number;
    maxJobPosts?: number;
  };
  stripePriceId: string;
  isFree: boolean;
}

export interface SubscriptionData {
  plan: Plan;
  role: string;
  usage: number;
  limit: number;
  periodStart: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const getPlans = async (): Promise<Plan[]> => {
  try {
    const res = await fetch(`${API_URL}/api/payments/plans`);
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
};

export const getCurrentSubscription = async (): Promise<SubscriptionData | null> => {
  try {
    const res = await fetch(`${API_URL}/api/payments/subscription`);
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
};

export const createCheckoutSession = async (
  planId: string
): Promise<{ url: string | null; sessionId: string | null }> => {
  const plan = await getPlanForCheckout(planId);
  if (!plan) throw new Error("Plan not found");

  const res = await fetch("/api/payments/create-checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      planId: plan.id,
      planName: plan.name,
      price: plan.price,
      interval: plan.interval,
    }),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Checkout failed");
  return { url: json.data?.url ?? null, sessionId: json.data?.sessionId ?? null };
};

const getPlanForCheckout = async (planId: string): Promise<Plan | null> => {
  const plans = await getPlans();
  return plans.find((p) => p.id === planId) || null;
};

export const cancelSubscription = async (): Promise<boolean> => {
  try {
    const res = await fetch(`${API_URL}/api/payments/cancel`, { method: "POST" });
    const json = await res.json();
    return json.success;
  } catch {
    return false;
  }
};
