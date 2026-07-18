export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  image?: string | null;
  role: string;
  isBlocked?: boolean;
  createdAt: string;
}
