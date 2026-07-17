"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, LogIn, UserPlus, ChevronRight, Sparkles } from "lucide-react";
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
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      const timer = setTimeout(() => setIsRendered(false), 400);
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isRendered && !isOpen) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 lg:hidden",
        isOpen ? "visible" : "invisible"
      )}
    >
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-md transition-all duration-500 ease-out",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 w-[85vw] max-w-[380px] bg-Surface shadow-2xl flex flex-col transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-Border/60">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-PrimaryColor to-SrcPrimaryColor shadow-sm">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="text-base font-bold font-PrimaryFont text-TextPrimary tracking-tight">
              TalentAI
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-TextSecondary hover:text-TextPrimary hover:bg-PrimaryColorLight/50 transition-all duration-200 cursor-pointer active:scale-95"
            aria-label="Close menu"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Nav Items */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <nav className="px-5 py-6 space-y-1">
            {navItems.map((item, index) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "group flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-medium font-SecondaryFont transition-all duration-300",
                  pathname === item.href
                    ? "bg-PrimaryColorLight text-PrimaryColor shadow-sm"
                    : "text-TextSecondary hover:text-TextPrimary hover:bg-SurfaceHover"
                )}
                style={{
                  animationDelay: `${index * 60}ms`,
                  animation: isOpen ? "slideInRight 0.4s ease-out forwards" : "none",
                }}
              >
                <span>{item.label}</span>
                <ChevronRight
                  size={16}
                  className={cn(
                    "transition-all duration-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0",
                    pathname === item.href && "text-PrimaryColor opacity-100 translate-x-0"
                  )}
                />
              </Link>
            ))}
          </nav>

          {/* Bottom Auth Section */}
          <div className="px-5 pb-8 pt-4">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-SrcPrimaryColorLight/40 via-Surface to-PrimaryColorLight/30 border border-Border/50">
              {!user ? (
                <div className="space-y-3">
                  <Link
                    href={authLinks.login.href}
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3.5 rounded-xl border border-Border text-sm font-semibold font-SecondaryFont text-TextPrimary hover:bg-white/80 transition-all duration-200 active:scale-[0.98] cursor-pointer"
                  >
                    <LogIn size={17} />
                    {authLinks.login.label}
                  </Link>
                  <Link
                    href={authLinks.register.href}
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3.5 rounded-xl bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor text-white text-sm font-semibold font-SecondaryFont shadow-lg shadow-PrimaryColor/20 hover:shadow-xl hover:shadow-PrimaryColor/30 transition-all duration-200 active:scale-[0.98] cursor-pointer"
                  >
                    <UserPlus size={17} />
                    {authLinks.register.label}
                  </Link>
                </div>
              ) : (
                <div className="space-y-1">
                  <Link
                    href={userLinks.dashboard.href}
                    onClick={onClose}
                    className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium font-SecondaryFont text-TextSecondary hover:text-TextPrimary hover:bg-white/60 transition-all duration-200"
                  >
                    <span>{userLinks.dashboard.label}</span>
                    <ChevronRight size={16} className="opacity-0 group-hover:opacity-100" />
                  </Link>
                  <Link
                    href={userLinks.profile.href}
                    onClick={onClose}
                    className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium font-SecondaryFont text-TextSecondary hover:text-TextPrimary hover:bg-white/60 transition-all duration-200"
                  >
                    <span>{userLinks.profile.label}</span>
                    <ChevronRight size={16} className="opacity-0 group-hover:opacity-100" />
                  </Link>
                  <button
                    onClick={() => {
                      onClose();
                      if (userLinks.logout.onClick) userLinks.logout.onClick();
                    }}
                    className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold font-SecondaryFont text-PrimaryColor hover:bg-PrimaryColorLight/50 transition-all duration-200 cursor-pointer"
                  >
                    {userLinks.logout.label}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
