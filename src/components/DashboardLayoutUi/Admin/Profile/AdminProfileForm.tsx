"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { authClient, useSession } from "@/lib/auth-client";
import { uploadImageToImgBB } from "@/lib/imageUpload";
import { Mail, Pencil, X, Camera, Save, Loader2, User } from "lucide-react";
import { motion, type Variants } from "framer-motion";

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

const AdminProfileForm = () => {
  const { data: session } = useSession();
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const user = session?.user;
  const initial = user?.name?.charAt(0)?.toUpperCase() ?? "A";
  const personalName = displayName ?? user?.name ?? "";
  const personalAvatar = avatarImage ?? user?.image ?? "";

  const handleCancel = () => {
    setDisplayName(null);
    setAvatarImage(null);
    setMode("view");
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      const url = await uploadImageToImgBB(file);
      setAvatarImage(url);
      toast.success("Profile picture uploaded successfully");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Profile picture upload failed"
      );
    } finally {
      setAvatarUploading(false);
      e.target.value = "";
    }
  };

  const handleSave = async () => {
    if (!personalName.trim()) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    try {
      await authClient.updateUser({
        name: personalName.trim(),
        image: personalAvatar || null,
      });
      toast.success("Profile updated successfully!");
      setMode("view");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

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
                {user?.name ?? "Administrator"}
              </h2>
              <p className="text-white/80 font-SecondaryFont flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {user?.email ?? ""}
              </p>
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

      {mode === "edit" && (
        <motion.div variants={itemVariants}>
          <div className="rounded-2xl border border-Border bg-white dark:bg-[#1e293b] dark:border-secondary p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-PrimaryFont text-TextPrimary dark:text-surface flex items-center gap-2">
                <User className="w-5 h-5 text-PrimaryColor" />
                Personal Information
              </h3>
              <Button
                onClick={handleCancel}
                className="h-8 px-3 rounded-lg font-SecondaryFont border border-Border dark:border-secondary bg-white dark:bg-[#1e293b] text-TextPrimary dark:text-surface text-xs cursor-pointer"
              >
                <X className="w-3.5 h-3.5 mr-1" />
                Cancel
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="flex flex-col items-center gap-3 shrink-0">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-4 border-PrimaryColor/20 overflow-hidden flex items-center justify-center bg-PrimaryColorLight dark:bg-PrimaryColorDark/20">
                    {personalAvatar ? (
                      <img
                        src={personalAvatar}
                        alt={personalName || "Avatar"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-bold font-PrimaryFont text-PrimaryColor">
                        {(personalName || "A").charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 size-8 rounded-full bg-PrimaryColor hover:bg-PrimaryColorHover text-white flex items-center justify-center border-2 border-white dark:border-[#1e293b] cursor-pointer transition-colors shadow-md">
                    {avatarUploading ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Camera size={13} />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={avatarUploading}
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>
                <p className="text-[11px] font-SecondaryFont text-TextMuted">
                  Click the camera icon to upload
                </p>
              </div>
              <div className="flex-1 w-full space-y-2">
                <div className="space-y-1.5">
                  <Label className="font-SecondaryFont text-TextPrimary dark:text-surface">
                    Full Name *
                  </Label>
                  <Input
                    value={personalName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your full name"
                    className="rounded-xl font-SecondaryFont bg-white dark:bg-[#0f172a] border-Border dark:border-secondary text-TextPrimary dark:text-surface"
                  />
                </div>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-5 py-2 rounded-xl font-SecondaryFont bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor text-white hover:opacity-90 cursor-pointer disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Personal Info
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AdminProfileForm;
