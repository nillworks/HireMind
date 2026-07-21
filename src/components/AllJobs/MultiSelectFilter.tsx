"use client"

import { ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface MultiSelectFilterProps {
  label: string
  options: string[]
  selected: string[]
  onChange: (selected: string[]) => void
}

const MultiSelectFilter = ({
  label,
  options,
  selected,
  onChange,
}: MultiSelectFilterProps) => {
  const toggle = (option: string, checked: boolean) => {
    if (checked) {
      onChange([...selected, option])
    } else {
      onChange(selected.filter((v) => v !== option))
    }
  }

  const count = selected.length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={options.length === 0}
        className="inline-flex items-center justify-between gap-2 w-full sm:w-[160px] h-10 px-3 rounded-xl border border-Border bg-Surface dark:bg-[#1e293b] dark:border-secondary font-SecondaryFont text-sm text-TextSecondary dark:text-surface cursor-pointer outline-none focus:border-PrimaryColor focus:ring-2 focus:ring-PrimaryColor/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="flex items-center gap-2 truncate">
          {label}
          {count > 0 && (
            <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-PrimaryColor text-white text-xs font-medium font-SecondaryFont">
              {count}
            </span>
          )}
        </span>
        <ChevronDown className="size-4 shrink-0 text-TextMuted" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-h-72 w-(--anchor-width) min-w-[160px] bg-Surface dark:bg-[#1e293b] border-Border dark:border-secondary">
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option}
            checked={selected.includes(option)}
            onCheckedChange={(checked) => toggle(option, checked)}
            className="font-SecondaryFont text-sm text-TextSecondary dark:text-surface cursor-pointer capitalize"
          >
            {option}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default MultiSelectFilter
