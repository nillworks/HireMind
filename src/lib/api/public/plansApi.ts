import fetchClient from "@/lib/utils/fetchClient";

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
  const json = await fetchClient<{
    success: boolean;
    data?: { url: string | null; sessionId: string | null };
  }>("/api/payments/create-checkout", {
    method: "POST",
    body: JSON.stringify({ planId }),
  });

  return { url: json.data?.url ?? null, sessionId: json.data?.sessionId ?? null };
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
