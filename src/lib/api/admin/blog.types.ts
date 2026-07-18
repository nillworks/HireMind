export interface AdminBlog {
  _id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorImage?: string;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
}
