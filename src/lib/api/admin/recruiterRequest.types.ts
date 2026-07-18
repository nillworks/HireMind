export interface RecruiterRequest {
  _id: string;
  userId: string;
  name: string;
  email: string;
  company: string;
  userImage?: string;
  rejectionReason?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt?: string;
}
