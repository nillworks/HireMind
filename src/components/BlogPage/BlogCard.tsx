import Link from "next/link";
import { Calendar, Tag, ChevronRight } from "lucide-react";
import type { Blog } from "@/lib/api/public/blogApi";

const roleColor: Record<string, string> = {
  admin: "bg-PrimaryColorLight dark:bg-PrimaryColorDark/20 text-PrimaryColor",
  recruiter: "bg-SrcPrimaryColorLight dark:bg-SrcPrimaryColorDark/20 text-SrcPrimaryColor",
  seeker: "bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
};

interface BlogCardProps {
  blog: Blog;
}

const BlogCard = ({ blog }: BlogCardProps) => {
  const excerpt =
    blog.content.length > 180
      ? blog.content.slice(0, 180).trim() + "..."
      : blog.content;

  return (
    <Link
      href={`/blog/${blog._id}`}
      className="group relative flex flex-col rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
    >
      {blog.authorImage && (
        <div className="h-44 overflow-hidden">
          <img
            src={blog.authorImage}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}

      {!blog.authorImage && (
        <div className="h-44 bg-gradient-to-br from-PrimaryColor/10 to-SrcPrimaryColor/10 flex items-center justify-center">
          <span className="text-5xl font-bold font-PrimaryFont text-PrimaryColor/20">
            {blog.title.charAt(0)}
          </span>
        </div>
      )}

      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-2 mb-3">
          {blog.authorRole && (
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold font-SecondaryFont uppercase tracking-wider ${
                roleColor[blog.authorRole] || "bg-BorderLight dark:bg-secondary/20 text-TextMuted"
              }`}
            >
              {blog.authorRole}
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-xs font-SecondaryFont text-TextMuted">
            <Calendar size={10} />
            {new Date(blog.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        <h3 className="text-base font-bold font-PrimaryFont text-TextPrimary dark:text-white mb-2 line-clamp-2 group-hover:text-PrimaryColor transition-colors">
          {blog.title}
        </h3>

        <p className="text-sm font-SecondaryFont text-TextSecondary dark:text-text-secondary line-clamp-3 mb-4 flex-1">
          {excerpt}
        </p>

        {blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {blog.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-BorderLight dark:bg-secondary/20 px-2 py-0.5 text-[10px] font-medium font-SecondaryFont text-TextMuted"
              >
                <Tag size={8} />
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

        <div className="flex items-center justify-between pt-3 border-t border-Border dark:border-secondary">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-full overflow-hidden bg-gradient-to-br from-PrimaryColor/20 to-SrcPrimaryColor/20 flex items-center justify-center shrink-0">
              {blog.authorImage ? (
                <img
                  src={blog.authorImage}
                  alt={blog.authorName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs font-bold font-PrimaryFont text-PrimaryColor">
                  {blog.authorName?.charAt(0) || "?"}
                </span>
              )}
            </div>
            <span className="text-xs font-SecondaryFont font-medium text-TextPrimary dark:text-white">
              {blog.authorName}
            </span>
          </div>
          <ChevronRight
            size={14}
            className="text-TextMuted group-hover:text-PrimaryColor group-hover:translate-x-1 transition-all duration-200"
          />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
    </Link>
  );
};

export default BlogCard;
