import fetchClient from "@/lib/utils/fetchClient";

export interface SearchItem {
  _id?: string;
  label: string;
  sublabel?: string;
  href: string;
}

export interface SearchCategory {
  category: string;
  categoryIcon: string;
  items: SearchItem[];
}

export const searchDashboard = async (q: string): Promise<SearchCategory[]> => {
  try {
    const res = await fetchClient<{ success: boolean; data: SearchCategory[] }>(
      `/api/dashboard/search?q=${encodeURIComponent(q)}`,
    );
    return res.data ?? [];
  } catch {
    return [];
  }
};
