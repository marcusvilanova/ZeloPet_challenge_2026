import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

import { useColors } from "@/hooks/use-colors";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  const colors = useColors();
  return (
    <View style={styles.brandRow}>
      <View style={[styles.brandIcon, compact && styles.compactIcon, { backgroundColor: colors.primary }]}>
        <Text style={styles.brandIconText}>Z</Text>
      </View>
      <Text style={[styles.brandName, compact && styles.compactName, { color: colors.foreground }]}>zelo</Text>
    </View>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: object }) {
  const colors = useColors();
  return <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }, style]}>{children}</View>;
}

export function PrimaryButton({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
}: {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
}) {
  const colors = useColors();
  const backgroundColor = variant === "danger" ? colors.error : variant === "secondary" ? colors.surface : colors.primary;
  const foregroundColor = variant === "secondary" ? colors.foreground : "#FFFFFF";
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor, borderColor: variant === "secondary" ? colors.border : backgroundColor },
        pressed && styles.pressed,
        (disabled || loading) && styles.disabled,
      ]}
    >
      {loading ? <ActivityIndicator color={foregroundColor} /> : <Text style={[styles.buttonText, { color: foregroundColor }]}>{label}</Text>}
    </Pressable>
  );
}

export function TextField({ label, error, ...props }: TextInputProps & { label: string; error?: string }) {
  const colors = useColors();
  return (
    <View style={styles.fieldWrap}>
      <Text style={[styles.label, { color: colors.foreground }]}>{label}</Text>
      <TextInput
        {...props}
        placeholderTextColor={colors.muted}
        style={[styles.input, { color: colors.foreground, borderColor: error ? colors.error : colors.border, backgroundColor: colors.background }]}
      />
      {error && <Text style={[styles.fieldError, { color: colors.error }]}>{error}</Text>}
    </View>
  );
}

export function SectionTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  const colors = useColors();
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionCopy}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{title}</Text>
        {subtitle && <Text style={[styles.sectionSubtitle, { color: colors.muted }]}>{subtitle}</Text>}
      </View>
      {action}
    </View>
  );
}

export function StatusBadge({ label, tone = "neutral" }: { label: string; tone?: "neutral" | "success" | "warning" | "danger" | "info" }) {
  const colors = useColors();
  const palette = {
    neutral: { backgroundColor: colors.background, color: colors.muted },
    success: { backgroundColor: `${colors.success}22`, color: colors.success },
    warning: { backgroundColor: `${colors.warning}22`, color: colors.warning },
    danger: { backgroundColor: `${colors.error}22`, color: colors.error },
    info: { backgroundColor: `${colors.primary}22`, color: colors.primary },
  }[tone];
  return <Text style={[styles.badge, { backgroundColor: palette.backgroundColor, color: palette.color }]}>{label}</Text>;
}

export function LoadingState({ label = "Carregando dados..." }: { label?: string }) {
  const colors = useColors();
  return <View style={styles.centerState}><ActivityIndicator color={colors.primary} size="large" /><Text style={[styles.stateText, { color: colors.muted }]}>{label}</Text></View>;
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  const colors = useColors();
  return <View style={styles.centerState}><Text style={[styles.emptyTitle, { color: colors.foreground }]}>{title}</Text><Text style={[styles.stateText, { color: colors.muted }]}>{description}</Text></View>;
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  const colors = useColors();
  return <View style={styles.centerState}><Text style={[styles.emptyTitle, { color: colors.error }]}>Não foi possível carregar</Text><Text style={[styles.stateText, { color: colors.muted }]}>{message}</Text><Pressable onPress={onRetry} style={styles.retryButton}><Text style={[styles.retryText, { color: colors.primary }]}>Tentar novamente</Text></Pressable></View>;
}

const styles = StyleSheet.create({
  brandRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  brandIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  brandIconText: { color: "#FFFFFF", fontSize: 24, fontWeight: "800" },
  brandName: { fontSize: 32, fontWeight: "800", letterSpacing: -1 },
  compactIcon: { width: 32, height: 32, borderRadius: 10 },
  compactName: { fontSize: 21, letterSpacing: -0.6 },
  card: { borderRadius: 20, borderWidth: 1, padding: 18, shadowColor: "#0F172A", shadowOpacity: 0.06, shadowRadius: 14, shadowOffset: { width: 0, height: 5 }, elevation: 2 },
  button: { minHeight: 52, borderRadius: 16, borderWidth: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 20 },
  buttonText: { fontSize: 16, fontWeight: "700" },
  pressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.55 },
  fieldWrap: { gap: 7 },
  label: { fontSize: 13, fontWeight: "700" },
  input: { minHeight: 52, borderWidth: 1, borderRadius: 15, paddingHorizontal: 15, fontSize: 16 },
  fieldError: { fontSize: 12 },
  sectionHeader: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", gap: 12, marginBottom: 14 },
  sectionCopy: { flex: 1, gap: 3 },
  sectionTitle: { fontSize: 21, fontWeight: "800", letterSpacing: -0.3 },
  sectionSubtitle: { fontSize: 13, lineHeight: 18 },
  badge: { alignSelf: "flex-start", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5, fontSize: 11, fontWeight: "800", overflow: "hidden" },
  centerState: { minHeight: 180, alignItems: "center", justifyContent: "center", padding: 22, gap: 9 },
  stateText: { textAlign: "center", fontSize: 14, lineHeight: 20 },
  emptyTitle: { textAlign: "center", fontSize: 17, fontWeight: "800" },
  retryButton: { padding: 8 },
  retryText: { fontWeight: "800" },
});
