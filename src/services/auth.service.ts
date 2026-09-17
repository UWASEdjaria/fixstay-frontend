import { LoginRequestDTO, LoginResponseDTO, UserSummaryDTO } from "@/types/auth";

const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";
const TOKEN_STORAGE_KEY = "stayfix_access_token";
const USER_STORAGE_KEY = "stayfix_auth_user";

export class FrontendAuthService {
  /**
   * Authenticates staff or guest with the backend API and stores session tokens.
   */
  public async login(payload: LoginRequestDTO): Promise<LoginResponseDTO> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData: { message?: string } = await res.json().catch(() => ({}));
      throw new Error(errorData.message ?? "Authentication failed. Please check your credentials.");
    }

    const data: LoginResponseDTO = await res.json();

    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_STORAGE_KEY, data.accessToken);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
    }

    return data;
  }

  /**
   * Retrieves the JWT bearer token for authorized requests.
   */
  public getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }

  /**
   * Retrieves the currently cached user profile.
   */
  public getCurrentUser(): UserSummaryDTO | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UserSummaryDTO;
    } catch {
      return null;
    }
  }

  /**
   * Clears session storage upon sign-out.
   */
  public logout(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  }
}

export const authService = new FrontendAuthService();