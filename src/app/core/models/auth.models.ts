export interface User {
  id: string;
  username: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  middleName: string;
  lastName: string;
  avatarUrl?: string;
  roles?: string[];
}

export interface AuthResponse {
  user?: User;
  userId?: string;
  message?: string;
}

export interface RegisterRequest {
  email: string;
  password?: string;
}

export interface LoginRequest {
  username: string;
  password?: string;
}

export interface VerifyCodeRequest {
  userId: string;
  code: string;
}

export interface RegisterResponse {
  userId: string;
  username: string;
}

export interface VerifyCodeResponse {
  userId: string;
  username: string;
}
