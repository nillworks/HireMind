"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Briefcase, Sparkles } from "lucide-react"
import {
  getJobs,
  getJobFilterOptions,
  type Job,
  type JobFilterOptions,
} from "@/lib/api/public/jobsApi"
import JobCard from "@/components/shared/JobCard"
import JobCardSkeleton from "./JobCardSkeleton"
import JobFilters, { type AppliedJobFilters } from "./JobFilters"

const EMPTY_OPTIONS: JobFilterOptions = {
  categories: [],
  jobTypes: [],
  locations: [],
  minSalary: 0,
  maxSalary: 0,
}

// Read a comma-separated multi-value param into a clean array.
const readMulti = (params: URLSearchParams, key: string): string[] =>
  (params.get(key) || "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean)

const AllJobsPage = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [jobs, setJobs] = useState<Job[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [options, setOptions] = useState<JobFilterOptions>(EMPTY_OPTIONS)

  // The URL is the single source of truth. Everything below derives from it,
  // so back/forward navigation and shared links "just work".
  // Use a stable string key instead of raw searchParams reference to avoid
  // unnecessary re-derives when Next.js creates a new URLSearchParams instance.
  const searchKey = useMemo(() => searchParams.toString(), [searchParams])
  const applied: AppliedJobFilters = useMemo(
    () => ({
      search: searchParams.get("search") || "",
      categories: readMulti(searchParams, "category"),
      types: readMulti(searchParams, "type"),
      locations: readMulti(searchParams, "location"),
      minSalary: searchParams.get("minSalary") || "",
      maxSalary: searchParams.get("maxSalary") || "",
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchKey]
  )
  const sortBy = useMemo(() => searchParams.get("sortBy") || "newest", [searchKey]) // eslint-disable-line react-hooks/exhaustive-deps
  const currentPage = useMemo(() => Number(searchParams.get("page")) || 1, [searchKey]) // eslint-disable-line react-hooks/exhaustive-deps

  // Filter options come from the backend once — new categories/types/locations
  // added to jobs appear automatically with no frontend change.
  useEffect(() => {
    getJobFilterOptions()
      .then(setOptions)
      .catch(() => setOptions(EMPTY_OPTIONS))
  }, [])

  // Fetch jobs for the current URL state. A monotonically increasing request id
  // guards against out-of-order responses when params change quickly. setState
  // lives inside this async callback (not the effect body) so React's
  // "no setState in effect" rule is satisfied.
  const requestId = useRef(0)
  const fetchJobs = useCallback(async () => {
    const id = ++requestId.current
    setLoading(true)
    try {
      const res = await getJobs({
        search: applied.search || undefined,
        category: applied.categories,
        type: applied.types,
        location: applied.locations,
        minSalary: applied.minSalary !== "" ? Number(applied.minSalary) : undefined,
        maxSalary: applied.maxSalary !== "" ? Number(applied.maxSalary) : undefined,
        sortBy: sortBy !== "newest" ? sortBy : undefined,
        page: currentPage,
        limit: 12,
      })
      if (id !== requestId.current) return
      setJobs(res.jobs)
      setTotal(res.total)
      setTotalPages(res.totalPages)
      setPage(res.page)
    } catch {
      if (id !== requestId.current) return
      setJobs([])
      setTotal(0)
      setTotalPages(1)
    } finally {
      if (id === requestId.current) setLoading(false)
    }
  }, [applied, sortBy, currentPage])

  // Re-fetch whenever the derived URL state changes.
  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  // Build the next URL from a partial set of params and push it. Any key set to
  // an empty string / empty array is removed, so outdated params never linger.
  const pushParams = useCallback(
    (updates: Record<string, string | string[] | undefined>) => {
      const params = new URLSearchParams(searchKey)
      for (const [key, value] of Object.entries(updates)) {
        const serialized = Array.isArray(value) ? value.join(",") : value
        if (serialized && serialized !== "All") {
          params.set(key, serialized)
        } else {
          params.delete(key)
        }
      }
      const qs = params.toString()
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [searchKey, router, pathname]
  )

  const handleApply = useCallback(
    (filters: AppliedJobFilters) => {
      pushParams({
        search: filters.search.trim(),
        category: filters.categories,
        type: filters.types,
        location: filters.locations,
        minSalary: filters.minSalary,
        maxSalary: filters.maxSalary,
        page: undefined, // reset pagination on any new search/filter
      })
    },
    [pushParams]
  )

  const handleSortChange = useCallback(
    (value: string) => pushParams({ sortBy: value, page: undefined }),
    [pushParams]
  )

  // Clear everything: strip the query string entirely and reload all jobs.
  const handleClearAll = useCallback(() => {
    router.push(pathname, { scroll: false })
  }, [router, pathname])

  const handlePageChange = useCallback(
    (newPage: number) => {
      pushParams({ page: newPage > 1 ? String(newPage) : undefined })
      window.scrollTo({ top: 0, behavior: "smooth" })
    },
    [pushParams]
  )

  return (
    <div className="min-h-screen bg-Background dark:bg-[#0f172a]">
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-PrimaryColorLight dark:bg-PrimaryColorDark/20 px-4 py-2 mb-4">
              <Briefcase className="size-4 text-PrimaryColor" />
              <span className="text-sm font-medium font-SecondaryFont text-PrimaryColor">
                Career Opportunities
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold font-PrimaryFont text-TextPrimary dark:text-white">
              Find Your{" "}
              <span className="bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor bg-clip-text text-transparent">
                Dream Job
              </span>
            </h1>
            <p className="mt-3 text-lg font-SecondaryFont text-TextSecondary dark:text-text-secondary max-w-2xl mx-auto">
              Browse through thousands of full-time and part-time jobs near you
            </p>
          </div>

          <JobFilters
            options={options}
            applied={applied}
            sortBy={sortBy}
            total={total}
            loading={loading}
            onApply={handleApply}
            onSortChange={handleSortChange}
            onClearAll={handleClearAll}
          />

          <div className="mt-8">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <JobCardSkeleton key={i} />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="flex flex-col items-center text-center py-20">
                <div className="size-16 rounded-full bg-BorderLight dark:bg-secondary/20 flex items-center justify-center mb-4">
                  <Sparkles className="size-8 text-TextMuted" />
                </div>
                <h3 className="text-lg font-semibold font-PrimaryFont text-TextPrimary dark:text-white">
                  No jobs found matching your search or filters.
                </h3>
                <p className="mt-2 text-sm font-SecondaryFont text-TextMuted max-w-sm mx-auto">
                  We couldn&apos;t find any jobs for your current search and filter
                  selection. Try broadening your filters or clearing them to see all
                  available jobs.
                </p>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="mt-6 inline-flex items-center gap-2 px-5 h-10 rounded-xl bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor hover:from-PrimaryColorHover hover:to-SrcPrimaryColorHover text-white font-SecondaryFont font-medium text-sm shadow-md transition-all cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {jobs.map((job) => (
                    <JobCard key={job._id} job={job} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className="px-4 py-2 rounded-xl font-SecondaryFont text-sm font-medium bg-Surface dark:bg-[#1e293b] border border-Border dark:border-secondary text-TextSecondary dark:text-surface hover:bg-BorderLight dark:hover:bg-secondary/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((p) => {
                        if (totalPages <= 7) return true
                        if (p === 1 || p === totalPages) return true
                        if (Math.abs(p - page) <= 1) return true
                        return false
                      })
                      .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                        if (idx > 0 && p - (arr[idx - 1] as number) > 1) {
                          acc.push("...")
                        }
                        acc.push(p)
                        return acc
                      }, [])
                      .map((p, idx) =>
                        p === "..." ? (
                          <span
                            key={`ellipsis-${idx}`}
                            className="px-2 text-TextMuted font-SecondaryFont"
                          >
                            ...
                          </span>
                        ) : (
                          <button
                            key={p}
                            onClick={() => handlePageChange(p as number)}
                            className={`size-10 rounded-xl font-SecondaryFont text-sm font-medium transition-colors cursor-pointer ${
                              page === p
                                ? "bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor text-white shadow-md"
                                : "bg-Surface dark:bg-[#1e293b] border border-Border dark:border-secondary text-TextSecondary dark:text-surface hover:bg-BorderLight dark:hover:bg-secondary/20"
                            }`}
                          >
                            {p}
                          </button>
                        )
                      )}

                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      className="px-4 py-2 rounded-xl font-SecondaryFont text-sm font-medium bg-Surface dark:bg-[#1e293b] border border-Border dark:border-secondary text-TextSecondary dark:text-surface hover:bg-BorderLight dark:hover:bg-secondary/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default AllJobsPage
