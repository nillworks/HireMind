"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import ActiveLink, { type NavItem } from "@/components/shared/ActiveLink";
import MobileMenu from "@/components/shared/MobileMenu";
import ProfileDropdown from "@/components/shared/ProfileDropDown";
import VerifiedBadge from "@/components/shared/VerifiedBadge";
import { signOut, useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import CustomToast from "@/components/shared/CustomToast";

const LOGGED_OUT_NAV: NavItem[] = [
  { id: 1, label: "Home", href: "/" },
  { id: 2, label: "Browse Jobs", href: "/jobs" },
  { id: 3, label: "About", href: "/about" },
];

const LOGGED_IN_NAV: NavItem[] = [
  { id: 1, label: "Home", href: "/" },
  { id: 2, label: "Browse Jobs", href: "/jobs" },
  { id: 3, label: "Blog", href: "/blog" },
  { id: 4, label: "Company", href: "/company" },
  // { id: 3, label: "Saved Jobs", href: "/saved-jobs" },
  // { id: 4, label: "My Applications", href: "/my-applications" },
  // { id: 5, label: "AI Tools", href: "/ai-tools" },
];

const AUTH_LINKS = {
  login: { label: "Login", href: "/login" },
  register: { label: "Register", href: "/regester" },
};

export default function NavigationMenu() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
const user = session?.user;
console.log(user);

  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  const dashboardHref: Record<string, string> = {
    seeker: `/dashboard/seeker`,
    recruiter: `/dashboard/recruiter`,
    admin: `/dashboard/admin`,
  };

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Signed out successfully");
          router.push("/login");
          router.refresh();
        },
      },
    });
  };

  const dynamicUserLinks = {
    dashboard: {
      label: "Dashboard",
      href: dashboardHref[(user?.role as string)?.toLowerCase()] || "/dashboard",
    },
    profile: {
      label: "Profile",
      href: `/dashboard/${(user?.role as string)?.toLowerCase() || "seeker"}/profile`,
    },
    logout: { label: "Logout", onClick: handleSignOut },
  };

  const currentNavItems = user ? LOGGED_IN_NAV : LOGGED_OUT_NAV;

  return (
    <>
      <header className="sticky top-0 z-30 w-full bg-Surface/80 backdrop-blur-xl border-b border-Border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <Link
              href="/"
              className="flex items-center gap-2.5 shrink-0 group"
              aria-label="TalentAI - Go to Home"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-PrimaryColor to-SrcPrimaryColor transition-all duration-300 group-hover:scale-105 group-hover:-rotate-3 shadow-sm group-active:scale-95">
                <Sparkles size={20} className="text-white transition-transform duration-300 group-hover:scale-110" />
              </div>
              <span className="text-lg font-bold font-PrimaryFont tracking-tight text-TextPrimary group-hover:text-PrimaryColor transition-colors duration-200">
                TalentAI
              </span>
              <VerifiedBadge size={12} />
            </Link>

            <nav
              className="hidden lg:flex items-center gap-1"
              aria-label="Primary navigation"
            >
              {currentNavItems.map((item) => (
                <ActiveLink key={item.id} item={item} pathname={pathname} />
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <div className="hidden md:block">
                {user ? (
                  <ProfileDropdown user={user as { name?: string; email?: string; image?: string }} userLinks={dynamicUserLinks} />
                ) : (
                  <div className="flex items-center gap-3">
                    <Link
                      href={AUTH_LINKS.login.href}
                      className="inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-semibold font-SecondaryFont text-TextSecondary hover:text-PrimaryColor transition-colors"
                    >
                      {AUTH_LINKS.login.label}
                    </Link>
                    <Link
                      href={AUTH_LINKS.register.href}
                      className={cn(
                        "inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold font-SecondaryFont transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
                        "bg-SrcPrimaryColor text-white hover:bg-SrcPrimaryColorHover"
                      )}
                    >
                      {AUTH_LINKS.register.label}
                    </Link>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsMobileOpen(true)}
                aria-label="Open navigation menu"
                aria-expanded={isMobileOpen}
                aria-controls="mobile-drawer"
                className="lg:hidden p-2 rounded-xl border border-Border text-TextSecondary hover:text-PrimaryColor hover:bg-PrimaryColorLight/50 transition-colors duration-200 cursor-pointer"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        pathname={pathname}
        navItems={currentNavItems}
        authLinks={AUTH_LINKS}
        userLinks={dynamicUserLinks}
        user={user}
      />
      <CustomToast />
    </>
  );
}
