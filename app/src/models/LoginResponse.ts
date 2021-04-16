export interface LoginResponse {
  authSessionId?: string;
  csrfToken?: string;
  refreshToken?: string;
  success: boolean;
}
