"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import fetchClient from "@/lib/utils/fetchClient";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
  Pencil,
  Mail,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";

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

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

export default function RecruiterProfileForm({
  profile,
}: RecruiterProfileFormProps) {
  const { data: session } = useSession();
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    companyName: profile?.companyName ?? "",
    companyLogo: profile?.companyLogo ?? "",
    companyWebsite: profile?.companyWebsite ?? "",
    companyDescription: profile?.companyDescription ?? "",
    companyLocation: profile?.companyLocation ?? "",
    industry: profile?.industry ?? "",
    companySize: profile?.companySize ?? "",
    phone: profile?.phone ?? "",
  });

  const resetForm = () => {
    setFormData({
      companyName: profile?.companyName ?? "",
      companyLogo: profile?.companyLogo ?? "",
      companyWebsite: profile?.companyWebsite ?? "",
      companyDescription: profile?.companyDescription ?? "",
      companyLocation: profile?.companyLocation ?? "",
      industry: profile?.industry ?? "",
      companySize: profile?.companySize ?? "",
      phone: profile?.phone ?? "",
    });
  };

  const handleCancel = () => {
    resetForm();
    setMode("view");
  };

  const handleSave = async () => {
    if (!formData.companyName.trim()) {
      toast.error("Company name is required");
      return;
    }

    setSaving(true);
    try {
      await fetchClient("/api/recruiter-profile/profile", {
        method: "PUT",
        body: JSON.stringify(formData),
      });
      toast.success("Profile updated successfully");
      setMode("view");
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const user = session?.user;
  const initial = user?.name?.charAt(0)?.toUpperCase() ?? "R";
  const isValidLogoUrl =
    formData.companyLogo &&
    (formData.companyLogo.startsWith("http://") ||
      formData.companyLogo.startsWith("https://"));

  if (mode === "edit") {
    return (
      <div className="space-y-6">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-PrimaryColor via-PrimaryColorDark to-SrcPrimaryColor p-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-3xl font-PrimaryFont font-bold border-2 border-white/40">
              {initial}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-PrimaryFont text-white">
                {user?.name ?? "Recruiter"}
              </h2>
              <p className="text-white/80 font-SecondaryFont">
                {user?.email ?? ""}
              </p>
            </div>
            <Button
              onClick={handleCancel}
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30 font-SecondaryFont cursor-pointer"
            >
              Cancel
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-surface bg-white dark:bg-[#1e293b] dark:border-secondary p-6 space-y-6">
          <h3 className="text-lg font-PrimaryFont text-gray-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-PrimaryColor" />
            Company Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-SecondaryFont text-gray-700 dark:text-surface">
                Company Name *
              </Label>
              <Input
                value={formData.companyName}
                onChange={(e) => updateField("companyName", e.target.value)}
                placeholder="Enter company name"
                className="rounded-xl font-SecondaryFont dark:bg-[#0f172a] dark:border-secondary dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-SecondaryFont text-gray-700 dark:text-surface">
                Phone
              </Label>
              <Input
                value={formData.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="Enter phone number"
                className="rounded-xl font-SecondaryFont dark:bg-[#0f172a] dark:border-secondary dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-surface bg-white dark:bg-[#1e293b] dark:border-secondary p-6 space-y-6">
          <h3 className="text-lg font-PrimaryFont text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-SrcPrimaryColor" />
            Company Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-SecondaryFont text-gray-700 dark:text-surface">
                Industry
              </Label>
              <select
                value={formData.industry}
                onChange={(e) => updateField("industry", e.target.value)}
                className="w-full rounded-xl border border-surface bg-white px-3 py-2 text-sm font-SecondaryFont dark:bg-[#0f172a] dark:border-secondary dark:text-white"
              >
                <option value="">Select industry</option>
                {industryOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label className="font-SecondaryFont text-gray-700 dark:text-surface">
                Company Size
              </Label>
              <select
                value={formData.companySize}
                onChange={(e) => updateField("companySize", e.target.value)}
                className="w-full rounded-xl border border-surface bg-white px-3 py-2 text-sm font-SecondaryFont dark:bg-[#0f172a] dark:border-secondary dark:text-white"
              >
                <option value="">Select company size</option>
                {companySizeOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-surface bg-white dark:bg-[#1e293b] dark:border-secondary p-6 space-y-6">
          <h3 className="text-lg font-PrimaryFont text-gray-900 dark:text-white flex items-center gap-2">
            <ImagePlus className="w-5 h-5 text-PrimaryColor" />
            Company Branding
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-SecondaryFont text-gray-700 dark:text-surface">
                Company Logo URL
              </Label>
              <Input
                value={formData.companyLogo}
                onChange={(e) => updateField("companyLogo", e.target.value)}
                placeholder="https://example.com/logo.png"
                className="rounded-xl font-SecondaryFont dark:bg-[#0f172a] dark:border-secondary dark:text-white"
              />
              {isValidLogoUrl && (
                <div className="mt-2 relative w-16 h-16 rounded-lg overflow-hidden border border-surface dark:border-secondary">
                  <Image
                    src={formData.companyLogo}
                    alt="Logo preview"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label className="font-SecondaryFont text-gray-700 dark:text-surface">
                Company Website
              </Label>
              <Input
                value={formData.companyWebsite}
                onChange={(e) => updateField("companyWebsite", e.target.value)}
                placeholder="https://example.com"
                className="rounded-xl font-SecondaryFont dark:bg-[#0f172a] dark:border-secondary dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-surface bg-white dark:bg-[#1e293b] dark:border-secondary p-6 space-y-4">
          <h3 className="text-lg font-PrimaryFont text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-SrcPrimaryColor" />
            Company Description
          </h3>
          <textarea
            value={formData.companyDescription}
            onChange={(e) => updateField("companyDescription", e.target.value)}
            placeholder="Describe your company..."
            rows={5}
            className="w-full rounded-xl border border-surface bg-white px-4 py-3 text-sm font-SecondaryFont resize-none dark:bg-[#0f172a] dark:border-secondary dark:text-white"
          />
          <p className="text-xs text-gray-500 dark:text-surface font-SecondaryFont text-right">
            {formData.companyDescription.length} characters
          </p>
        </div>

        <div className="rounded-2xl border border-surface bg-white dark:bg-[#1e293b] dark:border-secondary p-6 space-y-4">
          <h3 className="text-lg font-PrimaryFont text-gray-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-PrimaryColor" />
            Location
          </h3>
          <Input
            value={formData.companyLocation}
            onChange={(e) => updateField("companyLocation", e.target.value)}
            placeholder="Enter company location"
            className="rounded-xl font-SecondaryFont dark:bg-[#0f172a] dark:border-secondary dark:text-white"
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button
            onClick={handleCancel}
            className="px-6 py-2 rounded-xl font-SecondaryFont border border-surface dark:border-secondary dark:text-white cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 rounded-xl font-SecondaryFont bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor text-white hover:opacity-90 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Profile
              </span>
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-PrimaryColor via-PrimaryColorDark to-SrcPrimaryColor p-8">
          <div className="flex items-center gap-6">
            {user?.image ? (
              <img
                src={user.image}
                alt={user.name ?? "Avatar"}
                className="w-20 h-20 rounded-full border-2 border-white/40 object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-3xl font-PrimaryFont font-bold border-2 border-white/40">
                {initial}
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-2xl font-PrimaryFont text-white">
                {user?.name ?? "Recruiter"}
              </h2>
              <p className="text-white/80 font-SecondaryFont flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {user?.email ?? ""}
              </p>
              {profile?.companyLocation && (
                <p className="text-white/70 font-SecondaryFont text-sm flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {profile.companyLocation}
                </p>
              )}
              <div className="flex gap-2 mt-2">
                {profile?.industry && (
                  <span className="px-3 py-0.5 rounded-full bg-white/20 text-white text-xs font-SecondaryFont backdrop-blur-sm">
                    {profile.industry}
                  </span>
                )}
                {profile?.companySize && (
                  <span className="px-3 py-0.5 rounded-full bg-white/20 text-white text-xs font-SecondaryFont backdrop-blur-sm">
                    {profile.companySize} employees
                  </span>
                )}
              </div>
            </div>
            <Button
              onClick={() => setMode("edit")}
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30 font-SecondaryFont cursor-pointer"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="rounded-2xl border border-surface bg-white dark:bg-[#1e293b] dark:border-secondary p-6">
          <h3 className="text-lg font-PrimaryFont text-gray-900 dark:text-white flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-PrimaryColor" />
            Company Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-surface font-SecondaryFont">
                Company Name
              </p>
              <p className="text-gray-900 dark:text-white font-SecondaryFont mt-1">
                {profile?.companyName || "\u2014"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-surface font-SecondaryFont">
                Phone
              </p>
              <p className="text-gray-900 dark:text-white font-SecondaryFont mt-1 flex items-center gap-1">
                <Phone className="w-4 h-4 text-PrimaryColor" />
                {profile?.phone || "\u2014"}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="rounded-2xl border border-surface bg-white dark:bg-[#1e293b] dark:border-secondary p-6">
          <h3 className="text-lg font-PrimaryFont text-gray-900 dark:text-white flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-SrcPrimaryColor" />
            Company Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-surface font-SecondaryFont">
                Industry
              </p>
              <p className="text-gray-900 dark:text-white font-SecondaryFont mt-1">
                {profile?.industry || "\u2014"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-surface font-SecondaryFont">
                Company Size
              </p>
              <p className="text-gray-900 dark:text-white font-SecondaryFont mt-1">
                {profile?.companySize || "\u2014"}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="rounded-2xl border border-surface bg-white dark:bg-[#1e293b] dark:border-secondary p-6">
          <h3 className="text-lg font-PrimaryFont text-gray-900 dark:text-white flex items-center gap-2 mb-4">
            <ImagePlus className="w-5 h-5 text-PrimaryColor" />
            Company Branding
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-surface font-SecondaryFont mb-2">
                Company Logo
              </p>
              {profile?.companyLogo &&
              (profile.companyLogo.startsWith("http://") ||
                profile.companyLogo.startsWith("https://")) ? (
                <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-surface dark:border-secondary">
                  <Image
                    src={profile.companyLogo}
                    alt="Company Logo"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              ) : (
                <p className="text-gray-900 dark:text-white font-SecondaryFont">
                  {"\u2014"}
                </p>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-surface font-SecondaryFont mb-2">
                Website
              </p>
              {profile?.companyWebsite ? (
                <a
                  href={profile.companyWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-PrimaryColor hover:underline font-SecondaryFont flex items-center gap-1"
                >
                  <Globe className="w-4 h-4" />
                  {profile.companyWebsite}
                </a>
              ) : (
                <p className="text-gray-900 dark:text-white font-SecondaryFont">
                  {"\u2014"}
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="rounded-2xl border border-surface bg-white dark:bg-[#1e293b] dark:border-secondary p-6">
          <h3 className="text-lg font-PrimaryFont text-gray-900 dark:text-white flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-SrcPrimaryColor" />
            Company Description
          </h3>
          <p className="text-gray-900 dark:text-white font-SecondaryFont whitespace-pre-wrap">
            {profile?.companyDescription || "\u2014"}
          </p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="rounded-2xl border border-surface bg-white dark:bg-[#1e293b] dark:border-secondary p-6">
          <h3 className="text-lg font-PrimaryFont text-gray-900 dark:text-white flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-PrimaryColor" />
            Location
          </h3>
          <p className="text-gray-900 dark:text-white font-SecondaryFont">
            {profile?.companyLocation || "\u2014"}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
