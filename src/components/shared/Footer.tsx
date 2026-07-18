"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Mail, MapPin, Phone } from "lucide-react";
import { FaLinkedin, FaTwitter } from "react-icons/fa";
import { SiGithub } from "react-icons/si";
import VerifiedBadge from "@/components/shared/VerifiedBadge";

const footerLinks = {
  platform: [
    { label: "Home", href: "/" },
    { label: "Browse Jobs", href: "/jobs" },
    { label: "AI Tools", href: "/ai-tools" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  jobSeekers: [
    { label: "Browse Jobs", href: "/jobs" },
    { label: "AI Cover Letter", href: "/ai-tools/cover-letter" },
    { label: "Job Recommendations", href: "/ai-tools/recommendations" },
    { label: "Career Coach", href: "/ai-tools/career-coach" },
    { label: "Resume Analyzer", href: "/ai-tools/resume-analyzer" },
  ],
  recruiters: [
    { label: "Post a Job", href: "/dashboard" },
    { label: "Manage Applicants", href: "/dashboard" },
    { label: "AI Resume Classifier", href: "/ai-tools" },
    { label: "Analytics", href: "/dashboard" },
  ],
};

const socialLinks = [
  { icon: FaLinkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: FaTwitter, href: "https://twitter.com", label: "Twitter" },
  { icon: SiGithub, href: "https://github.com", label: "GitHub" },
];

const Footer = () => {
  const pathname = usePathname();

  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  return (
    <footer className="bg-PrimaryColorDarker text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-PrimaryColor to-SrcPrimaryColor">
                <Sparkles size={20} className="text-white" />
              </div>
              <span className="text-lg font-bold font-PrimaryFont tracking-tight">
                TalentAI
              </span>
              <VerifiedBadge size={10} />
            </Link>
            <p className="text-sm font-SecondaryFont text-white/60 leading-relaxed mb-6">
              Your AI-powered career partner. Discover opportunities, generate
              cover letters, and advance your career with smart recommendations.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-PrimaryColor transition-colors text-white"
                >
                  <social.icon />
                </a>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-sm font-bold font-PrimaryFont uppercase tracking-wider mb-4">
              Platform
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.platform.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm font-SecondaryFont text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Job Seekers Links */}
          <div>
            <h3 className="text-sm font-bold font-PrimaryFont uppercase tracking-wider mb-4">
              Job Seekers
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.jobSeekers.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm font-SecondaryFont text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold font-PrimaryFont uppercase tracking-wider mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="text-SrcPrimaryColor mt-0.5 shrink-0" />
                <span className="text-sm font-SecondaryFont text-white/60">
                  123 AI Street, Tech City, Bangladesh
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={16} className="text-SrcPrimaryColor shrink-0" />
                <a
                  href="mailto:info@talentai.com"
                  className="text-sm font-SecondaryFont text-white/60 hover:text-white transition-colors"
                >
                  info@talentai.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="text-SrcPrimaryColor shrink-0" />
                <a
                  href="tel:+8801234567890"
                  className="text-sm font-SecondaryFont text-white/60 hover:text-white transition-colors"
                >
                  +880 123 456 7890
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs font-SecondaryFont text-white/40">
            &copy; {new Date().getFullYear()} TalentAI. All rights reserved.
          </p>
          <div className="flex gap-5">
            <Link
              href="/privacy"
              className="text-xs font-SecondaryFont text-white/40 hover:text-white/70 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs font-SecondaryFont text-white/40 hover:text-white/70 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
