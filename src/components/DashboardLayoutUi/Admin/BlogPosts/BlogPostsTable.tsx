"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  Trash2,
  Calendar,
  Tag,
  User,
  Shield,
  Briefcase,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import fetchClient from "@/lib/utils/fetchClient";
import type { AdminBlog } from "@/lib/api/admin/blog.types";

const roleConfig: Record<string, { label: string; className: string; icon: typeof Shield }> = {
  admin: {
    label: "Admin",
    className:
      "bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary dark:border-primary/30",
    icon: Shield,
  },
  recruiter: {
    label: "Recruiter",
    className:
      "bg-SrcPrimaryColor/10 text-SrcPrimaryColor border-SrcPrimaryColor/20 dark:bg-SrcPrimaryColor/20 dark:text-SrcPrimaryColor dark:border-SrcPrimaryColor/30",
    icon: Briefcase,
  },
  seeker: {
    label: "Seeker",
    className:
      "bg-PrimaryColor/10 text-PrimaryColor border-PrimaryColor/20 dark:bg-PrimaryColor/20 dark:text-PrimaryColor dark:border-PrimaryColor/30",
    icon: User,
  },
};

const roleFilters = ["all", "admin", "recruiter", "seeker"] as const;

const formatDate = (date?: string) =>
  date
    ? new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";

const truncateContent = (text: string, max: number) =>
  text.length > max ? text.slice(0, max) + "..." : text;

interface BlogPostsTableProps {
  blogs: AdminBlog[];
}

const BlogPostsTable = ({ blogs }: BlogPostsTableProps) => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [deleteDialog, setDeleteDialog] = useState<AdminBlog | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const filtered = (blogs || []).filter((b) => {
    const matchesSearch =
      b.title?.toLowerCase().includes(search.toLowerCase()) ||
      b.authorName?.toLowerCase().includes(search.toLowerCase());
    const matchesRole =
      roleFilter === "all" || b.authorRole === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleDelete = async () => {
    if (!deleteDialog) return;
    setLoading(`${deleteDialog._id}-delete`);
    try {
      await fetchClient(`/api/admin/blog/${deleteDialog._id}`, {
        method: "DELETE",
      });
      toast.success(`"${deleteDialog.title}" deleted`);
      setDeleteDialog(null);
      router.refresh();
    } catch {
      toast.error("Failed to delete blog post");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Search + Role Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-TextMuted">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search by title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-Border dark:border-secondary bg-white dark:bg-[#1e293b] text-sm font-SecondaryFont text-TextPrimary dark:text-surface placeholder:text-TextMuted focus:outline-none focus:ring-2 focus:ring-PrimaryColor/30 transition-all"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {roleFilters.map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-2 rounded-xl text-xs font-SecondaryFont font-medium transition-all cursor-pointer ${
                roleFilter === r
                  ? "bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor text-white shadow-md"
                  : "bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary text-TextMuted hover:text-TextPrimary dark:hover:text-surface"
              }`}
            >
              {r === "all" ? "All Roles" : r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Cards */}
      {filtered.length === 0 ? (
        <div className="px-5 py-16 text-center rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary">
          <BookOpen size={32} className="mx-auto text-TextMuted mb-3" />
          <p className="text-sm font-SecondaryFont text-TextMuted">
            {search || roleFilter !== "all"
              ? "No blog posts match your filters."
              : "No blog posts yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((blog) => {
            const role = roleConfig[blog.authorRole || "admin"] || roleConfig.admin;
            const RoleIcon = role.icon;
            const isLoading = loading?.startsWith(blog._id);

            return (
              <div
                key={blog._id}
                className="group relative rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                {/* Cover Image */}
                {blog.authorImage && blog.authorImage.startsWith("http") ? (
                  <div className="relative h-40 w-full overflow-hidden">
                    <Image
                      src={blog.authorImage}
                      alt={blog.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span
                      className={`absolute top-3 right-3 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium font-SecondaryFont ${role.className}`}
                    >
                      <RoleIcon size={11} />
                      {role.label}
                    </span>
                  </div>
                ) : (
                  <div className="relative h-40 w-full bg-gradient-to-br from-PrimaryColor/10 to-SrcPrimaryColor/10 flex items-center justify-center">
                    <BookOpen size={40} className="text-PrimaryColor/30" />
                    <span
                      className={`absolute top-3 right-3 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium font-SecondaryFont ${role.className}`}
                    >
                      <RoleIcon size={11} />
                      {role.label}
                    </span>
                  </div>
                )}

                {/* Content */}
                <div className="p-5 space-y-3">
                  <h3 className="text-sm font-semibold font-PrimaryFont text-TextPrimary dark:text-surface line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-xs font-SecondaryFont text-TextMuted leading-relaxed line-clamp-3">
                    {truncateContent(blog.content, 150)}
                  </p>

                  {/* Tags */}
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {blog.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 rounded-full bg-SrcPrimaryColor/10 border border-SrcPrimaryColor/20 px-2 py-0.5 text-[10px] font-medium font-SecondaryFont text-SrcPrimaryColor"
                        >
                          <Tag size={9} />
                          {tag}
                        </span>
                      ))}
                      {blog.tags.length > 3 && (
                        <span className="text-[10px] font-SecondaryFont text-TextMuted">
                          +{blog.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Author + Date */}
                  <div className="flex items-center justify-between pt-3 border-t border-Border/50 dark:border-secondary/50">
                    <div className="flex items-center gap-2 min-w-0">
                      {blog.authorImage && blog.authorImage.startsWith("http") ? (
                        <div className="relative size-7 shrink-0 rounded-full overflow-hidden border border-Border dark:border-secondary">
                          <Image
                            src={blog.authorImage}
                            alt={blog.authorName}
                            fill
                            className="object-cover"
                            sizes="28px"
                          />
                        </div>
                      ) : (
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-PrimaryColor to-SrcPrimaryColor">
                          <User size={12} className="text-white" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-[11px] font-SecondaryFont font-medium text-TextPrimary dark:text-surface truncate">
                          {blog.authorName || "Unknown"}
                        </p>
                        <p className="flex items-center gap-1 text-[10px] font-SecondaryFont text-TextMuted">
                          <Calendar size={9} />
                          {formatDate(blog.createdAt)}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDeleteDialog(blog)}
                      disabled={isLoading}
                      className="h-7 w-7 shrink-0 rounded-lg p-0 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </Button>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Dialog */}
      <Dialog
        open={!!deleteDialog}
        onOpenChange={(open) => !open && setDeleteDialog(null)}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="font-PrimaryFont">Delete Blog Post</DialogTitle>
            <DialogDescription className="font-SecondaryFont">
              Are you sure you want to delete{" "}
              <span className="font-medium text-TextPrimary dark:text-surface">
                {deleteDialog?.title}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog(null)}
              className="font-SecondaryFont cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={loading?.includes("delete")}
              className="font-SecondaryFont bg-red-600 hover:bg-red-700 text-white cursor-pointer"
            >
              {loading?.includes("delete") ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogPostsTable;
