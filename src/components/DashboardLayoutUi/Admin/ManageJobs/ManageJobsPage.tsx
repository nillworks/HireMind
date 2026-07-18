import { Suspense } from "react";
import { getAllJobsAdmin } from "@/lib/api/admin/adminJobsApi";
import JobTable from "./JobTable";
import ManageJobsSkeleton from "./ManageJobsSkeleton";

interface Props {
  searchParams?: Promise<{ status?: string }>;
}

const ManageJobsContent = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const status = params?.status;
  const { jobs } = await getAllJobsAdmin(status);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-PrimaryFont text-TextPrimary dark:text-surface">
          Manage Jobs
        </h1>
        <p className="text-sm font-SecondaryFont text-TextMuted mt-1">
          Review, approve, or reject all submitted job listings.
        </p>
      </div>

      <JobTable jobs={jobs} currentStatus={status || "all"} />
    </div>
  );
};

const ManageJobsPage = ({ searchParams }: Props) => {
  return (
    <Suspense fallback={<ManageJobsSkeleton />}>
      <ManageJobsContent searchParams={searchParams} />
    </Suspense>
  );
};

export default ManageJobsPage;
