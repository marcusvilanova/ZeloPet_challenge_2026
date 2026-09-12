import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Card, PrimaryButton } from "@/components/zelo-ui";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/lib/auth-context";

export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const { user } = useAuth();
  return <ScreenContainer edges={["left", "right", "bottom"]} className="px-5 pt-6"><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
    <View style={styles.hero}><Text style={[styles.eyebrow, { color: colors.primary }]}>CUIDADO VETERINÁRIO CONTÍNUO</Text><Text style={[styles.title, { color: colors.foreground }]}>Zelo: cuidado contínuo<Text style={{ color: "#E6814B" }}> antes da urgência.</Text></Text><Text style={[styles.subtitle, { color: colors.muted }]}>Um sistema operacional de cuidado contínuo para pets, que aproxima o tutor da clínica e transforma a saúde animal em uma jornada acompanhada.</Text><PrimaryButton label="Ir para o meu painel" onPress={() => router.replace("/(app)/(tabs)/dashboard")} /></View>
    <View style={styles.badges}><Badge label="⚡ Classificação automática de urgência" /><Badge label="☷ Fila priorizada por risco" /><Badge label="▣ Plano de cuidado contínuo" /></View>
    <View style={styles.section}><Text style={[styles.sectionEyebrow, { color: "#D47642" }]}>COMO FUNCIONA</Text><Text style={[styles.sectionTitle, { color: colors.foreground }]}>Uma rotina simples de cuidado preventivo</Text></View>
    <View style={styles.cards}><InfoCard title="Para o tutor" text="Cadastre seu pet, registre triagens quando algo preocupar e acompanhe o plano de cuidado." /><InfoCard title="Para a clínica" text="Receba triagens já classificadas por nível de urgência e atenda a fila com prioridade." /><InfoCard title="Ciclo Zelo" text="Uma rotina simples de cuidado preventivo, orientação e retorno respeitoso ao tutor." /></View>
    <Text style={[styles.welcome, { color: colors.muted }]}>Olá, {user?.nome?.split(" ")[0] ?? "cuidador"}. Estamos juntos no cuidado.</Text>
  </ScrollView></ScreenContainer>;
}
function Badge({ label }: { label: string }) { const colors = useColors(); return <View style={[styles.badge, { backgroundColor: colors.surface, borderColor: colors.border }]}><Text style={[styles.badgeText, { color: colors.muted }]}>{label}</Text></View>; }
function InfoCard({ title, text }: { title: string; text: string }) { const colors = useColors(); return <Card style={styles.infoCard}><View style={styles.infoIcon}><Text style={{ color: colors.primary, fontSize: 19 }}>✦</Text></View><Text style={[styles.infoTitle, { color: colors.foreground }]}>{title}</Text><Text style={[styles.infoText, { color: colors.muted }]}>{text}</Text></Card>; }
const styles = StyleSheet.create({ content: { gap: 20, paddingBottom: 35 }, hero: { gap: 12, paddingTop: 26 }, eyebrow: { fontSize: 11, fontWeight: "900", letterSpacing: 1 }, title: { fontSize: 32, lineHeight: 38, fontWeight: "900", letterSpacing: -0.8 }, subtitle: { fontSize: 15, lineHeight: 22, maxWidth: 570 }, badges: { flexDirection: "row", flexWrap: "wrap", gap: 8 }, badge: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 }, badgeText: { fontSize: 11, fontWeight: "700" }, section: { alignItems: "center", gap: 5, paddingTop: 28 }, sectionEyebrow: { fontSize: 11, fontWeight: "900", letterSpacing: 1 }, sectionTitle: { fontSize: 25, lineHeight: 30, fontWeight: "900", textAlign: "center", maxWidth: 420 }, cards: { gap: 12 }, infoCard: { gap: 8 }, infoIcon: { width: 40, height: 40, borderRadius: 13, backgroundColor: "#E8F3EE", alignItems: "center", justifyContent: "center" }, infoTitle: { fontSize: 18, fontWeight: "900" }, infoText: { fontSize: 14, lineHeight: 20 }, welcome: { textAlign: "center", fontSize: 12 } });
