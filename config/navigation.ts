import type { UserRole } from "../types/api";

export type AppTab = {
  route: string;
  label: string;
  icon: string;
};

const tabsByRole: Record<UserRole, AppTab[]> = {
  TUTOR: [
    { route: "dashboard", label: "Início", icon: "home" },
    { route: "pets", label: "Meus pets", icon: "pets" },
    { route: "triagens", label: "Triagens", icon: "health-and-safety" },
    { route: "care", label: "Plano", icon: "event-note" },
  ],
  VETERINARIO: [
    { route: "dashboard", label: "Início", icon: "home" },
    { route: "queue", label: "Fila", icon: "format-list-bulleted" },
    { route: "alertas", label: "Alertas", icon: "notifications-none" },
  ],
  GESTOR: [
    { route: "dashboard", label: "Início", icon: "home" },
    { route: "queue", label: "Fila", icon: "format-list-bulleted" },
    { route: "alertas", label: "Alertas", icon: "notifications-none" },
    { route: "clinic", label: "Clínica", icon: "business" },
  ],
};

export function tabsForRole(role: UserRole | undefined): AppTab[] {
  return tabsByRole[role ?? "TUTOR"];
}

export function isRouteAllowed(role: UserRole | undefined, route: string) {
  return tabsForRole(role).some((tab) => tab.route === route);
}
