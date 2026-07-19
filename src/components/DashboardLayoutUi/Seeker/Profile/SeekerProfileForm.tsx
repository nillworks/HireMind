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
  Briefcase,
  Plus,
  X,
  Save,
  Loader2,
} from "lucide-react";

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
  "h-10 bg-white dark:bg-[#0f172a] border-Border dark:border-secondary text-TextPrimary dark:text-surface font-SecondaryFont placeholder:text-TextMuted rounded-xl";

const textareaClasses =
  "flex w-full rounded-xl border border-Border dark:border-secondary bg-white dark:bg-[#0f172a] px-3 py-2.5 text-sm font-SecondaryFont text-TextPrimary dark:text-surface placeholder:text-TextMuted outline-none focus:border-PrimaryColor focus:ring-2 focus:ring-PrimaryColor/20 transition-colors resize-none";

const SeekerProfileForm = ({ profile }: SeekerProfileFormProps) => {
  const { data: session } = useSession();
  const [saving, setSaving] = useState(false);

  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [location, setLocation] = useState(profile?.location ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [resumeUrl, setResumeUrl] = useState(profile?.resumeUrl ?? "");
  const [linkedinUrl, setLinkedinUrl] = useState(profile?.linkedinUrl ?? "");
  const [portfolioUrl, setPortfolioUrl] = useState(
    profile?.portfolioUrl ?? ""
  );
  const [githubUrl, setGithubUrl] = useState(profile?.githubUrl ?? "");
  const [skills, setSkills] = useState<string[]>(profile?.skills ?? []);
  const [newSkill, setNewSkill] = useState("");
  const [education, setEducation] = useState<Education[]>(
    profile?.education ?? []
  );
  const [experience, setExperience] = useState<Experience[]>(
    profile?.experience ?? []
  );

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

  const addEducation = () => {
    setEducation((prev) => [...prev, { ...emptyEducation }]);
  };

  const removeEducation = (index: number) => {
    setEducation((prev) => prev.filter((_, i) => i !== index));
  };

  const updateEducation = (
    index: number,
    field: keyof Education,
    value: string
  ) => {
    setEducation((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const addExperience = () => {
    setExperience((prev) => [...prev, { ...emptyExperience }]);
  };

  const removeExperience = (index: number) => {
    setExperience((prev) => prev.filter((_, i) => i !== index));
  };

  const updateExperience = (
    index: number,
    field: keyof Experience,
    value: string
  ) => {
    setExperience((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

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
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to update profile.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-PrimaryColorLight dark:bg-PrimaryColorDark/20">
            <Phone size={18} className="text-PrimaryColor" />
          </div>
          <div>
            <h3 className="text-base font-semibold font-PrimaryFont text-TextPrimary dark:text-surface">
              Contact Information
            </h3>
            <p className="text-xs font-SecondaryFont text-TextMuted">
              Your contact details
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label
              htmlFor="phone"
              className="text-TextPrimary dark:text-surface font-SecondaryFont"
            >
              Phone Number <span className="text-PrimaryColor">*</span>
            </Label>
            <div className="relative">
              <Phone
                size={16}
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

          <div className="space-y-2">
            <Label
              htmlFor="location"
              className="text-TextPrimary dark:text-surface font-SecondaryFont"
            >
              Location <span className="text-PrimaryColor">*</span>
            </Label>
            <div className="relative">
              <MapPin
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-TextMuted"
              />
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Dhaka, Bangladesh"
                className={`pl-9 ${inputClasses}`}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-SrcPrimaryColorLight dark:bg-SrcPrimaryColorDark/20">
            <User size={18} className="text-SrcPrimaryColor" />
          </div>
          <div>
            <h3 className="text-base font-semibold font-PrimaryFont text-TextPrimary dark:text-surface">
              Professional Summary
            </h3>
            <p className="text-xs font-SecondaryFont text-TextMuted">
              A brief overview of your experience
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="bio"
            className="text-TextPrimary dark:text-surface font-SecondaryFont"
          >
            Bio <span className="text-PrimaryColor">*</span>
          </Label>
          <textarea
            id="bio"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write a short summary about yourself, your expertise, and career goals..."
            className={textareaClasses}
          />
        </div>
      </div>

      <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-PrimaryColorLight to-SrcPrimaryColorLight dark:from-PrimaryColorDark/20 dark:to-SrcPrimaryColorDark/20">
            <FileText size={18} className="text-PrimaryColor" />
          </div>
          <div>
            <h3 className="text-base font-semibold font-PrimaryFont text-TextPrimary dark:text-surface">
              Resume
            </h3>
            <p className="text-xs font-SecondaryFont text-TextMuted">
              Link to your resume document
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="resumeUrl"
            className="text-TextPrimary dark:text-surface font-SecondaryFont"
          >
            Resume URL
          </Label>
          <div className="relative">
            <FileText
              size={16}
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

      <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-SrcPrimaryColorLight dark:bg-SrcPrimaryColorDark/20">
            <Link size={18} className="text-SrcPrimaryColor" />
          </div>
          <div>
            <h3 className="text-base font-semibold font-PrimaryFont text-TextPrimary dark:text-surface">
              Social Links
            </h3>
            <p className="text-xs font-SecondaryFont text-TextMuted">
              Your professional online presence
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="space-y-2">
            <Label
              htmlFor="linkedinUrl"
              className="text-TextPrimary dark:text-surface font-SecondaryFont"
            >
              LinkedIn
            </Label>
            <div className="relative">
              <Link
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-TextMuted"
              />
              <Input
                id="linkedinUrl"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="linkedin.com/in/username"
                className={`pl-9 ${inputClasses}`}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="portfolioUrl"
              className="text-TextPrimary dark:text-surface font-SecondaryFont"
            >
              Portfolio
            </Label>
            <div className="relative">
              <Link
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-TextMuted"
              />
              <Input
                id="portfolioUrl"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="yoursite.com"
                className={`pl-9 ${inputClasses}`}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="githubUrl"
              className="text-TextPrimary dark:text-surface font-SecondaryFont"
            >
              GitHub
            </Label>
            <div className="relative">
              <Link
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-TextMuted"
              />
              <Input
                id="githubUrl"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="github.com/username"
                className={`pl-9 ${inputClasses}`}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-PrimaryColorLight dark:bg-PrimaryColorDark/20">
            <Briefcase size={18} className="text-PrimaryColor" />
          </div>
          <div>
            <h3 className="text-base font-semibold font-PrimaryFont text-TextPrimary dark:text-surface">
              Skills <span className="text-PrimaryColor">*</span>
            </h3>
            <p className="text-xs font-SecondaryFont text-TextMuted">
              Your key competencies (max 15)
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                placeholder="Type a skill and press Enter or click Add..."
                className={inputClasses}
              />
            </div>
            <Button
              type="button"
              onClick={addSkill}
              disabled={!newSkill.trim() || skills.length >= 15}
              className="h-10 px-4 rounded-xl bg-SrcPrimaryColor hover:bg-SrcPrimaryColorHover text-white font-SecondaryFont font-medium transition-colors cursor-pointer"
            >
              <Plus size={16} />
              Add
            </Button>
          </div>

          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-PrimaryColorLight dark:bg-PrimaryColorDark/20 border border-PrimaryColor/20 px-3 py-1.5 text-sm font-SecondaryFont text-PrimaryColor"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="p-0.5 rounded-full hover:bg-PrimaryColor/10 transition-colors cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 rounded-xl border border-dashed border-Border dark:border-secondary">
              <Briefcase size={32} className="text-TextMuted mb-2" />
              <p className="text-sm font-SecondaryFont text-TextMuted">
                No skills added yet
              </p>
              <p className="text-xs font-SecondaryFont text-TextMuted/70 mt-1">
                Type a skill above and press Enter
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-SrcPrimaryColorLight dark:bg-SrcPrimaryColorDark/20">
              <GraduationCap size={18} className="text-SrcPrimaryColor" />
            </div>
            <div>
              <h3 className="text-base font-semibold font-PrimaryFont text-TextPrimary dark:text-surface">
                Education
              </h3>
              <p className="text-xs font-SecondaryFont text-TextMuted">
                Your academic background
              </p>
            </div>
          </div>
          <Button
            type="button"
            onClick={addEducation}
            className="h-9 px-3 rounded-xl bg-SrcPrimaryColor hover:bg-SrcPrimaryColorHover text-white font-SecondaryFont font-medium text-sm transition-colors cursor-pointer"
          >
            <Plus size={16} />
            Add
          </Button>
        </div>

        {education.length > 0 ? (
          <div className="space-y-4">
            {education.map((edu, index) => (
              <div
                key={index}
                className="relative rounded-xl border border-Border dark:border-secondary p-4 space-y-4 group"
              >
                <button
                  type="button"
                  onClick={() => removeEducation(index)}
                  className="absolute top-3 right-3 p-1.5 rounded-lg text-TextMuted hover:text-PrimaryColor hover:bg-PrimaryColorLight dark:hover:bg-PrimaryColorDark/20 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                >
                  <X size={14} />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-TextPrimary dark:text-surface font-SecondaryFont text-xs">
                      Institution
                    </Label>
                    <Input
                      value={edu.institution}
                      onChange={(e) =>
                        updateEducation(index, "institution", e.target.value)
                      }
                      placeholder="University name"
                      className={inputClasses}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-TextPrimary dark:text-surface font-SecondaryFont text-xs">
                      Degree
                    </Label>
                    <Input
                      value={edu.degree}
                      onChange={(e) =>
                        updateEducation(index, "degree", e.target.value)
                      }
                      placeholder="e.g. B.Sc."
                      className={inputClasses}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-TextPrimary dark:text-surface font-SecondaryFont text-xs">
                      Field of Study
                    </Label>
                    <Input
                      value={edu.field}
                      onChange={(e) =>
                        updateEducation(index, "field", e.target.value)
                      }
                      placeholder="e.g. Computer Science"
                      className={inputClasses}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-TextPrimary dark:text-surface font-SecondaryFont text-xs">
                      Start Date
                    </Label>
                    <Input
                      type="date"
                      value={edu.startDate}
                      onChange={(e) =>
                        updateEducation(index, "startDate", e.target.value)
                      }
                      className={inputClasses}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-TextPrimary dark:text-surface font-SecondaryFont text-xs">
                      End Date
                    </Label>
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
          <div className="flex flex-col items-center justify-center py-8 rounded-xl border border-dashed border-Border dark:border-secondary">
            <GraduationCap size={32} className="text-TextMuted mb-2" />
            <p className="text-sm font-SecondaryFont text-TextMuted">
              No education entries yet
            </p>
            <p className="text-xs font-SecondaryFont text-TextMuted/70 mt-1">
              Click Add to include your education
            </p>
          </div>
        )}
      </div>

      <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-PrimaryColorLight dark:bg-PrimaryColorDark/20">
              <Briefcase size={18} className="text-PrimaryColor" />
            </div>
            <div>
              <h3 className="text-base font-semibold font-PrimaryFont text-TextPrimary dark:text-surface">
                Work Experience
              </h3>
              <p className="text-xs font-SecondaryFont text-TextMuted">
                Your professional history
              </p>
            </div>
          </div>
          <Button
            type="button"
            onClick={addExperience}
            className="h-9 px-3 rounded-xl bg-PrimaryColor hover:bg-PrimaryColorHover text-white font-SecondaryFont font-medium text-sm transition-colors cursor-pointer"
          >
            <Plus size={16} />
            Add
          </Button>
        </div>

        {experience.length > 0 ? (
          <div className="space-y-4">
            {experience.map((exp, index) => (
              <div
                key={index}
                className="relative rounded-xl border border-Border dark:border-secondary p-4 space-y-4 group"
              >
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="absolute top-3 right-3 p-1.5 rounded-lg text-TextMuted hover:text-PrimaryColor hover:bg-PrimaryColorLight dark:hover:bg-PrimaryColorDark/20 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                >
                  <X size={14} />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-TextPrimary dark:text-surface font-SecondaryFont text-xs">
                      Company
                    </Label>
                    <Input
                      value={exp.company}
                      onChange={(e) =>
                        updateExperience(index, "company", e.target.value)
                      }
                      placeholder="Company name"
                      className={inputClasses}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-TextPrimary dark:text-surface font-SecondaryFont text-xs">
                      Position
                    </Label>
                    <Input
                      value={exp.position}
                      onChange={(e) =>
                        updateExperience(index, "position", e.target.value)
                      }
                      placeholder="e.g. Frontend Developer"
                      className={inputClasses}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-TextPrimary dark:text-surface font-SecondaryFont text-xs">
                      Start Date
                    </Label>
                    <Input
                      type="date"
                      value={exp.startDate}
                      onChange={(e) =>
                        updateExperience(index, "startDate", e.target.value)
                      }
                      className={inputClasses}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-TextPrimary dark:text-surface font-SecondaryFont text-xs">
                      End Date
                    </Label>
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

                <div className="space-y-2">
                  <Label className="text-TextPrimary dark:text-surface font-SecondaryFont text-xs">
                    Description
                  </Label>
                  <textarea
                    rows={3}
                    value={exp.description}
                    onChange={(e) =>
                      updateExperience(index, "description", e.target.value)
                    }
                    placeholder="Describe your role and responsibilities..."
                    className={textareaClasses}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 rounded-xl border border-dashed border-Border dark:border-secondary">
            <Briefcase size={32} className="text-TextMuted mb-2" />
            <p className="text-sm font-SecondaryFont text-TextMuted">
              No experience entries yet
            </p>
            <p className="text-xs font-SecondaryFont text-TextMuted/70 mt-1">
              Click Add to include your work experience
            </p>
          </div>
        )}
      </div>

      <PlanUpgradeCard
        currentPlan={(session?.user as any)?.plan || "free_seeker"}
        role={(session?.user as any)?.role || "seeker"}
      />

      <div className="flex items-center justify-end">
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="h-10 px-6 rounded-xl bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor hover:from-PrimaryColorHover hover:to-SrcPrimaryColorHover text-white font-SecondaryFont font-semibold transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
        >
          {saving ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={16} />
              Save Profile
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default SeekerProfileForm;
