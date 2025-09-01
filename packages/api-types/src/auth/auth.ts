import { Email } from 'app-domain';
import { ApiResponse } from '../response';
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
export interface SendEmailVerificationRequest {
  email: Email;
}

export interface VerifyEmailTokenParams {
  token: string;
}

export interface VerifyEmailTokenResponse extends ApiResponse {
  email?: string;
  timestamp?: string;
}

export interface CompleteRegistrationRequest {
  token: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  password: string;
}

export interface UserProfileResponse extends ApiResponse {
  data: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    role: string;
    bookLimit: number;
    registrationDate: Date;
    status: string;
    enabled: boolean;
  };
}

export interface DetailedAuthResponse extends ApiResponse {
  data: {
    token: string;
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      phoneNumber?: string;
      role: string;
      bookLimit: number;
      registrationDate: Date;
    };
  };
}
export interface RefreshTokenResponse extends ApiResponse {
  data: {
    token: string;
  };
}

export interface AuthResponse extends ApiResponse {
  data: {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
    };
    token: string;
  };
}
