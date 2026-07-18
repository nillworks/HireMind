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
import { AlertTriangle } from "lucide-react";

interface DeleteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userName: string;
}

const DeleteUserDialog = ({
  open,
  onOpenChange,
  userId,
  userName,
}: DeleteUserDialogProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    try {
      await fetchClient(`/api/admin/users/${userId}`, { method: "DELETE" });
      toast.success(`${userName} has been deleted`);
      onOpenChange(false);
      router.refresh();
    } catch {
      toast.error("Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="font-PrimaryFont">Delete User</DialogTitle>
          <DialogDescription className="font-SecondaryFont">
            Are you sure you want to delete{" "}
            <span className="font-medium text-TextPrimary dark:text-surface">{userName}</span>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800">
          <AlertTriangle size={18} className="text-red-600 dark:text-red-400 flex-shrink-0" />
          <p className="text-xs font-SecondaryFont text-red-700 dark:text-red-400">
            This will permanently remove the user and all associated data.
          </p>
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
            onClick={handleDelete}
            disabled={loading}
            className="font-SecondaryFont bg-red-600 hover:bg-red-700 text-white cursor-pointer"
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteUserDialog;
