import { apiFetch } from "../services/apiClient";
import type { User } from "../types/models";
import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "./passwordReset.types";

export interface AuthResponse {
  token: string;
  user: User;
  walletId: string;
}

export function login(email: string, password: string): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function register(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  dateOfBirth: string,
  phone: string,
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, firstName, lastName, dateOfBirth, phone }),
  });
}

export function requestPasswordReset(email: string): Promise<ForgotPasswordResponse> {
  const body: ForgotPasswordRequest = { email };
  return apiFetch<ForgotPasswordResponse>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function resetPassword(token: string, password: string): Promise<ResetPasswordResponse> {
  const body: ResetPasswordRequest = { token, password };
  return apiFetch<ResetPasswordResponse>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
