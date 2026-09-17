export type UserRole = "ADMIN" | "STAFF" | "GUEST";

export interface UserSummaryDTO {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface LoginResponseDTO {
  accessToken: string;
  user: UserSummaryDTO;
}

export interface ErrorResponseDTO {
  message: string;
  details?: Record<string, string[]>;
}