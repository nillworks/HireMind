"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Send,
  ImagePlus,
  X,
  Tag,
  FileText,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import fetchClient from "@/lib/utils/fetchClient";
import type { AdminBlog } from "@/lib/api/admin/blog.types";

interface BlogAuthor {
  _id?: string;
  name?: string;
  email?: string;
  image?: string | null;
  role?: string | null;
}

interface AddBlogPostFormProps {
  user: BlogAuthor | null;
}

const AddBlogPostForm = ({ user }: AddBlogPostFormProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [imagePreviewError, setImagePreviewError] = useState(false);
  const tagInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const hasValidImage =
    imageUrl &&
    !imagePreviewError &&
    (imageUrl.startsWith("http://") || imageUrl.startsWith("https://"));

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed) && tags.length < 5) {
      setTags((prev) => [...prev, trimmed]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!content.trim()) {
      toast.error("Content is required");
      return;
    }

    setLoading(true);
    try {
      const result = await fetchClient<{ data: AdminBlog }>("/api/admin/blog", {
        method: "POST",
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          tags,
          authorImage: user?.image || "",
          authorRole: user?.role || "admin",
        }),
      });

      if (result) {
        toast.success("Blog post created successfully!");
        router.push("/dashboard/admin/posts");
        router.refresh();
      }
    } catch {
      toast.error("Failed to create blog post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Author Preview Card */}
      <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary p-5">
        <div className="flex items-center gap-3">
          {user?.image ? (
            <div className="relative size-11 shrink-0 rounded-full overflow-hidden border-2 border-PrimaryColor">
              <Image
                src={user.image}
                alt={user.name || "Author"}
                fill
                className="object-cover"
                sizes="44px"
              />
            </div>
          ) : (
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-PrimaryColor to-SrcPrimaryColor">
              <User size={18} className="text-white" />
            </div>
          )}
          <div>
            <p className="text-sm font-semibold font-PrimaryFont text-TextPrimary dark:text-surface">
              {user?.name || "Admin"}
            </p>
            <p className="text-xs font-SecondaryFont text-TextMuted">
              {user?.email || "admin@talentai.com"}
            </p>
          </div>
          <span className="ml-auto inline-flex items-center rounded-full bg-gradient-to-r from-PrimaryColor/10 to-SrcPrimaryColor/10 border border-PrimaryColor/20 px-3 py-1 text-[11px] font-medium font-SecondaryFont text-PrimaryColor dark:text-SrcPrimaryColor">
            Author
          </span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary p-6 space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-sm font-SecondaryFont font-medium text-TextPrimary dark:text-surface flex items-center gap-1.5"
            >
              <FileText size={14} className="text-PrimaryColor" />
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog post title..."
              className="h-11 rounded-xl border-Border dark:border-secondary bg-white dark:bg-[#0f172a] text-TextPrimary dark:text-surface font-SecondaryFont placeholder:text-TextMuted focus-visible:ring-2 focus-visible:ring-PrimaryColor/30"
            />
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label
              htmlFor="imageUrl"
              className="text-sm font-SecondaryFont font-medium text-TextPrimary dark:text-surface flex items-center gap-1.5"
            >
              <ImagePlus size={14} className="text-SrcPrimaryColor" />
              Cover Image URL
              <span className="text-TextMuted font-normal">(optional)</span>
            </Label>
            <Input
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setImagePreviewError(false);
              }}
              placeholder="https://example.com/image.jpg"
              className="h-11 rounded-xl border-Border dark:border-secondary bg-white dark:bg-[#0f172a] text-TextPrimary dark:text-surface font-SecondaryFont placeholder:text-TextMuted focus-visible:ring-2 focus-visible:ring-SrcPrimaryColor/30"
            />
            {hasValidImage && (
              <div className="relative mt-3 h-48 w-full rounded-xl overflow-hidden border border-Border dark:border-secondary">
                <Image
                  src={imageUrl}
                  alt="Cover preview"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 600px"
                  onError={() => setImagePreviewError(true)}
                />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label
              htmlFor="content"
              className="text-sm font-SecondaryFont font-medium text-TextPrimary dark:text-surface flex items-center gap-1.5"
            >
              <FileText size={14} className="text-PrimaryColor" />
              Content
            </Label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog post content here..."
              rows={10}
              className="w-full rounded-xl border border-Border dark:border-secondary bg-white dark:bg-[#0f172a] px-4 py-3 text-sm font-SecondaryFont text-TextPrimary dark:text-surface placeholder:text-TextMuted focus:outline-none focus:ring-2 focus:ring-PrimaryColor/30 resize-y transition-all"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="text-sm font-SecondaryFont font-medium text-TextPrimary dark:text-surface flex items-center gap-1.5">
              <Tag size={14} className="text-SrcPrimaryColor" />
              Tags
              <span className="text-TextMuted font-normal">(max 5)</span>
            </Label>
            <div className="flex gap-2">
              <Input
                ref={tagInputRef}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Type a tag and press Enter..."
                disabled={tags.length >= 5}
                className="h-10 flex-1 rounded-xl border-Border dark:border-secondary bg-white dark:bg-[#0f172a] text-TextPrimary dark:text-surface font-SecondaryFont placeholder:text-TextMuted focus-visible:ring-2 focus-visible:ring-SrcPrimaryColor/30"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddTag}
                disabled={!tagInput.trim() || tags.length >= 5}
                className="h-10 px-4 rounded-xl font-SecondaryFont font-medium border-Border dark:border-secondary cursor-pointer"
              >
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 rounded-full bg-SrcPrimaryColor/10 border border-SrcPrimaryColor/20 px-3 py-1 text-xs font-medium font-SecondaryFont text-SrcPrimaryColor"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="h-11 px-6 rounded-xl font-SecondaryFont font-medium border-Border dark:border-secondary cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading || !title.trim() || !content.trim()}
            className="h-11 px-6 rounded-xl font-SecondaryFont font-medium bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor text-white hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Publishing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send size={15} />
                Publish Post
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddBlogPostForm;
