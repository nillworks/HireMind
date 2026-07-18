import { Suspense } from "react";
import { getRecruiterRequests } from "@/lib/api/admin/adminRecruiterRequestsApi";
import RecruiterRequestList from "./RecruiterRequestList";
import RecruiterApplicationsSkeleton from "./RecruiterApplicationsSkeleton";

const RecruiterApplicationsContent = async () => {
  const requests = await getRecruiterRequests();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-PrimaryFont text-TextPrimary dark:text-surface">
          Recruiter Applications
        </h1>
        <p className="text-sm font-SecondaryFont text-TextMuted mt-1">
          Review and manage all recruiter requests from seekers.
        </p>
      </div>

      <RecruiterRequestList requests={requests} />
    </div>
  );
};

const RecruiterApplicationsPage = () => {
  return (
    <Suspense fallback={<RecruiterApplicationsSkeleton />}>
      <RecruiterApplicationsContent />
    </Suspense>
  );
};

export default RecruiterApplicationsPage;
