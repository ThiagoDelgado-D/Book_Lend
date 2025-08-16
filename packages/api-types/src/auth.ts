import { Email } from 'app-domain';

export interface LoginRequest {
  email: Email;
  password: string;
}

export interface RegisterRequest {
  email: Email;
  password: string;
  firstName: string;
  lastName: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
