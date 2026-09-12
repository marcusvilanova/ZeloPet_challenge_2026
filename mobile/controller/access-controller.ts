import { isRouteAllowed } from "@/config/navigation";
import type { UserRole } from "@/types/api";

export function canAccessRoute(role: UserRole | undefined, route: string) {
  return isRouteAllowed(role, route);
}
