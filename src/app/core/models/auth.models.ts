export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  user?: User;
  userId?: string;
  message?: string;
}

export interface RegisterRequest {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface VerifyCodeRequest {
  userId: string;
  code: string;
}
