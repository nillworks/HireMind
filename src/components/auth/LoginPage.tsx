"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, LogIn, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { authClient, signIn, useSession } from "@/lib/auth-client";
import CustomToast from "@/components/shared/CustomToast";

const LoginPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession()
  // const user = session?.user
  // const role = user?.role as string;


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    const { error: signInError } = await signIn.email({
      email: data.email as string,
      password: data.password as string,
      rememberMe,
    });

    if (signInError) {
      toast.error(signInError.message || "Invalid email or password");
      setIsLoading(false);
      return;
    }

    if (!signInError) {
      toast.success("Login success");
      router.push(`/`);
    }
    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    // setIsLoading(true);

    const { error } = await authClient.signIn.social({
      provider: "google",
      // callbackURL: "/dashboard",
      // errorCallbackURL: "/login",
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
        <div className="absolute top-0 left-0 w-72 h-72 bg-PrimaryColorLight rounded-full blur-3xl opacity-60 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-SrcPrimaryColorLight rounded-full blur-3xl opacity-60 translate-x-1/2 translate-y-1/2" />

        <div className="w-full max-w-md relative z-10">
          {/* Logo / Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-PrimaryColor to-SrcPrimaryColor mb-4">
              <Sparkles className="text-white" size={28} />
            </div>
            <h1 className="font-PrimaryFont text-3xl font-bold text-TextPrimary tracking-tight">
              Welcome Back
            </h1>
            <p className="font-SecondaryFont text-TextSecondary mt-2">
              Sign in to your HireMind account
            </p>
          </div>

          {/* Login Form Card */}
          <div className="bg-Surface rounded-2xl shadow-lg border border-Border p-8">
            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
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
                    placeholder="you@example.com"
                    className="pl-10 h-11 rounded-xl border-Border bg-Surface text-TextPrimary placeholder:text-TextMuted focus:border-PrimaryColor focus:ring-PrimaryColor/20"
                    required
                  />
                </div>
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
                    placeholder="Enter your password"
                    className="pl-10 pr-10 h-11 rounded-xl border-Border bg-Surface text-TextPrimary placeholder:text-TextMuted focus:border-PrimaryColor focus:ring-PrimaryColor/20"
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
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      setRememberMe(checked as boolean)
                    }
                  />
                  <Label
                    htmlFor="remember"
                    className="font-SecondaryFont text-sm text-TextSecondary cursor-pointer"
                  >
                    Remember me
                  </Label>
                </div>
                <Link
                  href="/forgot-password"
                  className="font-SecondaryFont text-sm text-SrcPrimaryColor hover:text-SrcPrimaryColorHover transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Login Button */}
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
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <LogIn size={18} />
                    Sign In
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

          {/* Register Link */}
          <p className="mt-6 text-center font-SecondaryFont text-TextSecondary">
            Don&apos;t have an account?{" "}
            <Link
              href="/regester"
              className="font-semibold text-SrcPrimaryColor hover:text-SrcPrimaryColorHover transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </section>
    </>
  );
};

export default LoginPage;
