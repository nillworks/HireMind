"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import fetchClient from "@/lib/utils/fetchClient";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Building2,
  Phone,
  MapPin,
  Globe,
  FileText,
  Users,
  Save,
  Loader2,
  ImagePlus,
} from "lucide-react";

interface RecruiterProfile {
  userId: string;
  companyName: string;
  companyLogo?: string;
  companyWebsite?: string;
  companyDescription?: string;
  companyLocation?: string;
  industry?: string;
  companySize?: string;
  phone?: string;
}

interface RecruiterProfileFormProps {
  profile: RecruiterProfile | null;
}

const industryOptions = [
  "Technology",
  "Design",
  "Marketing",
  "Finance",
  "Education",
  "Healthcare",
  "Engineering",
  "Sales",
  "Other",
];

const companySizeOptions = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1000+",
];

const RecruiterProfileForm = ({ profile }: RecruiterProfileFormProps) => {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const [companyName, setCompanyName] = useState(profile?.companyName ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [industry, setIndustry] = useState(profile?.industry ?? "");
  const [companySize, setCompanySize] = useState(profile?.companySize ?? "");
  const [companyLogo, setCompanyLogo] = useState(profile?.companyLogo ?? "");
  const [companyWebsite, setCompanyWebsite] = useState(
    profile?.companyWebsite ?? ""
  );
  const [companyDescription, setCompanyDescription] = useState(
    profile?.companyDescription ?? ""
  );
  const [companyLocation, setCompanyLocation] = useState(
    profile?.companyLocation ?? ""
  );

  const isValidUrl = (url: string) => {
    return url.startsWith("http://") || url.startsWith("https://");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyName.trim()) {
      toast.error("Company name is required");
      return;
    }

    setIsSaving(true);

    try {
      await fetchClient("/api/recruiter-profile/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          phone,
          industry,
          companySize,
          companyLogo,
          companyWebsite,
          companyDescription,
          companyLocation,
        }),
      });

      toast.success("Profile updated successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-6 border border-Border dark:border-secondary">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-PrimaryColor/10">
            <Building2 className="w-5 h-5 text-PrimaryColor" />
          </div>
          <div>
            <h2 className="text-lg font-semibold font-PrimaryFont text-TextPrimary dark:text-surface">
              Company Information
            </h2>
            <p className="text-sm font-SecondaryFont text-TextMuted">
              Basic company details
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label className="font-SecondaryFont text-TextPrimary dark:text-surface">
              Company Name <span className="text-PrimaryColor">*</span>
            </Label>
            <Input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter company name"
              className="bg-white dark:bg-[#0f172a] border-Border dark:border-secondary rounded-xl font-SecondaryFont text-TextPrimary dark:text-surface cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-SecondaryFont text-TextPrimary dark:text-surface flex items-center gap-2">
              <Phone className="w-4 h-4 text-TextMuted" />
              Phone
            </Label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="bg-white dark:bg-[#0f172a] border-Border dark:border-secondary rounded-xl font-SecondaryFont text-TextPrimary dark:text-surface cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-6 border border-Border dark:border-secondary">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-SrcPrimaryColor/10">
            <Users className="w-5 h-5 text-SrcPrimaryColor" />
          </div>
          <div>
            <h2 className="text-lg font-semibold font-PrimaryFont text-TextPrimary dark:text-surface">
              Company Details
            </h2>
            <p className="text-sm font-SecondaryFont text-TextMuted">
              Industry and company size
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label className="font-SecondaryFont text-TextPrimary dark:text-surface">
              Industry
            </Label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full h-10 px-3 py-2 text-sm bg-white dark:bg-[#0f172a] border border-Border dark:border-secondary rounded-xl font-SecondaryFont text-TextPrimary dark:text-surface cursor-pointer focus:outline-none focus:ring-2 focus:ring-PrimaryColor/50"
            >
              <option value="">Select industry</option>
              {industryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label className="font-SecondaryFont text-TextPrimary dark:text-surface">
              Company Size
            </Label>
            <select
              value={companySize}
              onChange={(e) => setCompanySize(e.target.value)}
              className="w-full h-10 px-3 py-2 text-sm bg-white dark:bg-[#0f172a] border border-Border dark:border-secondary rounded-xl font-SecondaryFont text-TextPrimary dark:text-surface cursor-pointer focus:outline-none focus:ring-2 focus:ring-PrimaryColor/50"
            >
              <option value="">Select company size</option>
              {companySizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option} employees
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-6 border border-Border dark:border-secondary">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-PrimaryColor/10">
            <ImagePlus className="w-5 h-5 text-PrimaryColor" />
          </div>
          <div>
            <h2 className="text-lg font-semibold font-PrimaryFont text-TextPrimary dark:text-surface">
              Company Branding
            </h2>
            <p className="text-sm font-SecondaryFont text-TextMuted">
              Logo and website URL
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label className="font-SecondaryFont text-TextPrimary dark:text-surface">
              Company Logo URL
            </Label>
            <Input
              value={companyLogo}
              onChange={(e) => setCompanyLogo(e.target.value)}
              placeholder="https://example.com/logo.png"
              className="bg-white dark:bg-[#0f172a] border-Border dark:border-secondary rounded-xl font-SecondaryFont text-TextPrimary dark:text-surface cursor-pointer"
            />
            {companyLogo && isValidUrl(companyLogo) && (
              <div className="mt-3 relative w-full h-40 rounded-xl overflow-hidden border border-Border dark:border-secondary">
                <Image
                  src={companyLogo}
                  alt="Company logo preview"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="font-SecondaryFont text-TextPrimary dark:text-surface flex items-center gap-2">
              <Globe className="w-4 h-4 text-TextMuted" />
              Company Website
            </Label>
            <Input
              value={companyWebsite}
              onChange={(e) => setCompanyWebsite(e.target.value)}
              placeholder="https://example.com"
              className="bg-white dark:bg-[#0f172a] border-Border dark:border-secondary rounded-xl font-SecondaryFont text-TextPrimary dark:text-surface cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-6 border border-Border dark:border-secondary">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-SrcPrimaryColor/10">
            <FileText className="w-5 h-5 text-SrcPrimaryColor" />
          </div>
          <div>
            <h2 className="text-lg font-semibold font-PrimaryFont text-TextPrimary dark:text-surface">
              Company Description
            </h2>
            <p className="text-sm font-SecondaryFont text-TextMuted">
              Tell candidates about your company
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="font-SecondaryFont text-TextPrimary dark:text-surface">
            Description
          </Label>
          <textarea
            value={companyDescription}
            onChange={(e) => setCompanyDescription(e.target.value)}
            placeholder="Write a compelling description about your company..."
            rows={5}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-[#0f172a] border border-Border dark:border-secondary rounded-xl font-SecondaryFont text-TextPrimary dark:text-surface cursor-pointer focus:outline-none focus:ring-2 focus:ring-PrimaryColor/50 resize-none"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-6 border border-Border dark:border-secondary">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-PrimaryColor/10">
            <MapPin className="w-5 h-5 text-PrimaryColor" />
          </div>
          <div>
            <h2 className="text-lg font-semibold font-PrimaryFont text-TextPrimary dark:text-surface">
              Location
            </h2>
            <p className="text-sm font-SecondaryFont text-TextMuted">
              Company headquarters location
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="font-SecondaryFont text-TextPrimary dark:text-surface flex items-center gap-2">
            <MapPin className="w-4 h-4 text-TextMuted" />
            Company Location
          </Label>
          <Input
            value={companyLocation}
            onChange={(e) => setCompanyLocation(e.target.value)}
            placeholder="San Francisco, CA"
            className="bg-white dark:bg-[#0f172a] border-Border dark:border-secondary rounded-xl font-SecondaryFont text-TextPrimary dark:text-surface cursor-pointer"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSaving}
          className="bg-PrimaryColor hover:bg-PrimaryColor/90 text-white font-SecondaryFont rounded-xl px-6 py-2.5 cursor-pointer flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Profile
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default RecruiterProfileForm;
