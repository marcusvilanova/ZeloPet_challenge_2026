import { usePathname, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { BrandMark } from "@/components/zelo-ui";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/lib/auth-context";

export function AppHeader() {
  const colors = useColors();
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const canGoBack = router.canGoBack();
  const isHome = pathname.includes("/home");

  return (
    <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
      <Pressable
        accessibilityLabel="Voltar"
        onPress={() => isHome ? router.replace("/(app)/(tabs)/dashboard") : canGoBack ? router.back() : router.replace("/(app)/home")}
        style={({ pressed }) => [styles.backButton, { borderColor: colors.border }, pressed && styles.pressed]}
      >
        <IconSymbol name="arrow-back" size={21} color={colors.foreground} />
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel="Ir para a Home" onPress={() => router.replace("/(app)/home")} style={({ pressed }) => [pressed && styles.pressed]}>
        <BrandMark compact />
      </Pressable>
      <View style={styles.account}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarText}>{user?.nome?.charAt(0).toUpperCase() ?? "Z"}</Text>
        </View>
        <Text numberOfLines={1} style={[styles.userName, { color: colors.foreground }]}>{user?.nome?.split(" ")[0] ?? "Usuário"}</Text>
        <Pressable accessibilityRole="button" onPress={() => void logout()} style={({ pressed }) => [styles.logout, { borderColor: colors.border }, pressed && styles.pressed]}>
          <Text style={[styles.logoutText, { color: colors.foreground }]}>Sair</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { height: 70, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", gap: 12, borderBottomWidth: 1 },
  backButton: { width: 38, height: 38, borderWidth: 1, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  account: { marginLeft: "auto", flexDirection: "row", alignItems: "center", gap: 7, maxWidth: "52%" },
  avatar: { width: 28, height: 28, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#FFFFFF", fontSize: 13, fontWeight: "800" },
  userName: { fontSize: 13, fontWeight: "700", maxWidth: 70 },
  logout: { paddingHorizontal: 10, paddingVertical: 7, borderWidth: 1, borderRadius: 11 },
  logoutText: { fontSize: 12, fontWeight: "800" },
  pressed: { opacity: 0.7, transform: [{ scale: 0.97 }] },
});
