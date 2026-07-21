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
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { authClient, signUp, signOut } from "@/lib/auth-client";
import { uploadImageToImgBB } from "@/lib/imageUpload";
import CustomToast from "@/components/shared/CustomToast";

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const RegesterPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateEmail = (val: string): string | undefined => {
    if (!val.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) return "Please enter a valid email address";
    return undefined;
  };

  const validatePassword = (val: string): string | undefined => {
    if (!val) return "Password is required";
    if (val.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(val)) return "Must contain an uppercase letter";
    if (!/[a-z]/.test(val)) return "Must contain a lowercase letter";
    if (!/[0-9]/.test(val)) return "Must contain a number";
    return undefined;
  };

  const validateName = (val: string): string | undefined => {
    if (!val.trim()) return "Full name is required";
    if (val.trim().length < 2) return "Name must be at least 2 characters";
    return undefined;
  };

  const validateConfirmPassword = (val: string): string | undefined => {
    if (!val) return "Please confirm your password";
    if (val !== password) return "Passwords do not match";
    return undefined;
  };

  const validateField = (field: string, val: string): string | undefined => {
    switch (field) {
      case "name": return validateName(val);
      case "email": return validateEmail(val);
      case "password": return validatePassword(val);
      case "confirmPassword": return validateConfirmPassword(val);
      default: return undefined;
    }
  };

  const getFieldError = (field: string, val: string): string | undefined => {
    if (!touched[field]) return undefined;
    return validateField(field, val);
  };

  const handleChange = (field: string, val: string, setter: (v: string) => void) => {
    setter(val);
    if (touched[field]) {
      const err = validateField(field, val);
      setErrors((prev) => ({ ...prev, [field]: err }));
      if (field === "password" && touched["confirmPassword"]) {
        const confirmErr = val !== confirmPassword ? "Passwords do not match" : undefined;
        setErrors((prev) => ({ ...prev, confirmPassword: confirmErr }));
      }
    }
  };

  const handleBlur = (field: string, val: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field, val);
    setErrors((prev) => ({ ...prev, [field]: err }));
    if (field === "password" && confirmPassword) {
      const confirmErr = val !== confirmPassword ? "Passwords do not match" : undefined;
      setErrors((prev) => ({ ...prev, confirmPassword: confirmErr }));
    }
  };

  const isFormValid = (): boolean => {
    const nameErr = validateName(name);
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    const confirmErr = validateConfirmPassword(confirmPassword);
    return !nameErr && !emailErr && !passErr && !confirmErr;
  };

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

    const allTouched = { name: true, email: true, password: true, confirmPassword: true };
    setTouched(allTouched);

    const nameErr = validateName(name);
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    const confirmErr = validateConfirmPassword(confirmPassword);

    setErrors({ name: nameErr, email: emailErr, password: passErr, confirmPassword: confirmErr });

    if (nameErr || emailErr || passErr || confirmErr) return;

    setIsLoading(true);

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
      name,
      email,
      password,
      image: imageUrl,
      role: "seeker",
    } as any);

    if (signUpError) {
      toast.error(signUpError.message || "Registration failed. Please try again.");
      setIsLoading(false);
      return;
    }

    if (!signUpError) {
      await signOut()
      toast.success("Account created! Please sign in.");
      router.push(`/login`);
    }
    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    // setIsLoading(true);

    const { error } = await authClient.signIn.social({
      provider: "google",
      // callbackURL: "/dashboard",
      // errorCallbackURL: "/regester",
    });

    if (error) {
      toast.error(error.message || "Failed to sign in with Google");
      // setIsLoading(false);
    }
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
              <div className="space-y-1.5">
                <Label htmlFor="name" className="font-SecondaryFont text-TextPrimary text-sm">
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
                    value={name}
                    onChange={(e) => handleChange("name", e.target.value, setName)}
                    onBlur={() => handleBlur("name", name)}
                    placeholder="John Doe"
                    className={cn(
                      "pl-10 h-11 rounded-xl bg-Surface text-TextPrimary placeholder:text-TextMuted transition-colors",
                      errors.name && touched.name
                        ? "border-PrimaryColor focus:border-PrimaryColor focus:ring-PrimaryColor/20"
                        : name && !errors.name
                          ? "border-SrcPrimaryColor focus:border-SrcPrimaryColor focus:ring-SrcPrimaryColor/20"
                          : "border-Border focus:border-SrcPrimaryColor focus:ring-SrcPrimaryColor/20"
                    )}
                    required
                  />
                  {name && !errors.name && (
                    <CheckCircle2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-SrcPrimaryColor" />
                  )}
                </div>
                {errors.name && touched.name && (
                  <p className="flex items-center gap-1 text-xs text-PrimaryColor font-SecondaryFont mt-1">
                    <AlertCircle size={12} />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="font-SecondaryFont text-TextPrimary text-sm">
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
                    value={email}
                    onChange={(e) => handleChange("email", e.target.value, setEmail)}
                    onBlur={() => handleBlur("email", email)}
                    placeholder="you@example.com"
                    className={cn(
                      "pl-10 h-11 rounded-xl bg-Surface text-TextPrimary placeholder:text-TextMuted transition-colors",
                      errors.email && touched.email
                        ? "border-PrimaryColor focus:border-PrimaryColor focus:ring-PrimaryColor/20"
                        : email && !errors.email
                          ? "border-SrcPrimaryColor focus:border-SrcPrimaryColor focus:ring-SrcPrimaryColor/20"
                          : "border-Border focus:border-SrcPrimaryColor focus:ring-SrcPrimaryColor/20"
                    )}
                    required
                  />
                  {email && !errors.email && (
                    <CheckCircle2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-SrcPrimaryColor" />
                  )}
                </div>
                {errors.email && touched.email && (
                  <p className="flex items-center gap-1 text-xs text-PrimaryColor font-SecondaryFont mt-1">
                    <AlertCircle size={12} />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="font-SecondaryFont text-TextPrimary text-sm">
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
                    value={password}
                    onChange={(e) => handleChange("password", e.target.value, setPassword)}
                    onBlur={() => handleBlur("password", password)}
                    placeholder="Create a password"
                    className={cn(
                      "pl-10 pr-10 h-11 rounded-xl bg-Surface text-TextPrimary placeholder:text-TextMuted transition-colors",
                      errors.password && touched.password
                        ? "border-PrimaryColor focus:border-PrimaryColor focus:ring-PrimaryColor/20"
                        : password && !errors.password
                          ? "border-SrcPrimaryColor focus:border-SrcPrimaryColor focus:ring-SrcPrimaryColor/20"
                          : "border-Border focus:border-SrcPrimaryColor focus:ring-SrcPrimaryColor/20"
                    )}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-TextMuted hover:text-TextSecondary transition-colors cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && touched.password && (
                  <p className="flex items-center gap-1 text-xs text-PrimaryColor font-SecondaryFont mt-1">
                    <AlertCircle size={12} />
                    {errors.password}
                  </p>
                )}
                {password && !errors.password && (
                  <p className="flex items-center gap-1 text-xs text-SrcPrimaryColor font-SecondaryFont mt-1">
                    <CheckCircle2 size={12} />
                    Password is strong
                  </p>
                )}
                {password && (
                  <div className="flex items-center gap-1.5 mt-1">
                    {[
                      { label: "8+ chars", met: password.length >= 8 },
                      { label: "A-Z", met: /[A-Z]/.test(password) },
                      { label: "a-z", met: /[a-z]/.test(password) },
                      { label: "0-9", met: /[0-9]/.test(password) },
                    ].map((rule) => (
                      <span
                        key={rule.label}
                        className={cn(
                          "text-[10px] font-medium font-SecondaryFont px-1.5 py-0.5 rounded-md transition-colors",
                          rule.met
                            ? "bg-SrcPrimaryColorLight text-SrcPrimaryColor dark:bg-SrcPrimaryColor/20"
                            : "bg-BorderLight text-TextMuted dark:bg-secondary/20"
                        )}
                      >
                        {rule.met ? "✓" : "○"} {rule.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-1.5">
                <Label htmlFor="confirm-password" className="font-SecondaryFont text-TextPrimary text-sm">
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
                    value={confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value, setConfirmPassword)}
                    onBlur={() => handleBlur("confirmPassword", confirmPassword)}
                    placeholder="Confirm your password"
                    className={cn(
                      "pl-10 pr-10 h-11 rounded-xl bg-Surface text-TextPrimary placeholder:text-TextMuted transition-colors",
                      errors.confirmPassword && touched.confirmPassword
                        ? "border-PrimaryColor focus:border-PrimaryColor focus:ring-PrimaryColor/20"
                        : confirmPassword && !errors.confirmPassword
                          ? "border-SrcPrimaryColor focus:border-SrcPrimaryColor focus:ring-SrcPrimaryColor/20"
                          : "border-Border focus:border-SrcPrimaryColor focus:ring-SrcPrimaryColor/20"
                    )}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-TextMuted hover:text-TextSecondary transition-colors cursor-pointer"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  {confirmPassword && !errors.confirmPassword && (
                    <CheckCircle2 size={16} className="absolute right-10 top-1/2 -translate-y-1/2 text-SrcPrimaryColor" />
                  )}
                </div>
                {errors.confirmPassword && touched.confirmPassword && (
                  <p className="flex items-center gap-1 text-xs text-PrimaryColor font-SecondaryFont mt-1">
                    <AlertCircle size={12} />
                    {errors.confirmPassword}
                  </p>
                )}
                {confirmPassword && !errors.confirmPassword && (
                  <p className="flex items-center gap-1 text-xs text-SrcPrimaryColor font-SecondaryFont mt-1">
                    <CheckCircle2 size={12} />
                    Passwords match
                  </p>
                )}
              </div>

              {/* Register Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "w-full h-11 rounded-xl font-SecondaryFont font-semibold text-white cursor-pointer",
                  "bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor hover:opacity-90",
                  "transition-all duration-200 shadow-md hover:shadow-lg"
                )}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={18} className="animate-spin" />
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
