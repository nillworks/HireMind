import { Suspense } from 'react';
import { getMyJobs } from '@/lib/api/recruiter/recruiterJobsApi';
import AnalyticsCharts from './AnalyticsCharts';
import RecentActivity from './RecentActivity';
import AnalyticsSkeleton from './AnalyticsSkeleton';

const AnalyticsContent = async () => {
  const jobs = await getMyJobs();

  const totalJobs = jobs.length;
  const totalApplications = jobs.reduce(
    (acc, j) => acc + (j.applicationCount || 0),
    0,
  );
  const approvedJobs = jobs.filter(j => j.status === 'approved').length;
  const pendingJobs = jobs.filter(j => j.status === 'pending').length;
  const rejectedJobs = jobs.filter(j => j.status === 'rejected').length;

  const jobsByStatus = [
    { name: 'Approved', value: approvedJobs, color: '#0F766E' },
    { name: 'Pending', value: pendingJobs, color: '#FF6363' },
    { name: 'Rejected', value: rejectedJobs, color: '#64748b' },
  ].filter(d => d.value > 0);

  const typeCounts: Record<string, number> = {};
  jobs.forEach(j => {
    const t = j.jobType || 'unknown';
    typeCounts[t] = (typeCounts[t] || 0) + 1;
  });
  const jobsByType = Object.entries(typeCounts).map(([name, count]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    count,
  }));

  const topJobs = [...jobs]
    .sort((a, b) => (b.applicationCount || 0) - (a.applicationCount || 0))
    .slice(0, 5)
    .map(j => ({
      name: j.title.length > 25 ? j.title.slice(0, 25) + '...' : j.title,
      applications: j.applicationCount || 0,
    }));

  const monthCounts: Record<string, number> = {};
  jobs.forEach(j => {
    if (j.createdAt) {
      const d = new Date(j.createdAt);
      const key = d.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });
      monthCounts[key] = (monthCounts[key] || 0) + 1;
    }
  });
  const jobsOverTime = Object.entries(monthCounts)
    .map(([month, count]) => ({ month, count }))
    .reverse();

  const catCounts: Record<string, number> = {};
  jobs.forEach(j => {
    const c = j.category || 'Other';
    catCounts[c] = (catCounts[c] || 0) + 1;
  });
  const jobsByCategory = Object.entries(catCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-PrimaryFont text-TextPrimary dark:text-surface">
          Analytics
        </h1>
        <p className="text-sm font-SecondaryFont text-TextMuted mt-1">
          Insights and trends across all your job listings.
        </p>
      </div>

      <AnalyticsCharts
        totalJobs={totalJobs}
        totalApplications={totalApplications}
        approvedJobs={approvedJobs}
        pendingJobs={pendingJobs}
        jobsByStatus={jobsByStatus}
        jobsByType={jobsByType}
        topJobs={topJobs}
        jobsOverTime={jobsOverTime}
        jobsByCategory={jobsByCategory}
      />

      <RecentActivity jobs={jobs} />
    </div>
  );
};

const AnalyticsPage = () => {
  return (
    <Suspense fallback={<AnalyticsSkeleton />}>
      <AnalyticsContent />
    </Suspense>
  );
};

export default AnalyticsPage;
