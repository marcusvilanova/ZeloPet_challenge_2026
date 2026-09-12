import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { roleForEmail } from "../../../config/access";
import { tabsForRole, type AppTab } from "../../../config/navigation";
import { useAuth } from "@/lib/auth-context";

type TabRoute = "dashboard" | "pets" | "triagens" | "care" | "queue" | "alertas" | "clinic";

const iconByRoute: Record<TabRoute, "home" | "pets" | "health-and-safety" | "event-note" | "format-list-bulleted" | "notifications-none" | "business"> = {
  dashboard: "home",
  pets: "pets",
  triagens: "health-and-safety",
  care: "event-note",
  queue: "format-list-bulleted",
  alertas: "notifications-none",
  clinic: "business",
};

const titleByRoute: Record<TabRoute, string> = {
  dashboard: "Início",
  pets: "Meus pets",
  triagens: "Triagens",
  care: "Plano",
  queue: "Fila",
  alertas: "Alertas",
  clinic: "Clínica",
};

export default function TabsLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const tabs: AppTab[] = tabsForRole(roleForEmail(user?.email, user?.tipo));
  const bottomPadding = Platform.OS === "web" ? 9 : Math.max(insets.bottom, 8);

  return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.muted, tabBarButton: HapticTab, tabBarLabelStyle: { fontSize: 11, fontWeight: "700", marginBottom: 2 }, tabBarStyle: { height: 66 + bottomPadding, paddingTop: 8, paddingBottom: bottomPadding, backgroundColor: colors.surface, borderTopColor: colors.border, borderTopWidth: 1, elevation: 12, shadowColor: "#12352C", shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: -4 } } }}>
    {tabs.map((tab: AppTab) => { const route = tab.route as TabRoute; return <Tabs.Screen key={route} name={route} options={{ title: titleByRoute[route], tabBarIcon: ({ color }) => <IconSymbol name={iconByRoute[route]} size={23} color={color} /> }} />; })}
    <Tabs.Screen name="perfil" options={{ href: null }} />
  </Tabs>;
}
