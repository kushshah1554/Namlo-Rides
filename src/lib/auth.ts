import type { Role } from "@/const/enum";

const AUTH_KEY = "namlo_auth";

const _RIDER_VALID_CREDENTIALS = {
  email: "intern@namlotech.com",
  password: "namlo2026",
} as const;

export type AuthUser = {
  id?: string; 
  email: string;
  authenticatedAt: number;
  role?: Role;
};

export function login(email: string, password: string): AuthUser {
  const normalizedEmail = email.trim().toLowerCase();

  if (
    normalizedEmail !== _RIDER_VALID_CREDENTIALS.email ||
    password !== _RIDER_VALID_CREDENTIALS.password
  ) {
    throw new Error("Invalid email or password.");
  } else {
    const user: AuthUser = {
      email: normalizedEmail,
      authenticatedAt: Date.now(),
    };

    // Changed to sessionStorage
    sessionStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return user;
  }
}

export function logout(): void {
  // Changed to sessionStorage
  sessionStorage.removeItem(AUTH_KEY);
}

export function isAuthenticated(): boolean {
  return getAuthUser() !== null;
}

export function getAuthUser(): AuthUser | null {
  // Changed to sessionStorage
  const raw = sessionStorage.getItem(AUTH_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    // Changed to sessionStorage
    sessionStorage.removeItem(AUTH_KEY);
    return null;
  }
}
export function getUserRole(): string | null {
  const user = getAuthUser();
  return user?.role || null;
}



// Matched the same dark zinc gradient background
// Used amber accent colors instead of blue