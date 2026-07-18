"use client"

import { useState, useCallback, useEffect } from "react"
import { Briefcase, Sparkles } from "lucide-react"
import { getJobs, type JobsQuery } from "@/lib/api/public/jobsApi"
import JobCard from "./JobCard"
import JobCardSkeleton from "./JobCardSkeleton"
import JobFilters from "./JobFilters"

const AllJobsPage = () => {
  const [jobs, setJobs] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  const [filters, setFilters] = useState({
    search: "",
    category: "All",
    type: "All",
    sortBy: "newest",
  })

  const fetchJobs = useCallback(async (query: JobsQuery) => {
    setLoading(true)
    try {
      const res = await getJobs(query)
      setJobs(res.jobs)
      setTotal(res.total)
      setTotalPages(res.totalPages)
      setPage(res.page)
    } catch {
      setJobs([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchJobs({
      search: filters.search || undefined,
      category: filters.category !== "All" ? filters.category : undefined,
      type: filters.type !== "All" ? filters.type : undefined,
      sortBy: filters.sortBy !== "newest" ? filters.sortBy : undefined,
      page: 1,
      limit: 12,
    })
  }, [filters, fetchJobs])

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }, [])

  const handleReset = useCallback(() => {
    setFilters({
      search: "",
      category: "All",
      type: "All",
      sortBy: "newest",
    })
    setPage(1)
  }, [])

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage)
      fetchJobs({
        search: filters.search || undefined,
        category: filters.category !== "All" ? filters.category : undefined,
        type: filters.type !== "All" ? filters.type : undefined,
        sortBy: filters.sortBy !== "newest" ? filters.sortBy : undefined,
        page: newPage,
        limit: 12,
      })
      window.scrollTo({ top: 0, behavior: "smooth" })
    },
    [filters, fetchJobs]
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
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
            total={total}
          />

          <div className="mt-8">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <JobCardSkeleton key={i} />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-20">
                <div className="size-16 rounded-full bg-BorderLight dark:bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="size-8 text-TextMuted" />
                </div>
                <h3 className="text-lg font-semibold font-PrimaryFont text-TextPrimary dark:text-white">
                  No jobs found
                </h3>
                <p className="mt-2 text-sm font-SecondaryFont text-TextMuted max-w-sm mx-auto">
                  Try adjusting your filters or search terms to find what
                  you&apos;re looking for.
                </p>
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
