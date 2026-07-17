"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { LayoutDashboard, LogOut, User } from "lucide-react";
import VerifiedBadge from "@/components/shared/VerifiedBadge";

interface ProfileDropdownProps {
  user: {
    name?: string;
    email?: string;
    image?: string;
  };
  userLinks: {
    dashboard: { label: string; href: string };
    profile: { label: string; href: string };
    logout: { label: string; onClick?: () => void };
  };
}

export default function ProfileDropdown({ user, userLinks }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  return (
    <div
      className="relative"
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-SrcPrimaryColor/30 ring-offset-2 ring-offset-Surface shrink-0 transition-transform duration-300 hover:scale-105 hover:ring-SrcPrimaryColor/50 focus:outline-none focus:ring-SrcPrimaryColor/50 cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Open user menu"
      >
        <Image
          src={user.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=TalentAI"}
          alt="User profile picture"
          fill
          unoptimized
          sizes="36px"
          className="object-cover"
        />
      </button>

      <div
        className={`absolute right-0 top-full pt-2 w-56 origin-top-right transition-all duration-300 ease-out z-50 ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="w-full rounded-2xl bg-Surface border border-Border shadow-lg overflow-hidden">
          <div className="p-4 border-b border-Border bg-SrcPrimaryColorLight/30">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold font-SecondaryFont text-TextPrimary truncate">
                {user.name || "User"}
              </p>
              <VerifiedBadge size={12} />
            </div>
            <p className="text-xs font-SecondaryFont text-TextSecondary truncate mt-0.5">
              {user.email || "user@example.com"}
            </p>
          </div>

          <div className="p-2">
            <Link
              href={userLinks.dashboard.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium font-SecondaryFont text-TextSecondary hover:text-PrimaryColor hover:bg-PrimaryColorLight/50 transition-all duration-200"
            >
              <LayoutDashboard size={16} />
              {userLinks.dashboard.label}
            </Link>
            <Link
              href={userLinks.profile.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium font-SecondaryFont text-TextSecondary hover:text-PrimaryColor hover:bg-PrimaryColorLight/50 transition-all duration-200"
            >
              <User size={16} />
              {userLinks.profile.label}
            </Link>
          </div>

          <div className="p-2 border-t border-Border">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                if (userLinks.logout.onClick) userLinks.logout.onClick();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium font-SecondaryFont text-TextSecondary hover:text-PrimaryColor hover:bg-PrimaryColorLight/50 transition-all duration-200 cursor-pointer"
            >
              <LogOut size={16} />
              {userLinks.logout.label}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
