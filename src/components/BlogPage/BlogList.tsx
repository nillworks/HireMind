"use client";

import { useState, useEffect } from "react";
import { Loader2, SearchX } from "lucide-react";
import { getBlogs, type Blog } from "@/lib/api/public/blogApi";
import BlogCard from "./BlogCard";

const BlogList = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const res = await getBlogs(page, 9);
        setBlogs(res.blogs);
        setTotalPages(res.totalPages);
        setTotal(res.total);
      } catch {
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [page]);

  return (
    <div>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary overflow-hidden animate-pulse"
            >
              <div className="h-44 bg-Border dark:bg-secondary" />
              <div className="p-5 space-y-3">
                <div className="h-4 w-20 bg-Border dark:bg-secondary rounded-full" />
                <div className="h-5 w-3/4 bg-Border dark:bg-secondary rounded-lg" />
                <div className="space-y-1.5">
                  <div className="h-3 w-full bg-Border dark:bg-secondary rounded" />
                  <div className="h-3 w-full bg-Border dark:bg-secondary rounded" />
                  <div className="h-3 w-2/3 bg-Border dark:bg-secondary rounded" />
                </div>
                <div className="flex gap-1.5 pt-1">
                  <div className="h-5 w-14 bg-Border dark:bg-secondary rounded-full" />
                  <div className="h-5 w-16 bg-Border dark:bg-secondary rounded-full" />
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-Border dark:border-secondary">
                  <div className="size-7 bg-Border dark:bg-secondary rounded-full" />
                  <div className="h-3 w-20 bg-Border dark:bg-secondary rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="size-16 rounded-full bg-BorderLight dark:bg-secondary/20 flex items-center justify-center">
            <SearchX size={28} className="text-TextMuted" />
          </div>
          <p className="text-lg font-semibold font-PrimaryFont text-TextPrimary dark:text-white">
            No blog posts yet
          </p>
          <p className="text-sm font-SecondaryFont text-TextMuted text-center max-w-sm">
            Check back later for new articles, tips, and insights from our community
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-xl text-sm font-semibold font-SecondaryFont border border-Border dark:border-secondary text-TextSecondary dark:text-white hover:bg-BorderLight dark:hover:bg-secondary/15 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`size-9 rounded-lg text-sm font-semibold font-SecondaryFont transition-colors cursor-pointer ${
                        page === pageNum
                          ? "bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor text-white"
                          : "text-TextMuted hover:bg-BorderLight dark:hover:bg-secondary/15"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-xl text-sm font-semibold font-SecondaryFont border border-Border dark:border-secondary text-TextSecondary dark:text-white hover:bg-BorderLight dark:hover:bg-secondary/15 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Next
              </button>
            </div>
          )}

          <p className="text-center text-xs font-SecondaryFont text-TextMuted mt-4">
            Showing {blogs.length} of {total} post{total !== 1 ? "s" : ""}
          </p>
        </>
      )}
    </div>
  );
};

export default BlogList;
