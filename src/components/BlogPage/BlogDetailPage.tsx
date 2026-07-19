"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Tag,
  Loader2,
  UserX,
  Share2,
} from "lucide-react";
import { getBlogById, type Blog } from "@/lib/api/public/blogApi";

const roleColor: Record<string, string> = {
  admin: "bg-PrimaryColorLight dark:bg-PrimaryColorDark/20 text-PrimaryColor",
  recruiter: "bg-SrcPrimaryColorLight dark:bg-SrcPrimaryColorDark/20 text-SrcPrimaryColor",
  seeker: "bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
};

const BlogDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const data = await getBlogById(params.id as string);
        setBlog(data);
      } catch {
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-24 bg-Border dark:bg-secondary rounded-lg" />
          <div className="h-10 w-3/4 bg-Border dark:bg-secondary rounded-lg" />
          <div className="flex items-center gap-4">
            <div className="size-10 bg-Border dark:bg-secondary rounded-full" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-Border dark:bg-secondary rounded" />
              <div className="h-3 w-48 bg-Border dark:bg-secondary rounded" />
            </div>
          </div>
          <div className="h-64 bg-Border dark:bg-secondary rounded-2xl" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-4 bg-Border dark:bg-secondary rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="size-16 rounded-full bg-BorderLight dark:bg-secondary/20 flex items-center justify-center">
            <UserX size={28} className="text-TextMuted" />
          </div>
          <p className="text-lg font-semibold font-PrimaryFont text-TextPrimary dark:text-white">
            Blog post not found
          </p>
          <p className="text-sm font-SecondaryFont text-TextMuted">
            This article may have been removed or doesn&apos;t exist.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor px-5 py-2.5 text-sm font-semibold font-SecondaryFont text-white hover:opacity-90 transition-opacity mt-2"
          >
            <ArrowLeft size={16} />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const paragraphs = blog.content.split("\n").filter((p) => p.trim());

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm font-SecondaryFont font-medium text-TextMuted hover:text-PrimaryColor transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        Back to Blog
      </Link>

      <article>
        <h1 className="text-3xl md:text-4xl font-bold font-PrimaryFont text-TextPrimary dark:text-white mb-4">
          {blog.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full overflow-hidden bg-gradient-to-br from-PrimaryColor/20 to-SrcPrimaryColor/20 flex items-center justify-center shrink-0">
              {blog.authorImage ? (
                <img
                  src={blog.authorImage}
                  alt={blog.authorName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm font-bold font-PrimaryFont text-PrimaryColor">
                  {blog.authorName?.charAt(0) || "?"}
                </span>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold font-PrimaryFont text-TextPrimary dark:text-white">
                {blog.authorName}
              </p>
              <div className="flex items-center gap-2">
                {blog.authorRole && (
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-semibold font-SecondaryFont uppercase tracking-wider ${
                      roleColor[blog.authorRole] || "bg-BorderLight dark:bg-secondary/20 text-TextMuted"
                    }`}
                  >
                    {blog.authorRole}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-xs font-SecondaryFont text-TextMuted">
                  <Calendar size={10} />
                  {new Date(blog.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {blog.authorImage && (
          <div className="rounded-2xl overflow-hidden mb-8">
            <img
              src={blog.authorImage}
              alt={blog.title}
              className="w-full h-64 md:h-80 object-cover"
            />
          </div>
        )}

        {blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-BorderLight dark:bg-secondary/20 px-3 py-1 text-xs font-medium font-SecondaryFont text-TextMuted"
              >
                <Tag size={10} />
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="prose prose-lg max-w-none mb-8">
          {paragraphs.map((paragraph, idx) => (
            <p
              key={idx}
              className="text-base font-SecondaryFont text-TextSecondary dark:text-text-secondary leading-relaxed mb-4"
            >
              {paragraph}
            </p>
          ))}
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-Border dark:border-secondary">
          <p className="text-xs font-SecondaryFont text-TextMuted">
            {blog.updatedAt
              ? `Last updated ${new Date(blog.updatedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}`
              : `Published ${new Date(blog.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}`}
          </p>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: blog.title, url: window.location.href });
              } else {
                navigator.clipboard.writeText(window.location.href);
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs font-SecondaryFont font-medium text-TextMuted hover:text-PrimaryColor transition-colors cursor-pointer"
          >
            <Share2 size={12} />
            Share
          </button>
        </div>
      </article>
    </div>
  );
};

export default BlogDetailPage;
