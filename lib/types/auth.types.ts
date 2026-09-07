export interface RegisterRequest {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface RegisterResponse {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}



export interface LoginRequest {
  username: string;
  password: string;
}

export interface TokenResponse {
  accessToken?: string;
  refreshToken?: string;
  tokenType?: string;
  expiresIn?: number;
  refreshExpiresIn?: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface EmailRequest {
  email: string;
}

export interface MessageResponse {
  message?: string;
}

export interface ApiErrorResponse {
  status?: number;
  error?: string;
  code?: string;
  message?: string;
  path?: string;
  timestamp?: string;
  details?: Record<string, unknown>;
  validationErrors?: Record<string, string>;
}
