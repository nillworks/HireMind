import fetchClient from "@/lib/utils/fetchClient";

export interface Blog {
  _id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorImage?: string;
  authorRole?: string;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface BlogListResponse {
  blogs: Blog[];
  total: number;
  page: number;
  totalPages: number;
}

export const getBlogs = async (
  page = 1,
  limit = 10
): Promise<BlogListResponse> => {
  try {
    const res = await fetchClient<{
      success: boolean;
      data: BlogListResponse;
    }>(`/api/blog?page=${page}&limit=${limit}`);
    return (
      res.data ?? { blogs: [], total: 0, page: 1, totalPages: 0 }
    );
  } catch {
    return { blogs: [], total: 0, page: 1, totalPages: 0 };
  }
};

export const getBlogById = async (id: string): Promise<Blog | null> => {
  try {
    const res = await fetchClient<{ success: boolean; data: Blog }>(
      `/api/blog/${id}`
    );
    return res.data ?? null;
  } catch {
    return null;
  }
};
