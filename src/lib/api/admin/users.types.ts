export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  image?: string | null;
  role: string;
  isBlocked?: boolean;
  createdAt: string;
  profileScore?: number;
}

export interface ProfileField {
  label: string;
  filled: boolean;
}

export interface UserProfileScore {
  userId: string;
  role: string;
  hasProfile: boolean;
  score: number;
  breakdown: ProfileField[];
}
