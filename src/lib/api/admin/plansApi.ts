import fetchClient from "@/lib/utils/fetchClient";

export interface AdminPlan {
  _id: string;
  id: string;
  name: string;
  description: string;
  price: number;
  priceLabel: string;
  interval: string;
  role: string;
  features: string[];
  limits: {
    maxApplications?: number;
    maxJobPosts?: number;
  };
  stripePriceId: string;
  isFree: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export async function getAdminPlans(): Promise<AdminPlan[]> {
  const res = await fetchClient<{ data: AdminPlan[] }>("/api/admin/plans");
  return res.data;
}

export async function getAdminPlanById(id: string): Promise<AdminPlan> {
  const res = await fetchClient<{ data: AdminPlan }>(`/api/admin/plans/${id}`);
  return res.data;
}

export async function createAdminPlan(
  plan: Omit<AdminPlan, "_id" | "createdAt" | "updatedAt">
): Promise<AdminPlan> {
  const res = await fetchClient<{ data: AdminPlan }>("/api/admin/plans", {
    method: "POST",
    body: JSON.stringify(plan),
  });
  return res.data;
}

export async function updateAdminPlan(
  id: string,
  updates: Partial<AdminPlan>
): Promise<void> {
  await fetchClient(`/api/admin/plans/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
}

export async function deleteAdminPlan(id: string): Promise<void> {
  await fetchClient(`/api/admin/plans/${id}`, { method: "DELETE" });
}

export async function seedPlans(): Promise<void> {
  await fetchClient("/api/admin/plans/seed", { method: "POST" });
}
