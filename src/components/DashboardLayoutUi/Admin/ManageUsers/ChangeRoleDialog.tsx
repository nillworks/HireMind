"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import fetchClient from "@/lib/utils/fetchClient";
import { toast } from "sonner";

interface ChangeRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userName: string;
  currentRole: string;
}

const roles = ["seeker", "recruiter", "admin"] as const;

const ChangeRoleDialog = ({
  open,
  onOpenChange,
  userId,
  userName,
  currentRole,
}: ChangeRoleDialogProps) => {
  const [selectedRole, setSelectedRole] = useState<string>(currentRole);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleConfirm = async () => {
    if (selectedRole === currentRole) {
      onOpenChange(false);
      return;
    }
    setLoading(true);
    try {
      await fetchClient(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role: selectedRole }),
      });
      toast.success(`Role updated! ${userName} is now ${selectedRole}`);
      onOpenChange(false);
      router.refresh();
    } catch {
      toast.error("Failed to change role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="font-PrimaryFont">Change Role</DialogTitle>
          <DialogDescription className="font-SecondaryFont">
            Update role for <span className="font-medium text-TextPrimary dark:text-surface">{userName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-SecondaryFont font-medium transition-all cursor-pointer ${
                selectedRole === role
                  ? "bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor text-white shadow-md"
                  : "bg-gray-50 dark:bg-gray-800 text-TextPrimary dark:text-surface hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="font-SecondaryFont cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading || selectedRole === currentRole}
            className="font-SecondaryFont bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor hover:from-PrimaryColorHover hover:to-SrcPrimaryColorHover text-white cursor-pointer"
          >
            {loading ? "Updating..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeRoleDialog;
