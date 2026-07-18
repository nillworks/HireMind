import { Suspense } from "react";
import { getAllUsers } from "@/lib/api/admin/adminUsersApi";
import UserTable from "./UserTable";
import ManageUsersSkeleton from "./ManageUsersSkeleton";

const ManageUsersContent = async () => {
  const { users } = await getAllUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-PrimaryFont text-TextPrimary dark:text-surface">
          Manage Users
        </h1>
        <p className="text-sm font-SecondaryFont text-TextMuted mt-1">
          View, block, and manage roles for all platform users.
        </p>
      </div>

      <UserTable users={users} />
    </div>
  );
};

const ManageUsersPage = () => {
  return (
    <Suspense fallback={<ManageUsersSkeleton />}>
      <ManageUsersContent />
    </Suspense>
  );
};

export default ManageUsersPage;
