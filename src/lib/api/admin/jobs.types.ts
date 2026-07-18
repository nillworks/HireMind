export interface AdminJob {
  _id: string;
  title: string;
  companyName: string;
  companyLogo?: string;
  category?: string;
  jobType?: string;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  deadline?: string;
  shortDescription?: string;
  status: string;
  applicationCount?: number;
  createdAt: string;
}
