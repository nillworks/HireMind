"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  FileText,
  ListChecks,
  Plus,
  X,
  Loader2,
  CheckCircle,
  ImageIcon,
} from "lucide-react";
import fetchClient from "@/lib/utils/fetchClient";
import { useSession } from "@/lib/auth-client";

const categories = [
  "Technology",
  "Design",
  "Marketing",
  "Finance",
  "Education",
  "Healthcare",
  "Engineering",
  "Sales",
  "Human Resources",
  "Other",
];

const jobTypes = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "remote", label: "Remote" },
  { value: "contract", label: "Contract" },
];

const PostJobForm = () => {
  const router = useRouter();
  const { data } = useSession();
  const user = data?.user;

  const [isPending, startTransition] = useTransition();
  const [requirements, setRequirements] = useState<string[]>([]);
  const [newRequirement, setNewRequirement] = useState("");

  const addRequirement = () => {
    const trimmed = newRequirement.trim();
    if (trimmed && !requirements.includes(trimmed)) {
      setRequirements((prev) => [...prev, trimmed]);
      setNewRequirement("");
    }
  };

  const removeRequirement = (index: number) => {
    setRequirements((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRequirementKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addRequirement();
    }
  };

  const handleSubmit = async (formData: FormData) => {
    const jobData = {
      title: formData.get("title") as string,
      companyName: formData.get("companyName") as string,
      companyLogo: formData.get("companyLogo") as string,
      category: formData.get("category") as string,
      jobType: formData.get("jobType") as string,
      location: formData.get("location") as string,
      salaryMin: Number(formData.get("salaryMin")),
      salaryMax: Number(formData.get("salaryMax")),
      deadline: formData.get("deadline") as string,
      shortDescription: formData.get("shortDescription") as string,
      fullDescription: formData.get("fullDescription") as string,
      requirements,
      recruiterId: user?.id,
      recruiterImage: user?.image,
      recruiterName: user?.name,
      recruiterEmail: user?.email,
    };

    if (
      !jobData.title ||
      !jobData.companyName ||
      !jobData.category ||
      !jobData.jobType ||
      !jobData.location
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    startTransition(async () => {
      try {
        await fetchClient("/api/recruiter/jobs", {
          method: "POST",
          body: JSON.stringify(jobData),
        });
        toast.success("Job posted successfully! It will be visible after admin approval.");
        setTimeout(() => router.push("/dashboard/recruiter/my-jobs"), 2000);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to post job. Please try again.";
        toast.error(msg);
      }
    });
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-PrimaryColorLight dark:bg-PrimaryColorDark/20">
            <Briefcase size={18} className="text-PrimaryColor" />
          </div>
          <div>
            <h3 className="text-base font-semibold font-PrimaryFont text-TextPrimary dark:text-surface">
              Job Information
            </h3>
            <p className="text-xs font-SecondaryFont text-TextMuted">
              Basic details about the position
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-TextPrimary dark:text-surface font-SecondaryFont">
              Job Title <span className="text-PrimaryColor">*</span>
            </Label>
            <div className="relative">
              <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-TextMuted" />
              <Input
                id="title"
                name="title"
                placeholder="e.g. Senior React Developer"
                required
                className="pl-9 h-10 bg-Background dark:bg-dark-bg border-Border dark:border-secondary text-TextPrimary dark:text-surface font-SecondaryFont placeholder:text-TextMuted rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-TextPrimary dark:text-surface font-SecondaryFont">
              Company Name <span className="text-PrimaryColor">*</span>
            </Label>
            <div className="relative">
              <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-TextMuted" />
              <Input
                id="companyName"
                name="companyName"
                placeholder="e.g. TechCorp Inc."
                required
                className="pl-9 h-10 bg-Background dark:bg-dark-bg border-Border dark:border-secondary text-TextPrimary dark:text-surface font-SecondaryFont placeholder:text-TextMuted rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyLogo" className="text-TextPrimary dark:text-surface font-SecondaryFont">
              Company Logo URL
            </Label>
            <div className="relative">
              <ImageIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-TextMuted" />
              <Input
                id="companyLogo"
                name="companyLogo"
                placeholder="https://example.com/logo.png"
                className="pl-9 h-10 bg-Background dark:bg-dark-bg border-Border dark:border-secondary text-TextPrimary dark:text-surface font-SecondaryFont placeholder:text-TextMuted rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-TextPrimary dark:text-surface font-SecondaryFont">
              Location <span className="text-PrimaryColor">*</span>
            </Label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-TextMuted" />
              <Input
                id="location"
                name="location"
                placeholder="e.g. Dhaka, Bangladesh"
                required
                className="pl-9 h-10 bg-Background dark:bg-dark-bg border-Border dark:border-secondary text-TextPrimary dark:text-surface font-SecondaryFont placeholder:text-TextMuted rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-TextPrimary dark:text-surface font-SecondaryFont">
              Category <span className="text-PrimaryColor">*</span>
            </Label>
            <select
              id="category"
              name="category"
              required
              className="flex h-10 w-full rounded-xl border border-Border dark:border-secondary bg-Background dark:bg-dark-bg px-3 py-2 text-sm font-SecondaryFont text-TextPrimary dark:text-surface outline-none focus:border-PrimaryColor focus:ring-2 focus:ring-PrimaryColor/20 transition-colors"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobType" className="text-TextPrimary dark:text-surface font-SecondaryFont">
              Job Type <span className="text-PrimaryColor">*</span>
            </Label>
            <select
              id="jobType"
              name="jobType"
              required
              className="flex h-10 w-full rounded-xl border border-Border dark:border-secondary bg-Background dark:bg-dark-bg px-3 py-2 text-sm font-SecondaryFont text-TextPrimary dark:text-surface outline-none focus:border-PrimaryColor focus:ring-2 focus:ring-PrimaryColor/20 transition-colors"
            >
              <option value="">Select type</option>
              {jobTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-SrcPrimaryColorLight dark:bg-SrcPrimaryColorDark/20">
            <DollarSign size={18} className="text-SrcPrimaryColor" />
          </div>
          <div>
            <h3 className="text-base font-semibold font-PrimaryFont text-TextPrimary dark:text-surface">
              Salary & Deadline
            </h3>
            <p className="text-xs font-SecondaryFont text-TextMuted">
              Compensation and application deadline
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="space-y-2">
            <Label htmlFor="salaryMin" className="text-TextPrimary dark:text-surface font-SecondaryFont">
              Min Salary (BDT)
            </Label>
            <div className="relative">
              <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-TextMuted" />
              <Input
                id="salaryMin"
                name="salaryMin"
                type="number"
                placeholder="20000"
                min="0"
                className="pl-9 h-10 bg-Background dark:bg-dark-bg border-Border dark:border-secondary text-TextPrimary dark:text-surface font-SecondaryFont placeholder:text-TextMuted rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="salaryMax" className="text-TextPrimary dark:text-surface font-SecondaryFont">
              Max Salary (BDT)
            </Label>
            <div className="relative">
              <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-TextMuted" />
              <Input
                id="salaryMax"
                name="salaryMax"
                type="number"
                placeholder="50000"
                min="0"
                className="pl-9 h-10 bg-Background dark:bg-dark-bg border-Border dark:border-secondary text-TextPrimary dark:text-surface font-SecondaryFont placeholder:text-TextMuted rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline" className="text-TextPrimary dark:text-surface font-SecondaryFont">
              Deadline
            </Label>
            <div className="relative">
              <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-TextMuted" />
              <Input
                id="deadline"
                name="deadline"
                type="date"
                className="pl-9 h-10 bg-Background dark:bg-dark-bg border-Border dark:border-secondary text-TextPrimary dark:text-surface font-SecondaryFont rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-PrimaryColorLight to-SrcPrimaryColorLight dark:from-PrimaryColorDark/20 dark:to-SrcPrimaryColorDark/20">
            <FileText size={18} className="text-PrimaryColor" />
          </div>
          <div>
            <h3 className="text-base font-semibold font-PrimaryFont text-TextPrimary dark:text-surface">
              Description
            </h3>
            <p className="text-xs font-SecondaryFont text-TextMuted">
              Describe the role and responsibilities
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="shortDescription" className="text-TextPrimary dark:text-surface font-SecondaryFont">
              Short Description
            </Label>
            <textarea
              id="shortDescription"
              name="shortDescription"
              rows={3}
              placeholder="A brief summary of the job (shown in job cards)..."
              className="flex w-full rounded-xl border border-Border dark:border-secondary bg-Background dark:bg-dark-bg px-3 py-2.5 text-sm font-SecondaryFont text-TextPrimary dark:text-surface placeholder:text-TextMuted outline-none focus:border-PrimaryColor focus:ring-2 focus:ring-PrimaryColor/20 transition-colors resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullDescription" className="text-TextPrimary dark:text-surface font-SecondaryFont">
              Full Description
            </Label>
            <textarea
              id="fullDescription"
              name="fullDescription"
              rows={6}
              placeholder="Detailed job description, responsibilities, what a typical day looks like..."
              className="flex w-full rounded-xl border border-Border dark:border-secondary bg-Background dark:bg-dark-bg px-3 py-2.5 text-sm font-SecondaryFont text-TextPrimary dark:text-surface placeholder:text-TextMuted outline-none focus:border-PrimaryColor focus:ring-2 focus:ring-PrimaryColor/20 transition-colors resize-none"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-SrcPrimaryColorLight dark:bg-SrcPrimaryColorDark/20">
            <ListChecks size={18} className="text-SrcPrimaryColor" />
          </div>
          <div>
            <h3 className="text-base font-semibold font-PrimaryFont text-TextPrimary dark:text-surface">
              Requirements
            </h3>
            <p className="text-xs font-SecondaryFont text-TextMuted">
              Add skills and qualifications needed
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                onKeyDown={handleRequirementKeyDown}
                placeholder="Type a requirement and press Enter or click Add..."
                className="h-10 bg-Background dark:bg-dark-bg border-Border dark:border-secondary text-TextPrimary dark:text-surface font-SecondaryFont placeholder:text-TextMuted rounded-xl"
              />
            </div>
            <Button
              type="button"
              onClick={addRequirement}
              disabled={!newRequirement.trim()}
              className="h-10 px-4 rounded-xl bg-SrcPrimaryColor hover:bg-SrcPrimaryColorHover text-white font-SecondaryFont font-medium transition-colors"
            >
              <Plus size={16} />
              Add
            </Button>
          </div>

          {requirements.length > 0 ? (
            <div className="space-y-2">
              {requirements.map((req, index) => (
                <div
                  key={`${req}-${index}`}
                  className="flex items-center justify-between gap-3 rounded-xl bg-Background dark:bg-dark-bg border border-Border dark:border-secondary px-4 py-2.5 group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-SrcPrimaryColorLight dark:bg-SrcPrimaryColorDark/20 text-xs font-bold font-PrimaryFont text-SrcPrimaryColor">
                      {index + 1}
                    </span>
                    <span className="text-sm font-SecondaryFont text-TextPrimary dark:text-surface truncate">
                      {req}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeRequirement(index)}
                    className="shrink-0 p-1 rounded-lg text-TextMuted hover:text-PrimaryColor hover:bg-PrimaryColorLight dark:hover:bg-PrimaryColorDark/20 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 rounded-xl border border-dashed border-Border dark:border-secondary">
              <ListChecks size={32} className="text-TextMuted mb-2" />
              <p className="text-sm font-SecondaryFont text-TextMuted">
                No requirements added yet
              </p>
              <p className="text-xs font-SecondaryFont text-TextMuted/70 mt-1">
                Type a requirement above and press Enter
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          onClick={() => router.back()}
          variant="outline"
          className="h-10 px-5 rounded-xl font-SecondaryFont font-medium border-Border dark:border-secondary text-TextSecondary dark:text-text-secondary hover:bg-Background dark:hover:bg-dark-bg transition-colors"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="h-10 px-6 rounded-xl bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor hover:from-PrimaryColorHover hover:to-SrcPrimaryColorHover text-white font-SecondaryFont font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
        >
          {isPending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Posting...
            </>
          ) : (
            <>
              <CheckCircle size={16} />
              Post Job
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default PostJobForm;
