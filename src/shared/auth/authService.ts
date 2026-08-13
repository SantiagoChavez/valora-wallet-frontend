import { apiFetch } from "../services/apiClient";
import type { CountryCode, User, Wallet } from "../types/models";
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

// El backend envuelve la respuesta en {success, data: {user}} — mismo criterio
// que login/register.
interface CompleteProfileApiResponse {
  success: boolean;
  data: { user: User };
}

// Completa (o edita) celular/país/documento/fecha de nacimiento de la cuenta
// autenticada — pensado sobre todo para cuentas de Google, que no piden estos
// datos en el alta (ver CompleteProfileModal). phone va con el prefijo de país
// ya concatenado adentro del string (ej. "+5511961234567") — PATCH /auth/me no
// tiene un campo de prefijo separado del lado del backend. dateOfBirth va en
// DD/MM/YYYY, mismo formato que /auth/register (ver toBackendDate en
// shared/utils/date.ts) — al momento de este cambio, completeProfileSchema
// (backend) todavía no valida ni persiste este campo: Zod lo descarta en
// silencio (modo "strip" default, sin .strict()/.passthrough()), así que
// mandarlo hoy no rompe el submit, solo no tiene efecto hasta que el backend
// lo soporte.
export function completeProfile(
  phone: string,
  country: CountryCode,
  du: string,
  dateOfBirth: string,
  token: string,
): Promise<User> {
  return apiFetch<CompleteProfileApiResponse>("/auth/me", {
    method: "PATCH",
    token,
    body: JSON.stringify({ phone, country, du, dateOfBirth }),
  }).then((res) => res.data.user);
}

export function googleLogin(idToken: string): Promise<AuthResponse> {
  return apiFetch<AuthApiResponse>("/auth/google", {
    method: "POST",
    body: JSON.stringify({ idToken }),
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
