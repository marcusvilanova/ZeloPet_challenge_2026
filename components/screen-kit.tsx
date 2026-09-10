import { ReactNode } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";

import { Card, SectionTitle } from "@/components/zelo-ui";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

export function MobilePage({ children, refreshing = false, onRefresh }: { children: ReactNode; refreshing?: boolean; onRefresh?: () => void }) {
  return <ScreenContainer edges={["left", "right", "bottom"]} className="px-4 pt-5"><ScrollView showsVerticalScrollIndicator={false} refreshControl={onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> : undefined} contentContainerStyle={styles.content}>{children}</ScrollView></ScreenContainer>;
}

export function PageHeading({ eyebrow, title, subtitle, action }: { eyebrow?: string; title: string; subtitle?: string; action?: ReactNode }) {
  const colors = useColors();
  return <View style={styles.heading}><View style={styles.headingCopy}>{eyebrow && <Text style={[styles.eyebrow, { color: colors.primary }]}>{eyebrow}</Text>}<Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>{subtitle && <Text style={[styles.subtitle, { color: colors.muted }]}>{subtitle}</Text>}</View>{action}</View>;
}

export function ActionCard({ title, description, action, tone = "primary" }: { title: string; description: string; action?: ReactNode; tone?: "primary" | "soft" }) {
  const colors = useColors();
  return <Card style={[styles.actionCard, tone === "soft" && { backgroundColor: colors.primary + "0D" }]}><Text style={[styles.cardTitle, { color: colors.foreground }]}>{title}</Text><Text style={[styles.cardDescription, { color: colors.muted }]}>{description}</Text>{action}</Card>;
}

export function Divider() { const colors = useColors(); return <View style={[styles.divider, { backgroundColor: colors.border }]} />; }
export function EmptyMessage({ title, description }: { title: string; description: string }) { const colors = useColors(); return <View style={styles.empty}><Text style={[styles.emptyTitle, { color: colors.foreground }]}>{title}</Text><Text style={[styles.emptyText, { color: colors.muted }]}>{description}</Text></View>; }
export { Card, SectionTitle };

const styles = StyleSheet.create({ content: { gap: 16, paddingBottom: 28 }, heading: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", gap: 12, marginBottom: 4 }, headingCopy: { flex: 1, gap: 4 }, eyebrow: { fontSize: 10, fontWeight: "900", letterSpacing: 1.4 }, title: { fontSize: 27, lineHeight: 33, fontWeight: "900", letterSpacing: -0.7 }, subtitle: { fontSize: 14, lineHeight: 20 }, actionCard: { gap: 9 }, cardTitle: { fontSize: 18, fontWeight: "900" }, cardDescription: { fontSize: 14, lineHeight: 20 }, divider: { height: 1, marginVertical: 4 }, empty: { alignItems: "center", paddingVertical: 28, gap: 5 }, emptyTitle: { fontSize: 16, fontWeight: "900" }, emptyText: { textAlign: "center", fontSize: 14, lineHeight: 20 } });
