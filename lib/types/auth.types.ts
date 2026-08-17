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
