"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import {
  Search,
  SlidersHorizontal,
  X,
  Briefcase,
  Building2,
  Tag,
  MapPin,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  type JobFilterOptions,
  type Suggestion,
  getJobSuggestions,
} from "@/lib/api/public/jobsApi"
import { useDebounce } from "@/hooks/useDebounce"
import MultiSelectFilter from "./MultiSelectFilter"

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "salary_high", label: "Highest Salary" },
  { value: "applications", label: "Most Applied" },
]

// The applied filter state, derived from (and kept in sync with) the URL.
// Salary bounds are strings so the number inputs stay controlled and an empty
// string cleanly represents "no bound set".
export interface AppliedJobFilters {
  search: string
  categories: string[]
  types: string[]
  locations: string[]
  minSalary: string
  maxSalary: string
}

interface JobFiltersProps {
  options: JobFilterOptions
  applied: AppliedJobFilters
  sortBy: string
  total: number
  loading: boolean
  onApply: (filters: AppliedJobFilters) => void
  onSortChange: (sortBy: string) => void
  onClearAll: () => void
}

const JobFilters = ({
  options,
  applied,
  sortBy,
  total,
  loading,
  onApply,
  onSortChange,
  onClearAll,
}: JobFiltersProps) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [draft, setDraft] = useState<AppliedJobFilters>(applied)
  // Track the applied (URL) state we last synced from. When it changes — e.g.
  // browser back/forward, a shared link, or Clear Filters — reset the draft
  // during render so the inputs reflect it, without a setState-in-effect.
  const [syncedApplied, setSyncedApplied] = useState(applied)
  if (syncedApplied !== applied) {
    setSyncedApplied(applied)
    setDraft(applied)
  }

  const [dropdown, setDropdown] = useState({ suggestions: [] as Suggestion[], isOpen: false, loading: false });
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debouncedSearch = useDebounce(draft.search, 300);
  const inputRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debouncedSearch.length < 2) {
      setDropdown({ suggestions: [], isOpen: false, loading: false });
      return;
    }
    let active = true;
    (async () => {
      setDropdown((prev) => ({ ...prev, loading: true }));
      const data = await getJobSuggestions(debouncedSearch);
      if (!active) return;
      setDropdown({ suggestions: data, isOpen: true, loading: false });
      setSelectedIndex(-1);
    })();
    return () => { active = false; };
  }, [debouncedSearch]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setDropdown((prev) => ({ ...prev, isOpen: false }));
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selectSuggestion = useCallback((text: string) => {
    setDraft((prev) => ({ ...prev, search: text }));
    setDropdown({ suggestions: [], isOpen: false, loading: false });
    setSelectedIndex(-1);
  }, []);

  const setDraftValue = <K extends keyof AppliedJobFilters>(
    key: K,
    value: AppliedJobFilters[K]
  ) => setDraft((prev) => ({ ...prev, [key]: value }))

  const hasActiveFilters =
    applied.search.trim() !== "" ||
    applied.categories.length > 0 ||
    applied.types.length > 0 ||
    applied.locations.length > 0 ||
    applied.minSalary !== "" ||
    applied.maxSalary !== "" ||
    sortBy !== "newest"

  // Removing a chip acts on the applied (committed) state and re-applies
  // immediately, so the URL and results stay in sync without a button press.
  const removeValue = (key: "categories" | "types" | "locations", value: string) => {
    onApply({ ...applied, [key]: applied[key].filter((v) => v !== value) })
  }

  const clearSalary = () => {
    onApply({ ...applied, minSalary: "", maxSalary: "" })
  }

  const clearSearch = () => {
    onApply({ ...applied, search: "" })
  }

  const filterControls = (
    <>
      <MultiSelectFilter
        label="Category"
        options={options.categories}
        selected={draft.categories}
        onChange={(value) => setDraftValue("categories", value)}
      />
      <MultiSelectFilter
        label="Job Type"
        options={options.jobTypes}
        selected={draft.types}
        onChange={(value) => setDraftValue("types", value)}
      />
      <MultiSelectFilter
        label="Location"
        options={options.locations}
        selected={draft.locations}
        onChange={(value) => setDraftValue("locations", value)}
      />

      <div className="flex items-center gap-2">
        <Input
          type="number"
          min={0}
          placeholder="Min $"
          value={draft.minSalary}
          onChange={(e) => setDraftValue("minSalary", e.target.value)}
          className="w-full sm:w-[100px] h-10 rounded-xl border-Border bg-Surface dark:bg-[#1e293b] dark:border-secondary font-SecondaryFont text-sm text-TextPrimary dark:text-surface placeholder:text-TextMuted"
        />
        <span className="text-TextMuted">–</span>
        <Input
          type="number"
          min={0}
          placeholder="Max $"
          value={draft.maxSalary}
          onChange={(e) => setDraftValue("maxSalary", e.target.value)}
          className="w-full sm:w-[100px] h-10 rounded-xl border-Border bg-Surface dark:bg-[#1e293b] dark:border-secondary font-SecondaryFont text-sm text-TextPrimary dark:text-surface placeholder:text-TextMuted"
        />
      </div>

      <Button
        type="button"
        size="sm"
        onClick={() => onApply(draft)}
        disabled={loading}
        className="h-10 px-5 rounded-xl bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor hover:from-PrimaryColorHover hover:to-SrcPrimaryColorHover text-white font-SecondaryFont font-medium shadow-md cursor-pointer"
      >
        <SlidersHorizontal className="size-4 mr-1.5" />
        Apply Filters
      </Button>

      <Select value={sortBy} onValueChange={(value) => value && onSortChange(value)}>
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
      {/* Search row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1" ref={inputRef}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-TextMuted z-10" />
          <Input
            type="text"
            placeholder="Search jobs by title or company..."
            value={draft.search}
            onChange={(e) => setDraftValue("search", e.target.value)}
            onFocus={() => { if (dropdown.suggestions.length > 0) setDropdown((prev) => ({ ...prev, isOpen: true })); }}
            onKeyDown={(e) => {
              const { isOpen, suggestions } = dropdown;
              if (isOpen && suggestions.length > 0) {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
                  return;
                }
                if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
                  return;
                }
                if (e.key === "Enter" && selectedIndex >= 0) {
                  e.preventDefault();
                  selectSuggestion(suggestions[selectedIndex].text);
                  return;
                }
                if (e.key === "Escape") {
                  setDropdown((prev) => ({ ...prev, isOpen: false }));
                  return;
                }
              }
              if (e.key === "Enter") {
                e.preventDefault();
                onApply(draft);
              }
            }}
            className="pl-10 pr-9 h-10 rounded-xl border-Border bg-Surface dark:bg-[#1e293b] dark:border-secondary font-SecondaryFont text-sm text-TextPrimary dark:text-surface placeholder:text-TextMuted"
          />
          {dropdown.loading && (
            <Loader2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-TextMuted animate-spin" />
          )}
          {!dropdown.loading && draft.search && (
            <button
              type="button"
              onClick={() => {
                setDraftValue("search", "")
                if (applied.search) clearSearch()
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-TextMuted hover:text-PrimaryColor transition-colors cursor-pointer"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
          {dropdown.isOpen && debouncedSearch.length >= 2 && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 right-0 top-full mt-1.5 bg-Surface border border-Border rounded-xl shadow-lg z-50 max-h-72 overflow-y-auto"
            >
              {dropdown.suggestions.length > 0 ? (
                (["title", "company", "category", "location"] as const).map((type) => {
                  const items = dropdown.suggestions.filter((s) => s.type === type);
                  if (items.length === 0) return null;
                  return (
                    <div key={type}>
                      <div className="px-3 py-2 text-[10px] font-semibold font-SecondaryFont text-TextMuted tracking-wider uppercase bg-BorderLight/50">
                        {type === "title" ? "Job Titles" :
                         type === "company" ? "Companies" :
                         type === "category" ? "Categories" : "Locations"}
                      </div>
                      {items.map((s) => {
                        const globalIdx = dropdown.suggestions.indexOf(s);
                        const isSelected = globalIdx === selectedIndex;
                        const isPrimary = (globalIdx % 2 === 0);
                        return (
                          <button
                            key={`${type}-${s.text}`}
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              selectSuggestion(s.text);
                              onApply({ ...draft, search: s.text });
                            }}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm font-SecondaryFont transition-colors ${
                              isSelected
                                ? "bg-PrimaryColorLight/40 text-PrimaryColor"
                                : isPrimary
                                  ? "hover:bg-PrimaryColorLight/20 text-TextPrimary"
                                  : "hover:bg-SrcPrimaryColorLight/20 text-TextPrimary"
                            }`}
                          >
                            <span className={`shrink-0 ${
                              type === "title" ? "text-PrimaryColor" :
                              type === "company" ? "text-SrcPrimaryColor" :
                              type === "category" ? "text-PrimaryColor" :
                              "text-SrcPrimaryColor"
                            }`}>
                              {type === "title" && <Briefcase size={14} />}
                              {type === "company" && <Building2 size={14} />}
                              {type === "category" && <Tag size={14} />}
                              {type === "location" && <MapPin size={14} />}
                            </span>
                            <span className="truncate">{s.text}</span>
                          </button>
                        );
                      })}
                    </div>
                  );
                })
              ) : !dropdown.loading ? (
                <div className="px-3 py-4 text-sm text-TextMuted font-SecondaryFont text-center">
                  No suggestions found
                </div>
              ) : null}
            </motion.div>
          )}
        </div>

        <Button
          type="button"
          onClick={() => onApply(draft)}
          disabled={loading}
          className="h-10 px-6 rounded-xl bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor hover:from-PrimaryColorHover hover:to-SrcPrimaryColorHover text-white font-SecondaryFont font-semibold shadow-md cursor-pointer"
        >
          <Search className="size-4 mr-1.5" />
          Search
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="sm:hidden h-10 rounded-xl border-Border bg-Surface dark:bg-[#1e293b] dark:border-secondary font-SecondaryFont cursor-pointer"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
        >
          <SlidersHorizontal className="size-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Filter controls — desktop */}
      <div className="hidden sm:flex items-center gap-3 flex-wrap">
        {filterControls}

        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClearAll}
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

      {/* Filter controls — mobile */}
      {showMobileFilters && (
        <div className="sm:hidden flex flex-col gap-3 p-4 rounded-xl bg-BorderLight dark:bg-[#0f172a] border border-Border dark:border-secondary">
          {filterControls}

          <div className="flex items-center justify-between pt-1">
            <span className="text-sm font-SecondaryFont text-TextMuted">
              {total} job{total !== 1 ? "s" : ""} found
            </span>
            {hasActiveFilters && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="text-PrimaryColor hover:text-PrimaryColorHover font-SecondaryFont cursor-pointer"
              >
                <X className="size-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Active filter chips */}
      {(applied.categories.length > 0 ||
        applied.types.length > 0 ||
        applied.locations.length > 0 ||
        applied.minSalary !== "" ||
        applied.maxSalary !== "") && (
        <div className="flex items-center gap-2 flex-wrap">
          {applied.categories.map((value) => (
            <FilterChip key={`cat-${value}`} label={value} onRemove={() => removeValue("categories", value)} />
          ))}
          {applied.types.map((value) => (
            <FilterChip key={`type-${value}`} label={value} onRemove={() => removeValue("types", value)} />
          ))}
          {applied.locations.map((value) => (
            <FilterChip key={`loc-${value}`} label={value} onRemove={() => removeValue("locations", value)} />
          ))}
          {(applied.minSalary !== "" || applied.maxSalary !== "") && (
            <FilterChip
              label={`$${applied.minSalary || "0"} – $${applied.maxSalary || "∞"}`}
              onRemove={clearSalary}
            />
          )}
        </div>
      )}
    </div>
  )
}

const FilterChip = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full bg-PrimaryColorLight dark:bg-PrimaryColorDark/20 px-3 py-1 text-xs font-medium font-SecondaryFont text-PrimaryColor capitalize">
    {label}
    <button
      type="button"
      onClick={onRemove}
      className="hover:text-PrimaryColorHover transition-colors cursor-pointer"
      aria-label={`Remove ${label} filter`}
    >
      <X className="size-3" />
    </button>
  </span>
)

export default JobFilters
