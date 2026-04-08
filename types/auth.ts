import { UserRole } from './user';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user?: {
    id: number;
    name: string;
    role: UserRole;
  };
}
