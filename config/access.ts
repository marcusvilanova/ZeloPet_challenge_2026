import type { UserRole } from "../types/api";

const VETERINARIO_EMAIL = "veterinario@zelo.com.br";
const GESTOR_EMAIL = "gestor@zelo.com.br";

export function roleForEmail(email: string | undefined, backendRole?: UserRole): UserRole {
  const normalized = email?.trim().toLowerCase();
  if (normalized === VETERINARIO_EMAIL) return "VETERINARIO";
  if (normalized === GESTOR_EMAIL) return "GESTOR";
  return "TUTOR";
}

export function isRoleEmail(email: string | undefined, role: UserRole) {
  return roleForEmail(email) === role;
}
