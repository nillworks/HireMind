import "server-only";
import headersAuthorization from "../headersAuthorization.server";
import type { AdminUser } from "./users.types";

export type { AdminUser };

const API = process.env.NEXT_PUBLIC_API_URL;

export const getAllUsers = async (): Promise<{
  users: AdminUser[];
  totalPages: number;
}> => {
  try {
    const authHeaders = await headersAuthorization();
    const res = await fetch(`${API}/api/admin/users`, {
      cache: "no-store",
      headers: { ...authHeaders, "Content-Type": "application/json" },
    });
    if (!res.ok) return { users: [], totalPages: 1 };
    const json = await res.json();
    return {
      users: json.data ?? [],
      totalPages: json.pagination?.totalPages ?? 1,
    };
  } catch {
    return { users: [], totalPages: 1 };
  }
};
