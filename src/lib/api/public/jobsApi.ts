const API = process.env.NEXT_PUBLIC_API_URL;

export interface Job {
  _id: string;
  title: string;
  companyName: string;
  companyLogo: string;
  category: string;
  jobType: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  deadline: string;
  shortDescription: string;
  fullDescription: string;
  requirements: string[];
  benefits?: string[];
  recruiterId: string;
  recruiterImage: string;
  recruiterName: string;
  recruiterEmail: string;
  postedBy: string;
  status: string;
  applicationCount: number;
  createdAt: string;
}

export interface JobsResponse {
  jobs: Job[];
  total: number;
  page: number;
  totalPages: number;
}

export interface JobsQuery {
  search?: string;
  category?: string;
  type?: string;
  location?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}

export const getJobs = async (query: JobsQuery = {}): Promise<JobsResponse> => {
  try {
    const params = new URLSearchParams();
    if (query.search) params.set("search", query.search);
    if (query.category) params.set("category", query.category);
    if (query.type) params.set("type", query.type);
    if (query.location) params.set("location", query.location);
    if (query.sortBy) params.set("sortBy", query.sortBy);
    if (query.page) params.set("page", String(query.page));
    if (query.limit) params.set("limit", String(query.limit));

    const res = await fetch(`${API}/api/jobs?${params.toString()}`, {
      cache: "no-store",
    });
    if (!res.ok) return { jobs: [], total: 0, page: 1, totalPages: 1 };
    const json = await res.json();
    return {
      jobs: json.data ?? [],
      total: json.pagination?.total ?? 0,
      page: json.pagination?.page ?? 1,
      totalPages: json.pagination?.totalPages ?? 1,
    };
  } catch {
    return { jobs: [], total: 0, page: 1, totalPages: 1 };
  }
};

export const getJobById = async (jobId: string): Promise<Job | null> => {
  const res = await fetch(`${API}/api/jobs/${jobId}`, {
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) return null;
  const json = await res.json();
  return json.data ?? null;
};

export const getFeaturedJobs = async (): Promise<Job[]> => {
  try {
    const res = await fetch(`${API}/api/jobs/featured`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
};
