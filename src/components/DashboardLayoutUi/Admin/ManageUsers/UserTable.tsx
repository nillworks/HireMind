"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  Shield,
  ShieldCheck,
  UserCog,
  Trash2,
  Ban,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import fetchClient from "@/lib/utils/fetchClient";
import type { AdminUser } from "@/lib/api/admin/users.types";
import ChangeRoleDialog from "./ChangeRoleDialog";
import DeleteUserDialog from "./DeleteUserDialog";

const defaultRole = {
  label: "User",
  className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
  icon: UserCog,
};

const roleConfig: Record<string, typeof defaultRole> = {
  admin: {
    label: "Admin",
    className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
    icon: Shield,
  },
  recruiter: {
    label: "Recruiter",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
    icon: ShieldCheck,
  },
  seeker: {
    label: "Seeker",
    className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
    icon: UserCog,
  },
  user: {
    label: "User",
    className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
    icon: UserCog,
  },
};

interface UserTableProps {
  users: AdminUser[];
}

const UserTable = ({ users }: UserTableProps) => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [roleDialog, setRoleDialog] = useState<{ open: boolean; user: AdminUser | null }>({
    open: false,
    user: null,
  });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; user: AdminUser | null }>({
    open: false,
    user: null,
  });
  const [blocking, setBlocking] = useState<string | null>(null);
  const router = useRouter();

  const filtered = (users || []).filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleBlock = async (user: AdminUser) => {
    setBlocking(user._id);
    try {
      await fetchClient(`/api/admin/users/${user._id}/block`, {
        method: "PATCH",
        body: JSON.stringify({ isBlocked: !user.isBlocked }),
      });
      toast.success(user.isBlocked ? `${user.name} unblocked` : `${user.name} blocked`);
      router.refresh();
    } catch {
      toast.error("Failed to update user");
    } finally {
      setBlocking(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-TextMuted" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-Border dark:border-secondary bg-white dark:bg-[#1e293b] text-sm font-SecondaryFont text-TextPrimary dark:text-surface placeholder:text-TextMuted focus:outline-none focus:ring-2 focus:ring-PrimaryColor/30 transition-all"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-Border dark:border-secondary bg-white dark:bg-[#1e293b] text-sm font-SecondaryFont text-TextPrimary dark:text-surface cursor-pointer focus:outline-none focus:ring-2 focus:ring-PrimaryColor/30 transition-all"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="recruiter">Recruiter</option>
          <option value="seeker">Seeker</option>
          <option value="user">User</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-Border dark:border-secondary bg-gray-50 dark:bg-gray-800/50">
          <div className="col-span-5 sm:col-span-4 text-xs font-SecondaryFont font-semibold text-TextMuted uppercase tracking-wider">
            User
          </div>
          <div className="col-span-3 text-xs font-SecondaryFont font-semibold text-TextMuted uppercase tracking-wider hidden sm:block">
            Role
          </div>
          <div className="col-span-4 sm:col-span-5 text-xs font-SecondaryFont font-semibold text-TextMuted uppercase tracking-wider text-right">
            Actions
          </div>
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <p className="text-sm font-SecondaryFont text-TextMuted">
              {search || roleFilter !== "all"
                ? "No users match your filters."
                : "No users found."}
            </p>
          </div>
        ) : (
          filtered.map((user) => {
            const role = roleConfig[user.role] || defaultRole;
            const RoleIcon = role.icon;
            const hasImage =
              user.image &&
              (user.image.startsWith("http://") || user.image.startsWith("https://"));

            return (
              <div
                key={user._id}
                className="flex flex-col sm:grid sm:grid-cols-12 gap-3 sm:gap-4 items-start sm:items-center px-5 py-3.5 border-b border-Border/50 dark:border-secondary/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
              >
                {/* User */}
                <div className="col-span-5 sm:col-span-4 flex items-center gap-3 min-w-0">
                  {hasImage ? (
                    <Image
                      src={user.image!}
                      alt={user.name}
                      width={36}
                      height={36}
                      className="size-9 rounded-lg object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-PrimaryColor to-SrcPrimaryColor flex-shrink-0">
                      <span className="text-sm font-bold font-PrimaryFont text-white">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-SecondaryFont font-medium text-TextPrimary dark:text-surface truncate">
                      {user.name}
                    </p>
                    <p className="text-xs font-SecondaryFont text-TextMuted truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Role */}
                <div className="col-span-3 hidden sm:block">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-SecondaryFont font-medium px-2 py-1 rounded-full border ${role.className}`}
                  >
                    <RoleIcon size={12} />
                    {role.label}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-4 sm:col-span-5 flex items-center sm:justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBlock(user)}
                    disabled={blocking === user._id}
                    className={`h-8 px-3 text-xs font-SecondaryFont font-medium cursor-pointer ${
                      user.isBlocked
                        ? "border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
                        : "border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-900/20"
                    }`}
                  >
                    {user.isBlocked ? (
                      <CheckCircle size={14} className="mr-1" />
                    ) : (
                      <Ban size={14} className="mr-1" />
                    )}
                    {user.isBlocked ? "Unblock" : "Block"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setRoleDialog({ open: true, user })}
                    className="h-8 px-3 text-xs font-SecondaryFont font-medium border-SrcPrimaryColor/30 text-SrcPrimaryColor hover:bg-SrcPrimaryColorLight dark:hover:bg-SrcPrimaryColorDark/20 cursor-pointer"
                  >
                    <ShieldCheck size={14} className="mr-1" />
                    Role
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setDeleteDialog({ open: true, user })}
                    className="h-8 px-3 text-xs font-SecondaryFont font-medium border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Dialogs */}
      {roleDialog.user && (
        <ChangeRoleDialog
          open={roleDialog.open}
          onOpenChange={(open) => setRoleDialog({ open, user: roleDialog.user })}
          userId={roleDialog.user._id}
          userName={roleDialog.user.name}
          currentRole={roleDialog.user.role}
        />
      )}
      {deleteDialog.user && (
        <DeleteUserDialog
          open={deleteDialog.open}
          onOpenChange={(open) => setDeleteDialog({ open, user: deleteDialog.user })}
          userId={deleteDialog.user._id}
          userName={deleteDialog.user.name}
        />
      )}
    </div>
  );
};

export default UserTable;
