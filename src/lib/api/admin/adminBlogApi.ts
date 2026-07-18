import "server-only";
import headersAuthorization from "../headersAuthorization.server";

const API = process.env.NEXT_PUBLIC_API_URL;

export const createBlogPost = async (data: {
  title: string;
  content: string;
  tags?: string[];
  authorImage?: string;
}): Promise<boolean> => {
  try {
    const authHeaders = await headersAuthorization();
    const res = await fetch(`${API}/api/admin/blog`, {
      method: "POST",
      cache: "no-store",
      headers: { ...authHeaders, "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch {
    return false;
  }
};

export const getAllBlogsAdmin = async () => {
  try {
    const authHeaders = await headersAuthorization();
    const res = await fetch(`${API}/api/admin/blog`, {
      cache: "no-store",
      headers: { ...authHeaders, "Content-Type": "application/json" },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
};
