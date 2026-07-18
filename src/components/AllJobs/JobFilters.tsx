"use client"

import { useState, useCallback } from "react"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const CATEGORIES = [
  "All",
  "Technology",
  "Design",
  "Marketing",
  "Finance",
  "Education",
  "Healthcare",
  "Engineering",
  "Sales",
  "Human Resources",
]

const JOB_TYPES = ["All", "Full-Time", "Part-Time", "Contract", "Internship"]

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "salary_high", label: "Highest Salary" },
  { value: "applications", label: "Most Applied" },
]

interface JobFiltersProps {
  filters: {
    search: string
    category: string
    type: string
    sortBy: string
  }
  onFilterChange: (key: string, value: string) => void
  onReset: () => void
  total: number
}

const JobFilters = ({ filters, onFilterChange, onReset, total }: JobFiltersProps) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const hasActiveFilters =
    filters.category !== "All" ||
    filters.type !== "All" ||
    filters.sortBy !== "newest"

  const filterContent = (
    <>
      <Select
        value={filters.category}
        onValueChange={(value) => value && onFilterChange("category", value)}
      >
        <SelectTrigger className="w-full sm:w-[160px] h-10 rounded-xl border-Border bg-Surface dark:bg-[#1e293b] dark:border-secondary font-SecondaryFont text-sm text-TextSecondary dark:text-surface cursor-pointer">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent className="bg-Surface dark:bg-[#1e293b] border-Border dark:border-secondary rounded-xl">
          {CATEGORIES.map((cat) => (
            <SelectItem
              key={cat}
              value={cat}
              className="font-SecondaryFont text-sm cursor-pointer"
            >
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.type}
        onValueChange={(value) => value && onFilterChange("type", value)}
      >
        <SelectTrigger className="w-full sm:w-[160px] h-10 rounded-xl border-Border bg-Surface dark:bg-[#1e293b] dark:border-secondary font-SecondaryFont text-sm text-TextSecondary dark:text-surface cursor-pointer">
          <SelectValue placeholder="Job Type" />
        </SelectTrigger>
        <SelectContent className="bg-Surface dark:bg-[#1e293b] border-Border dark:border-secondary rounded-xl">
          {JOB_TYPES.map((type) => (
            <SelectItem
              key={type}
              value={type}
              className="font-SecondaryFont text-sm cursor-pointer"
            >
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.sortBy}
        onValueChange={(value) => value && onFilterChange("sortBy", value)}
      >
        <SelectTrigger className="w-full sm:w-[160px] h-10 rounded-xl border-Border bg-Surface dark:bg-[#1e293b] dark:border-secondary font-SecondaryFont text-sm text-TextSecondary dark:text-surface cursor-pointer">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent className="bg-Surface dark:bg-[#1e293b] border-Border dark:border-secondary rounded-xl">
          {SORT_OPTIONS.map((opt) => (
            <SelectItem
              key={opt.value}
              value={opt.value}
              className="font-SecondaryFont text-sm cursor-pointer"
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-TextMuted" />
          <Input
            type="text"
            placeholder="Search jobs by title or company..."
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            className="pl-10 h-10 rounded-xl border-Border bg-Surface dark:bg-[#1e293b] dark:border-secondary font-SecondaryFont text-sm text-TextPrimary dark:text-surface placeholder:text-TextMuted"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange("search", "")}
              className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-TextMuted hover:text-PrimaryColor transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="sm:hidden h-10 rounded-xl border-Border bg-Surface dark:bg-[#1e293b] dark:border-secondary font-SecondaryFont cursor-pointer"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
        >
          <SlidersHorizontal className="size-4 mr-2" />
          Filters
        </Button>
      </div>

      <div className="hidden sm:flex items-center gap-3 flex-wrap">
        {filterContent}

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-PrimaryColor hover:text-PrimaryColorHover font-SecondaryFont cursor-pointer"
          >
            <X className="size-4 mr-1" />
            Clear filters
          </Button>
        )}

        <span className="ml-auto text-sm font-SecondaryFont text-TextMuted">
          {total} job{total !== 1 ? "s" : ""} found
        </span>
      </div>

      {showMobileFilters && (
        <div className="sm:hidden space-y-3 p-4 rounded-xl bg-BorderLight dark:bg-[#0f172a] border border-Border dark:border-secondary">
          {filterContent}

          <div className="flex items-center justify-between pt-2">
            <span className="text-sm font-SecondaryFont text-TextMuted">
              {total} job{total !== 1 ? "s" : ""} found
            </span>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                className="text-PrimaryColor hover:text-PrimaryColorHover font-SecondaryFont cursor-pointer"
              >
                <X className="size-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default JobFilters
