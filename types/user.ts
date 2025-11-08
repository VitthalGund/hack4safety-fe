// In types/user.ts
import { UserRole } from "@/lib/auth-store";

export interface User {
  username: string;
  full_name: string;
  role: UserRole;
  district: string | null;
  police_station: string | null;
}
