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
  category?: string | string[];
  type?: string | string[];
  location?: string | string[];
  minSalary?: number;
  maxSalary?: number;
  sortBy?: string;
  page?: number;
  limit?: number;
}

export interface Suggestion {
  text: string;
  type: 'title' | 'company' | 'category' | 'location';
}

export interface JobFilterOptions {
  categories: string[];
  jobTypes: string[];
  locations: string[];
  minSalary: number;
  maxSalary: number;
}

// Serialize a filter value into a single comma-separated param, dropping the
// "All" sentinel and empty entries. Returns "" when nothing is selected.
const serializeMulti = (value?: string | string[]): string => {
  const list = Array.isArray(value) ? value : value ? [value] : [];
  return list
    .map(v => v.trim())
    .filter(v => v && v !== 'All')
    .join(',');
};

export const getJobs = async (query: JobsQuery = {}): Promise<JobsResponse> => {
  try {
    const params = new URLSearchParams();
    if (query.search) params.set('search', query.search);

    const category = serializeMulti(query.category);
    if (category) params.set('category', category);

    const type = serializeMulti(query.type);
    if (type) params.set('type', type);

    const location = serializeMulti(query.location);
    if (location) params.set('location', location);

    if (query.minSalary !== undefined)
      params.set('minSalary', String(query.minSalary));
    if (query.maxSalary !== undefined)
      params.set('maxSalary', String(query.maxSalary));
    if (query.sortBy) params.set('sortBy', query.sortBy);
    if (query.page) params.set('page', String(query.page));
    if (query.limit) params.set('limit', String(query.limit));

    const res = await fetch(`${API}/api/jobs?${params.toString()}`, {
      cache: 'no-store',
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

export const getJobSuggestions = async (q: string): Promise<Suggestion[]> => {
  if (q.length < 2) return [];
  try {
    const res = await fetch(`${API}/api/jobs/suggest?q=${encodeURIComponent(q)}`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data?.suggestions ?? [];
  } catch {
    return [];
  }
};

export const getJobFilterOptions = async (): Promise<JobFilterOptions> => {
  const empty: JobFilterOptions = {
    categories: [],
    jobTypes: [],
    locations: [],
    minSalary: 0,
    maxSalary: 0,
  };
  try {
    const res = await fetch(`${API}/api/jobs/filter-options`, {
      cache: 'no-store',
    });
    if (!res.ok) return empty;
    const json = await res.json();
    return json.data ?? empty;
  } catch {
    return empty;
  }
};

export const getJobById = async (jobId: string): Promise<Job | null> => {
  const res = await fetch(`${API}/api/jobs/${jobId}`, {
    cache: 'no-store',
  });
  if (res.status === 404) return null;
  if (!res.ok) return null;
  const json = await res.json();
  return json.data ?? null;
};

export const getFeaturedJobs = async (): Promise<Job[]> => {
  try {
    const res = await fetch(`${API}/api/jobs/featured`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
};
