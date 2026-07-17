"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X, LogIn, UserPlus } from "lucide-react";
import ActiveLink, { type NavItem } from "@/components/shared/ActiveLink";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
  navItems: NavItem[];
  authLinks: {
    login: { label: string; href: string };
    register: { label: string; href: string };
  };
  userLinks: {
    dashboard: { label: string; href: string };
    profile: { label: string; href: string };
    logout: { label: string; onClick?: () => void };
  };
  user: unknown;
}

export default function MobileMenu({
  isOpen,
  onClose,
  pathname,
  navItems,
  authLinks,
  userLinks,
  user,
}: MobileMenuProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 lg:hidden transition-all duration-300",
        isOpen ? "visible" : "invisible delay-300"
      )}
    >
      <div
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={cn(
          "fixed inset-y-0 right-0 w-[280px] sm:w-[320px] bg-Surface shadow-2xl border-l border-Border flex flex-col transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-Border">
          <span className="text-lg font-bold font-PrimaryFont text-TextPrimary">
            Menu
          </span>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-TextSecondary hover:text-TextPrimary hover:bg-PrimaryColorLight/50 transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6 flex flex-col gap-8">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <ActiveLink
                key={item.id}
                item={item}
                pathname={pathname}
                onClick={onClose}
              />
            ))}
          </nav>

          <div className="mt-auto pt-8 border-t border-Border">
            {!user ? (
              <div className="flex flex-col gap-3">
                <Link
                  href={authLinks.login.href}
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border border-Border text-sm font-semibold font-SecondaryFont text-TextPrimary hover:bg-PrimaryColorLight/50 transition-colors cursor-pointer"
                >
                  <LogIn size={18} />
                  {authLinks.login.label}
                </Link>
                <Link
                  href={authLinks.register.href}
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-PrimaryColor text-white text-sm font-semibold font-SecondaryFont hover:bg-PrimaryColorHover transition-colors shadow-sm cursor-pointer"
                >
                  <UserPlus size={18} />
                  {authLinks.register.label}
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href={userLinks.dashboard.href}
                  onClick={onClose}
                  className="block px-4 py-3 rounded-xl text-sm font-medium font-SecondaryFont text-TextSecondary hover:bg-PrimaryColorLight/50 hover:text-TextPrimary transition-colors"
                >
                  {userLinks.dashboard.label}
                </Link>
                <Link
                  href={userLinks.profile.href}
                  onClick={onClose}
                  className="block px-4 py-3 rounded-xl text-sm font-medium font-SecondaryFont text-TextSecondary hover:bg-PrimaryColorLight/50 hover:text-TextPrimary transition-colors"
                >
                  {userLinks.profile.label}
                </Link>
                <button
                  onClick={() => {
                    onClose();
                    if (userLinks.logout.onClick) userLinks.logout.onClick();
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium font-SecondaryFont text-PrimaryColor hover:bg-PrimaryColorLight/50 transition-colors cursor-pointer"
                >
                  {userLinks.logout.label}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
