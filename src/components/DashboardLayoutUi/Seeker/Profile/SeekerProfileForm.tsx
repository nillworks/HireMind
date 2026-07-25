"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import fetchClient from "@/lib/utils/fetchClient";
import { useSession } from "@/lib/auth-client";
import PlanUpgradeCard from "@/components/DashboardLayoutUi/Seeker/Overview/PlanUpgradeCard";
import {
  User,
  Phone,
  MapPin,
  FileText,
  Link,
  GraduationCap,
  Plus,
  X,
  Save,
  Loader2,
  Pencil,
  Mail,
  Award,
  Building,
  ExternalLink,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";

interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate?: string;
  endDate?: string;
}

interface Experience {
  company: string;
  position: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

interface SeekerProfile {
  userId: string;
  phone?: string;
  bio?: string;
  location?: string;
  resumeUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  githubUrl?: string;
  skills?: string[];
  education?: Education[];
  experience?: Experience[];
}

interface SeekerProfileFormProps {
  profile: SeekerProfile | null;
}

const emptyEducation: Education = {
  institution: "",
  degree: "",
  field: "",
  startDate: "",
  endDate: "",
};

const emptyExperience: Experience = {
  company: "",
  position: "",
  startDate: "",
  endDate: "",
  description: "",
};

const inputClasses =
  "h-10 bg-white dark:bg-[#0f172a] border-Border dark:border-secondary text-TextPrimary dark:text-surface font-SecondaryFont placeholder:text-TextMuted rounded-xl focus:border-PrimaryColor focus:ring-2 focus:ring-PrimaryColor/20 transition-colors";

const textareaClasses =
  "flex w-full rounded-xl border border-Border dark:border-secondary bg-white dark:bg-[#0f172a] px-3 py-2.5 text-sm font-SecondaryFont text-TextPrimary dark:text-surface placeholder:text-TextMuted outline-none focus:border-PrimaryColor focus:ring-2 focus:ring-PrimaryColor/20 transition-colors resize-none";

const sectionCard =
  "rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary overflow-hidden";

const sectionHeader = (icon: React.ReactNode, title: string, subtitle: string) => (
  <div className="px-6 py-4 border-b border-Border dark:border-secondary bg-BorderLight/30 dark:bg-secondary/5">
    <div className="flex items-center gap-2.5">
      {icon}
      <div>
        <h3 className="text-sm font-semibold font-PrimaryFont text-TextPrimary dark:text-white">
          {title}
        </h3>
        <p className="text-[11px] font-SecondaryFont text-TextMuted">{subtitle}</p>
      </div>
    </div>
  </div>
);

const labelClasses =
  "text-xs font-semibold font-SecondaryFont text-TextPrimary dark:text-surface";

const sublabelClasses =
  "text-[11px] font-semibold font-SecondaryFont text-TextMuted uppercase tracking-wider";

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

const SeekerProfileForm = ({ profile }: SeekerProfileFormProps) => {
  const { data: session } = useSession();
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [saving, setSaving] = useState(false);

  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [location, setLocation] = useState(profile?.location ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [resumeUrl, setResumeUrl] = useState(profile?.resumeUrl ?? "");
  const [linkedinUrl, setLinkedinUrl] = useState(profile?.linkedinUrl ?? "");
  const [portfolioUrl, setPortfolioUrl] = useState(profile?.portfolioUrl ?? "");
  const [githubUrl, setGithubUrl] = useState(profile?.githubUrl ?? "");
  const [skills, setSkills] = useState<string[]>(profile?.skills ?? []);
  const [newSkill, setNewSkill] = useState("");
  const [education, setEducation] = useState<Education[]>(
    profile?.education ?? []
  );
  const [experience, setExperience] = useState<Experience[]>(
    profile?.experience ?? []
  );

  const userName = session?.user?.name || "Seeker";
  const userEmail = session?.user?.email || "";
  const userImage = session?.user?.image;

  const resetForm = () => {
    setPhone(profile?.phone ?? "");
    setLocation(profile?.location ?? "");
    setBio(profile?.bio ?? "");
    setResumeUrl(profile?.resumeUrl ?? "");
    setLinkedinUrl(profile?.linkedinUrl ?? "");
    setPortfolioUrl(profile?.portfolioUrl ?? "");
    setGithubUrl(profile?.githubUrl ?? "");
    setSkills(profile?.skills ?? []);
    setNewSkill("");
    setEducation(profile?.education ?? []);
    setExperience(profile?.experience ?? []);
  };

  const handleCancel = () => {
    resetForm();
    setMode("view");
  };

  const addSkill = () => {
    const trimmed = newSkill.trim();
    if (!trimmed) return;
    if (skills.includes(trimmed)) {
      toast.error("Skill already added.");
      return;
    }
    if (skills.length >= 15) {
      toast.error("Maximum 15 skills allowed.");
      return;
    }
    setSkills((prev) => [...prev, trimmed]);
    setNewSkill("");
  };

  const removeSkill = (index: number) => {
    setSkills((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const addEducation = () => setEducation((prev) => [...prev, { ...emptyEducation }]);
  const removeEducation = (index: number) =>
    setEducation((prev) => prev.filter((_, i) => i !== index));
  const updateEducation = (index: number, field: keyof Education, value: string) =>
    setEducation((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );

  const addExperience = () => setExperience((prev) => [...prev, { ...emptyExperience }]);
  const removeExperience = (index: number) =>
    setExperience((prev) => prev.filter((_, i) => i !== index));
  const updateExperience = (index: number, field: keyof Experience, value: string) =>
    setExperience((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );

  const handleSubmit = async () => {
    if (!phone.trim()) {
      toast.error("Phone number is required");
      return;
    }
    if (!location.trim()) {
      toast.error("Location is required");
      return;
    }
    if (!bio.trim()) {
      toast.error("Professional summary is required");
      return;
    }
    if (skills.length === 0) {
      toast.error("Add at least one skill");
      return;
    }

    const cleanedEducation = education.filter(
      (e) => e.institution.trim() || e.degree.trim() || e.field.trim()
    );
    const cleanedExperience = experience.filter(
      (e) => e.company.trim() || e.position.trim()
    );

    const payload = {
      phone: phone.trim(),
      location: location.trim(),
      bio: bio.trim(),
      resumeUrl: resumeUrl.trim(),
      linkedinUrl: linkedinUrl.trim(),
      portfolioUrl: portfolioUrl.trim(),
      githubUrl: githubUrl.trim(),
      skills,
      education: cleanedEducation.map((e) => ({
        institution: e.institution.trim(),
        degree: e.degree.trim(),
        field: e.field.trim(),
        startDate: e.startDate,
        endDate: e.endDate,
      })),
      experience: cleanedExperience.map((e) => ({
        company: e.company.trim(),
        position: e.position.trim(),
        startDate: e.startDate,
        endDate: e.endDate,
        description: e.description?.trim() ?? "",
      })),
    };

    setSaving(true);
    try {
      await fetchClient("/api/seeker/profile", {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      toast.success("Profile updated successfully!");
      setMode("view");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return "";
    try {
      return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    } catch {
      return date;
    }
  };

  const ProfileBanner = ({ isEdit }: { isEdit: boolean }) => (
    <div className="relative h-28 bg-gradient-to-r from-PrimaryColor via-PrimaryColorDark to-SrcPrimaryColor">
      <div className="absolute -bottom-10 left-6 flex items-end gap-4">
        <div className="relative">
          <div className="size-20 rounded-2xl bg-white dark:bg-[#1e293b] border-4 border-white dark:border-[#1e293b] shadow-lg overflow-hidden flex items-center justify-center">
            {userImage ? (
              <img
                src={userImage}
                alt={userName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold font-PrimaryFont text-PrimaryColor">
                {userName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          {isEdit && (
            <div className="absolute -bottom-1 -right-1 size-6 rounded-full bg-PrimaryColor flex items-center justify-center border-2 border-white dark:border-[#1e293b]">
              <Pencil size={10} className="text-white" />
            </div>
          )}
        </div>
        <div className="pb-1">
          <h2 className="text-lg font-bold font-PrimaryFont text-white">
            {userName}
          </h2>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="inline-flex items-center gap-1 text-xs font-SecondaryFont text-white/80">
              <Mail size={11} /> {userEmail}
            </span>
            {(isEdit ? location : profile?.location) && (
              <span className="inline-flex items-center gap-1 text-xs font-SecondaryFont text-white/80">
                <MapPin size={11} /> {isEdit ? location : profile?.location}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="absolute top-3 right-4">
        {isEdit ? (
          <Button
            type="button"
            onClick={handleCancel}
            className="h-8 px-4 rounded-xl bg-white/20 hover:bg-white/30 text-white font-SecondaryFont font-medium text-xs backdrop-blur-sm border border-white/20 transition-colors cursor-pointer"
          >
            <X size={14} /> Cancel
          </Button>
        ) : (
          <Button
            type="button"
            onClick={() => setMode("edit")}
            className="h-8 px-4 rounded-xl bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor hover:from-PrimaryColorHover hover:to-SrcPrimaryColorHover text-white font-SecondaryFont font-medium text-xs transition-colors cursor-pointer shadow-md"
          >
            <Pencil size={14} /> Edit Profile
          </Button>
        )}
      </div>
    </div>
  );

  const SkillsPreview = () => {
    const displaySkills = skills.length > 0 ? skills : profile?.skills ?? [];
    return (
      <div className="pt-12 pb-4 px-6 flex flex-wrap gap-2">
        {displaySkills.slice(0, 6).map((skill, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 rounded-full bg-PrimaryColorLight dark:bg-PrimaryColorDark/20 border border-PrimaryColor/15 px-2.5 py-1 text-[11px] font-semibold font-SecondaryFont text-PrimaryColor"
          >
            {skill}
          </span>
        ))}
        {displaySkills.length > 6 && (
          <span className="inline-flex items-center rounded-full bg-BorderLight dark:bg-secondary/20 px-2.5 py-1 text-[11px] font-semibold font-SecondaryFont text-TextMuted">
            +{displaySkills.length - 6} more
          </span>
        )}
        {displaySkills.length === 0 && (
          <span className="text-xs font-SecondaryFont text-TextMuted italic">
            No skills added yet
          </span>
        )}
      </div>
    );
  };

  if (mode === "view") {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        <motion.div variants={itemVariants}>
          <div className={sectionCard}>
            <ProfileBanner isEdit={false} />
            <SkillsPreview />
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className={sectionCard}>
            {sectionHeader(
              <div className="flex size-8 items-center justify-center rounded-lg bg-PrimaryColorLight dark:bg-PrimaryColorDark/20">
                <Phone size={15} className="text-PrimaryColor" />
              </div>,
              "Contact Information",
              "Your phone and location details"
            )}
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <p className={sublabelClasses}>Phone Number</p>
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-BorderLight/30 dark:bg-secondary/10 border border-Border dark:border-secondary">
                    <Phone size={14} className="text-TextMuted" />
                    <span className="text-sm font-SecondaryFont text-TextPrimary dark:text-surface">
                      {profile?.phone || "—"}
                    </span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <p className={sublabelClasses}>Location</p>
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-BorderLight/30 dark:bg-secondary/10 border border-Border dark:border-secondary">
                    <MapPin size={14} className="text-TextMuted" />
                    <span className="text-sm font-SecondaryFont text-TextPrimary dark:text-surface">
                      {profile?.location || "—"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className={sectionCard}>
            {sectionHeader(
              <div className="flex size-8 items-center justify-center rounded-lg bg-SrcPrimaryColorLight dark:bg-SrcPrimaryColorDark/20">
                <User size={15} className="text-SrcPrimaryColor" />
              </div>,
              "Professional Summary",
              "A brief overview of who you are"
            )}
            <div className="p-6">
              {profile?.bio ? (
                <p className="text-sm font-SecondaryFont text-TextPrimary dark:text-surface leading-relaxed whitespace-pre-wrap">
                  {profile.bio}
                </p>
              ) : (
                <p className="text-sm font-SecondaryFont text-TextMuted italic">
                  No summary added yet.
                </p>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className={sectionCard}>
            {sectionHeader(
              <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-PrimaryColorLight to-SrcPrimaryColorLight dark:from-PrimaryColorDark/20 dark:to-SrcPrimaryColorDark/20">
                <FileText size={15} className="text-PrimaryColor" />
              </div>,
              "Resume",
              "Link to your resume document"
            )}
            <div className="p-6">
              {profile?.resumeUrl ? (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-SecondaryFont text-PrimaryColor hover:underline"
                >
                  View Resume <ExternalLink size={14} />
                </a>
              ) : (
                <p className="text-sm font-SecondaryFont text-TextMuted italic">
                  No resume linked yet.
                </p>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className={sectionCard}>
            {sectionHeader(
              <div className="flex size-8 items-center justify-center rounded-lg bg-SrcPrimaryColorLight dark:bg-SrcPrimaryColorDark/20">
                <Link size={15} className="text-SrcPrimaryColor" />
              </div>,
              "Social Links",
              "Your professional online presence"
            )}
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {[
                  { label: "LinkedIn", url: profile?.linkedinUrl },
                  { label: "Portfolio", url: profile?.portfolioUrl },
                  { label: "GitHub", url: profile?.githubUrl },
                ].map((item) => (
                  <div key={item.label} className="space-y-1.5">
                    <p className={sublabelClasses}>{item.label}</p>
                    <div className="p-3 rounded-xl bg-BorderLight/30 dark:bg-secondary/10 border border-Border dark:border-secondary">
                      {item.url ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-SecondaryFont text-PrimaryColor hover:underline truncate block"
                        >
                          {item.url}
                        </a>
                      ) : (
                        <span className="text-sm font-SecondaryFont text-TextMuted">
                          —
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className={sectionCard}>
            {sectionHeader(
              <div className="flex size-8 items-center justify-center rounded-lg bg-PrimaryColorLight dark:bg-PrimaryColorDark/20">
                <Award size={15} className="text-PrimaryColor" />
              </div>,
              "Skills",
              "Your key competencies"
            )}
            <div className="p-6">
              {skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center rounded-full bg-PrimaryColorLight dark:bg-PrimaryColorDark/20 border border-PrimaryColor/15 px-3 py-1.5 text-sm font-SecondaryFont text-PrimaryColor"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 rounded-xl border border-dashed border-Border dark:border-secondary">
                  <Award size={28} className="text-TextMuted mb-2" />
                  <p className="text-xs font-SecondaryFont text-TextMuted">
                    No skills added yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className={sectionCard}>
            {sectionHeader(
              <div className="flex size-8 items-center justify-center rounded-lg bg-SrcPrimaryColorLight dark:bg-SrcPrimaryColorDark/20">
                <GraduationCap size={15} className="text-SrcPrimaryColor" />
              </div>,
              "Education",
              "Your academic background"
            )}
            <div className="p-6">
              {education.length > 0 ? (
                <div className="space-y-3">
                  {education.map((edu, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-Border dark:border-secondary p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-semibold font-PrimaryFont text-TextPrimary dark:text-white">
                            {edu.institution}
                          </p>
                          <p className="text-sm font-SecondaryFont text-TextMuted mt-0.5">
                            {edu.degree}
                            {edu.degree && edu.field ? " in " : ""}
                            {edu.field}
                          </p>
                        </div>
                        {(edu.startDate || edu.endDate) && (
                          <span className="text-xs font-SecondaryFont text-TextMuted whitespace-nowrap">
                            {formatDate(edu.startDate)}
                            {edu.startDate && edu.endDate ? " — " : ""}
                            {formatDate(edu.endDate)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 rounded-xl border border-dashed border-Border dark:border-secondary">
                  <GraduationCap size={28} className="text-TextMuted mb-2" />
                  <p className="text-xs font-SecondaryFont text-TextMuted">
                    No education entries yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className={sectionCard}>
            {sectionHeader(
              <div className="flex size-8 items-center justify-center rounded-lg bg-PrimaryColorLight dark:bg-PrimaryColorDark/20">
                <Building size={15} className="text-PrimaryColor" />
              </div>,
              "Work Experience",
              "Your professional history"
            )}
            <div className="p-6">
              {experience.length > 0 ? (
                <div className="space-y-3">
                  {experience.map((exp, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-Border dark:border-secondary p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-semibold font-PrimaryFont text-TextPrimary dark:text-white">
                            {exp.position}
                          </p>
                          <p className="text-sm font-SecondaryFont text-TextMuted mt-0.5">
                            {exp.company}
                          </p>
                        </div>
                        {(exp.startDate || exp.endDate) && (
                          <span className="text-xs font-SecondaryFont text-TextMuted whitespace-nowrap">
                            {formatDate(exp.startDate)}
                            {exp.startDate && exp.endDate ? " — " : ""}
                            {formatDate(exp.endDate)}
                          </span>
                        )}
                      </div>
                      {exp.description && (
                        <p className="text-sm font-SecondaryFont text-TextMuted mt-2 leading-relaxed whitespace-pre-wrap">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 rounded-xl border border-dashed border-Border dark:border-secondary">
                  <Building size={28} className="text-TextMuted mb-2" />
                  <p className="text-xs font-SecondaryFont text-TextMuted">
                    No work experience yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <PlanUpgradeCard
            currentPlan={
              ((session?.user as Record<string, unknown>)?.plan as string) ||
              "free_seeker"
            }
            role={
              ((session?.user as Record<string, unknown>)?.role as string) ||
              "seeker"
            }
          />
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className={sectionCard}>
        <ProfileBanner isEdit={true} />
        <div className="pt-12 pb-4 px-6 flex flex-wrap gap-2">
          {skills.length > 0 ? (
            skills.map((skill, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 rounded-full bg-PrimaryColorLight dark:bg-PrimaryColorDark/20 border border-PrimaryColor/15 px-2.5 py-1 text-[11px] font-semibold font-SecondaryFont text-PrimaryColor"
              >
                {skill}
              </span>
            ))
          ) : (
            <span className="text-xs font-SecondaryFont text-TextMuted italic">
              No skills added yet
            </span>
          )}
        </div>
      </div>

      <div className={sectionCard}>
        {sectionHeader(
          <div className="flex size-8 items-center justify-center rounded-lg bg-PrimaryColorLight dark:bg-PrimaryColorDark/20">
            <Phone size={15} className="text-PrimaryColor" />
          </div>,
          "Contact Information",
          "Your phone and location details"
        )}
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label htmlFor="phone" className={labelClasses}>
                Phone Number <span className="text-PrimaryColor">*</span>
              </Label>
              <div className="relative">
                <Phone
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-TextMuted"
                />
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+880 1XXXXXXXXX"
                  className={`pl-9 ${inputClasses}`}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="location" className={labelClasses}>
                Location <span className="text-PrimaryColor">*</span>
              </Label>
              <div className="relative">
                <MapPin
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-TextMuted"
                />
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Dhaka, Bangladesh"
                  className={`pl-9 ${inputClasses}`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={sectionCard}>
        {sectionHeader(
          <div className="flex size-8 items-center justify-center rounded-lg bg-SrcPrimaryColorLight dark:bg-SrcPrimaryColorDark/20">
            <User size={15} className="text-SrcPrimaryColor" />
          </div>,
          "Professional Summary",
          "A brief overview of who you are"
        )}
        <div className="p-6">
          <div className="space-y-1.5">
            <Label htmlFor="bio" className={labelClasses}>
              Bio <span className="text-PrimaryColor">*</span>
            </Label>
            <textarea
              id="bio"
              rows={4}
              maxLength={500}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Share your professional background, expertise, and career goals..."
              className={textareaClasses}
            />
            <p className="text-[11px] font-SecondaryFont text-TextMuted">
              {bio.length}/500 characters
            </p>
          </div>
        </div>
      </div>

      <div className={sectionCard}>
        {sectionHeader(
          <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-PrimaryColorLight to-SrcPrimaryColorLight dark:from-PrimaryColorDark/20 dark:to-SrcPrimaryColorDark/20">
            <FileText size={15} className="text-PrimaryColor" />
          </div>,
          "Resume",
          "Link to your resume document"
        )}
        <div className="p-6">
          <div className="space-y-1.5">
            <Label htmlFor="resumeUrl" className={labelClasses}>
              Resume URL
            </Label>
            <div className="relative">
              <FileText
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-TextMuted"
              />
              <Input
                id="resumeUrl"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                placeholder="https://drive.google.com/your-resume.pdf"
                className={`pl-9 ${inputClasses}`}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={sectionCard}>
        {sectionHeader(
          <div className="flex size-8 items-center justify-center rounded-lg bg-SrcPrimaryColorLight dark:bg-SrcPrimaryColorDark/20">
            <Link size={15} className="text-SrcPrimaryColor" />
          </div>,
          "Social Links",
          "Your professional online presence"
        )}
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                id: "linkedinUrl",
                label: "LinkedIn",
                value: linkedinUrl,
                setter: setLinkedinUrl,
                placeholder: "linkedin.com/in/username",
              },
              {
                id: "portfolioUrl",
                label: "Portfolio",
                value: portfolioUrl,
                setter: setPortfolioUrl,
                placeholder: "yoursite.com",
              },
              {
                id: "githubUrl",
                label: "GitHub",
                value: githubUrl,
                setter: setGithubUrl,
                placeholder: "github.com/username",
              },
            ].map((field) => (
              <div key={field.id} className="space-y-1.5">
                <Label htmlFor={field.id} className={labelClasses}>
                  {field.label}
                </Label>
                <div className="relative">
                  <Link
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-TextMuted"
                  />
                  <Input
                    id={field.id}
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    placeholder={field.placeholder}
                    className={`pl-9 ${inputClasses}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={sectionCard}>
        {sectionHeader(
          <div className="flex size-8 items-center justify-center rounded-lg bg-PrimaryColorLight dark:bg-PrimaryColorDark/20">
            <Award size={15} className="text-PrimaryColor" />
          </div>,
          "Skills",
          "Your key competencies (max 15)"
        )}
        <div className="p-6 space-y-4">
          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              placeholder="Type a skill and press Enter..."
              className={inputClasses}
            />
            <Button
              type="button"
              onClick={addSkill}
              disabled={!newSkill.trim() || skills.length >= 15}
              className="h-10 px-4 rounded-xl bg-SrcPrimaryColor hover:bg-SrcPrimaryColorHover text-white font-SecondaryFont font-medium transition-colors cursor-pointer shrink-0"
            >
              <Plus size={16} /> Add
            </Button>
          </div>
          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-PrimaryColorLight dark:bg-PrimaryColorDark/20 border border-PrimaryColor/15 px-3 py-1.5 text-sm font-SecondaryFont text-PrimaryColor"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="p-0.5 rounded-full hover:bg-PrimaryColor/15 transition-colors cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 rounded-xl border border-dashed border-Border dark:border-secondary">
              <Award size={28} className="text-TextMuted mb-2" />
              <p className="text-xs font-SecondaryFont text-TextMuted">
                No skills added yet
              </p>
            </div>
          )}
        </div>
      </div>

      <div className={sectionCard}>
        <div className="px-6 py-4 border-b border-Border dark:border-secondary bg-BorderLight/30 dark:bg-secondary/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-SrcPrimaryColorLight dark:bg-SrcPrimaryColorDark/20">
                <GraduationCap size={15} className="text-SrcPrimaryColor" />
              </div>
              <div>
                <h3 className="text-sm font-semibold font-PrimaryFont text-TextPrimary dark:text-white">
                  Education
                </h3>
                <p className="text-[11px] font-SecondaryFont text-TextMuted">
                  Your academic background
                </p>
              </div>
            </div>
            <Button
              type="button"
              onClick={addEducation}
              className="h-8 px-3 rounded-lg bg-SrcPrimaryColor hover:bg-SrcPrimaryColorHover text-white font-SecondaryFont font-medium text-xs transition-colors cursor-pointer"
            >
              <Plus size={14} /> Add
            </Button>
          </div>
        </div>
        <div className="p-6">
          {education.length > 0 ? (
            <div className="space-y-3">
              {education.map((edu, index) => (
                <div
                  key={index}
                  className="relative rounded-xl border border-Border dark:border-secondary p-4 space-y-3 group hover:border-PrimaryColor/30 transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => removeEducation(index)}
                    className="absolute top-3 right-3 p-1 rounded-lg text-TextMuted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className={sublabelClasses}>Institution</Label>
                      <Input
                        value={edu.institution}
                        onChange={(e) =>
                          updateEducation(index, "institution", e.target.value)
                        }
                        placeholder="University name"
                        className={inputClasses}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className={sublabelClasses}>Degree</Label>
                      <Input
                        value={edu.degree}
                        onChange={(e) =>
                          updateEducation(index, "degree", e.target.value)
                        }
                        placeholder="B.Sc."
                        className={inputClasses}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className={sublabelClasses}>Field of Study</Label>
                      <Input
                        value={edu.field}
                        onChange={(e) =>
                          updateEducation(index, "field", e.target.value)
                        }
                        placeholder="Computer Science"
                        className={inputClasses}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className={sublabelClasses}>Start Date</Label>
                      <Input
                        type="date"
                        value={edu.startDate}
                        onChange={(e) =>
                          updateEducation(index, "startDate", e.target.value)
                        }
                        className={inputClasses}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className={sublabelClasses}>End Date</Label>
                      <Input
                        type="date"
                        value={edu.endDate}
                        onChange={(e) =>
                          updateEducation(index, "endDate", e.target.value)
                        }
                        className={inputClasses}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 rounded-xl border border-dashed border-Border dark:border-secondary">
              <GraduationCap size={28} className="text-TextMuted mb-2" />
              <p className="text-xs font-SecondaryFont text-TextMuted">
                No education entries yet
              </p>
            </div>
          )}
        </div>
      </div>

      <div className={sectionCard}>
        <div className="px-6 py-4 border-b border-Border dark:border-secondary bg-BorderLight/30 dark:bg-secondary/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-PrimaryColorLight dark:bg-PrimaryColorDark/20">
                <Building size={15} className="text-PrimaryColor" />
              </div>
              <div>
                <h3 className="text-sm font-semibold font-PrimaryFont text-TextPrimary dark:text-white">
                  Work Experience
                </h3>
                <p className="text-[11px] font-SecondaryFont text-TextMuted">
                  Your professional history
                </p>
              </div>
            </div>
            <Button
              type="button"
              onClick={addExperience}
              className="h-8 px-3 rounded-lg bg-PrimaryColor hover:bg-PrimaryColorHover text-white font-SecondaryFont font-medium text-xs transition-colors cursor-pointer"
            >
              <Plus size={14} /> Add
            </Button>
          </div>
        </div>
        <div className="p-6">
          {experience.length > 0 ? (
            <div className="space-y-3">
              {experience.map((exp, index) => (
                <div
                  key={index}
                  className="relative rounded-xl border border-Border dark:border-secondary p-4 space-y-3 group hover:border-PrimaryColor/30 transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => removeExperience(index)}
                    className="absolute top-3 right-3 p-1 rounded-lg text-TextMuted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className={sublabelClasses}>Company</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) =>
                          updateExperience(index, "company", e.target.value)
                        }
                        placeholder="Company name"
                        className={inputClasses}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className={sublabelClasses}>Position</Label>
                      <Input
                        value={exp.position}
                        onChange={(e) =>
                          updateExperience(index, "position", e.target.value)
                        }
                        placeholder="Frontend Developer"
                        className={inputClasses}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className={sublabelClasses}>Start Date</Label>
                      <Input
                        type="date"
                        value={exp.startDate}
                        onChange={(e) =>
                          updateExperience(index, "startDate", e.target.value)
                        }
                        className={inputClasses}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className={sublabelClasses}>End Date</Label>
                      <Input
                        type="date"
                        value={exp.endDate}
                        onChange={(e) =>
                          updateExperience(index, "endDate", e.target.value)
                        }
                        className={inputClasses}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className={sublabelClasses}>Description</Label>
                    <textarea
                      rows={3}
                      value={exp.description}
                      onChange={(e) =>
                        updateExperience(index, "description", e.target.value)
                      }
                      placeholder="Describe your responsibilities and achievements..."
                      className={textareaClasses}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 rounded-xl border border-dashed border-Border dark:border-secondary">
              <Building size={28} className="text-TextMuted mb-2" />
              <p className="text-xs font-SecondaryFont text-TextMuted">
                No work experience yet
              </p>
            </div>
          )}
        </div>
      </div>

      <PlanUpgradeCard
        currentPlan={
          ((session?.user as Record<string, unknown>)?.plan as string) ||
          "free_seeker"
        }
        role={
          ((session?.user as Record<string, unknown>)?.role as string) ||
          "seeker"
        }
      />

      <div className="flex items-center justify-end gap-3 pb-4">
        <Button
          type="button"
          onClick={handleCancel}
          className="h-11 px-6 rounded-xl border border-Border dark:border-secondary bg-white dark:bg-[#1e293b] text-TextPrimary dark:text-surface font-SecondaryFont font-semibold hover:bg-BorderLight dark:hover:bg-secondary/20 transition-colors cursor-pointer"
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="h-11 px-8 rounded-xl bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor hover:from-PrimaryColorHover hover:to-SrcPrimaryColorHover text-white font-SecondaryFont font-semibold transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
        >
          {saving ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save size={16} /> Save Profile
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default SeekerProfileForm;
