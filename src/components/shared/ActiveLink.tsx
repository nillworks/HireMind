"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export interface NavItem {
  id: number;
  label: string;
  href: string;
}

interface ActiveLinkProps {
  item: NavItem;
  pathname: string;
  onClick?: () => void;
}

export default function ActiveLink({ item, pathname, onClick }: ActiveLinkProps) {
  const isActive = pathname === item.href;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ease-out",
        isActive
          ? "bg-PrimaryColorLight text-PrimaryColor font-semibold"
          : "text-TextSecondary hover:bg-PrimaryColorLight/50 hover:text-TextPrimary"
      )}
    >
      {item.label}
    </Link>
  );
}
