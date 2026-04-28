import type { User } from "firebase/auth";

export interface AppUser {
  uid: string;
  email: string | null;
  role: "superadmin" | "admin" | "user";
  isApproved: boolean;
}

export interface AuthContextType {
  currentUser: User | null;
  appUser: AppUser | null;
  loading: boolean;
  logout: () => Promise<void>;
}
