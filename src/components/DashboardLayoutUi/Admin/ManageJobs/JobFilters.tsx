"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

const statusOptions = ["all", "pending", "approved", "rejected"];

interface JobFiltersProps {
  currentStatus: string;
}

const JobFilters = ({ currentStatus }: JobFiltersProps) => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(currentStatus);
  const router = useRouter();

  const handleStatusChange = (value: string) => {
    setStatus(value);
    const params = new URLSearchParams();
    if (value !== "all") params.set("status", value);
    const qs = params.toString() ? `?${params.toString()}` : "";
    router.push(`/dashboard/admin/jobs${qs}`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-TextMuted"
        />
        <input
          type="text"
          placeholder="Search jobs by title or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-Border dark:border-secondary bg-white dark:bg-[#1e293b] text-sm font-SecondaryFont text-TextPrimary dark:text-surface placeholder:text-TextMuted focus:outline-none focus:ring-2 focus:ring-PrimaryColor/30 transition-all"
        />
      </div>
      <div className="flex gap-2">
        {statusOptions.map((s) => (
          <button
            key={s}
            onClick={() => handleStatusChange(s)}
            className={`px-3 py-2 rounded-xl text-xs font-SecondaryFont font-medium transition-all cursor-pointer ${
              status === s
                ? "bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor text-white shadow-md"
                : "bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary text-TextMuted hover:text-TextPrimary dark:hover:text-surface"
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default JobFilters;
