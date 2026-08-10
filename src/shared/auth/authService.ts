import { apiFetch } from "../services/apiClient";
import type { User, Wallet } from "../types/models";
import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "./passwordReset.types";

export interface AuthResponse {
  token: string;
  user: User;
  wallet: Wallet;
}

// El backend envuelve /auth/login, /auth/register y /auth/google en
// {success, data} desde el informe de sincronización de Santiago — antes
// devolvían el objeto plano directo. Se desenvuelve acá, una sola vez, así
// el resto del código (AuthProvider, callers) sigue trabajando con
// AuthResponse tal cual.
interface AuthApiResponse {
  success: boolean;
  data: AuthResponse;
}

export function login(email: string, password: string): Promise<AuthResponse> {
  return apiFetch<AuthApiResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  }).then((res) => res.data);
}

export function register(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  dateOfBirth: string,
  phone: string,
  du: string,
  country: string = "AR",
): Promise<AuthResponse> {
  return apiFetch<AuthApiResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, firstName, lastName, dateOfBirth, phone, du, country }),
  }).then((res) => res.data);
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
