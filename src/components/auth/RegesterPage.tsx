"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Camera,
  UserPlus,
  X,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { signUp, signOut } from "@/lib/auth-client";
import { uploadImageToImgBB } from "@/lib/imageUpload";
import CustomToast from "@/components/shared/CustomToast";

const RegesterPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProfileImagePreview(null);
    setProfileImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    let imageUrl: string | undefined;

    if (profileImageFile) {
      try {
        imageUrl = await uploadImageToImgBB(profileImageFile);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to upload profile image");
        setIsLoading(false);
        return;
      }
    }

    const { error: signUpError } = await signUp.email({
      name: data.name as string,
      email: data.email as string,
      password: data.password as string,
      image: imageUrl,
      role: "seeker",
    } as any);

    if (signUpError) {
      toast.error(signUpError.message || "Registration failed. Please try again.");
      setIsLoading(false);
      return;
    }

    await signOut();
    toast.success("Account created! Please sign in.");
    router.push("/login");
    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    // TODO: Implement Google OAuth with Better Auth
    setIsLoading(false);
  };

  return (
    <>
      <CustomToast />
      <section className="min-h-screen flex items-center justify-center bg-Background px-4 py-12 relative overflow-hidden">
        {/* Decorative Elements - Both Colors */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-SrcPrimaryColorLight rounded-full blur-3xl opacity-60 translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-PrimaryColorLight rounded-full blur-3xl opacity-60 -translate-x-1/2 translate-y-1/2" />

        <div className="w-full max-w-md relative z-10">
          {/* Logo / Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-SrcPrimaryColor to-PrimaryColor mb-4">
              <Sparkles className="text-white" size={28} />
            </div>
            <h1 className="font-PrimaryFont text-3xl font-bold text-TextPrimary tracking-tight">
              Create Account
            </h1>
            <p className="font-SecondaryFont text-TextSecondary mt-2">
              Join TalentAI and advance your career
            </p>
          </div>

          {/* Register Form Card */}
          <div className="bg-Surface rounded-2xl shadow-lg border border-Border p-8">
            {/* Register Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Profile Image Upload */}
              <div className="flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="relative group cursor-pointer"
                >
                  <div
                    className={cn(
                      "w-24 h-24 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden transition-colors",
                      profileImagePreview
                        ? "border-SrcPrimaryColor"
                        : "border-Border hover:border-SrcPrimaryColor"
                    )}
                  >
                    {profileImagePreview ? (
                      <img
                        src={profileImagePreview}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera className="text-TextMuted" size={32} />
                    )}
                  </div>
                  {profileImagePreview && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage();
                      }}
                      className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-PrimaryColor text-white flex items-center justify-center hover:bg-PrimaryColorHover transition-colors cursor-pointer"
                      aria-label="Remove image"
                    >
                      <X size={14} />
                    </span>
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="profile-image"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="font-SecondaryFont text-sm text-SrcPrimaryColor hover:text-SrcPrimaryColorHover cursor-pointer transition-colors bg-transparent border-none p-0"
                >
                  {profileImagePreview ? "Change photo" : "Upload photo"}
                </button>
              </div>

              {/* Name Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="font-SecondaryFont text-TextPrimary"
                >
                  Full Name
                </Label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-TextMuted"
                    size={18}
                  />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    className="pl-10 h-11 rounded-xl border-Border bg-Surface text-TextPrimary placeholder:text-TextMuted focus:border-SrcPrimaryColor focus:ring-SrcPrimaryColor/20"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="font-SecondaryFont text-TextPrimary"
                >
                  Email
                </Label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-TextMuted"
                    size={18}
                  />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10 h-11 rounded-xl border-Border bg-Surface text-TextPrimary placeholder:text-TextMuted focus:border-SrcPrimaryColor focus:ring-SrcPrimaryColor/20"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="font-SecondaryFont text-TextPrimary"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-TextMuted"
                    size={18}
                  />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    className="pl-10 pr-10 h-11 rounded-xl border-Border bg-Surface text-TextPrimary placeholder:text-TextMuted focus:border-SrcPrimaryColor focus:ring-SrcPrimaryColor/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-TextMuted hover:text-TextSecondary transition-colors cursor-pointer"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="confirm-password"
                  className="font-SecondaryFont text-TextPrimary"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-TextMuted"
                    size={18}
                  />
                  <Input
                    id="confirm-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className={cn(
                      "pl-10 pr-10 h-11 rounded-xl bg-Surface text-TextPrimary placeholder:text-TextMuted",
                      "border-Border focus:border-SrcPrimaryColor focus:ring-SrcPrimaryColor/20"
                    )}
                    required
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-TextMuted hover:text-TextSecondary transition-colors cursor-pointer"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Register Button - Primary Red */}
              <Button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "w-full h-11 rounded-xl font-SecondaryFont font-semibold text-white cursor-pointer",
                  "bg-PrimaryColor hover:bg-PrimaryColorHover active:bg-PrimaryColorActive",
                  "transition-colors duration-200"
                )}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <UserPlus size={18} />
                    Create Account
                  </span>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-Border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-Surface font-SecondaryFont text-TextMuted">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Login Button - Secondary Green */}
            <Button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              variant="outline"
              className={cn(
                "w-full h-11 rounded-xl font-SecondaryFont font-semibold cursor-pointer",
                "border-SrcPrimaryColor text-SrcPrimaryColor hover:bg-SrcPrimaryColorLight hover:border-SrcPrimaryColorLight",
                "transition-colors duration-200"
              )}
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </Button>
          </div>

          {/* Login Link */}
          <p className="mt-6 text-center font-SecondaryFont text-TextSecondary">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-SrcPrimaryColor hover:text-SrcPrimaryColorHover transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </>
  );
};

export default RegesterPage;
