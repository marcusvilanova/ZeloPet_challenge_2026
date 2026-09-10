import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { PrimaryButton, StatusBadge } from "@/components/zelo-ui";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/lib/auth-context";
import { useAlertas, usePets, useTriagens } from "@/hooks/use-zelo";
import { ActionCard, Card, EmptyMessage, MobilePage, PageHeading } from "@/components/screen-kit";
import { roleForEmail } from "@/config/access";

export default function DashboardScreen() {
  const colors = useColors();
  const router = useRouter();
  const { user } = useAuth();
  const pets = usePets();
  const triagens = useTriagens();
  const alertas = useAlertas();
  const refreshing = pets.isRefetching || triagens.isRefetching || alertas.isRefetching;
  const role = roleForEmail(user?.email, user?.tipo);
  const petItems = pets.data ?? [];
  const triageItems = triagens.data ?? [];
  const alertItems = alertas.data ?? [];
  const pendingAlerts = alertItems.filter((item) => item.status === "PENDENTE" || item.status === "ENVIADO");

  if (role === "TUTOR") return <MobilePage refreshing={refreshing} onRefresh={() => void Promise.all([pets.refetch(), triagens.refetch(), alertas.refetch()])}>
    <PageHeading eyebrow="PAINEL ZELO" title={`Olá, ${user?.nome?.split(" ")[0] ?? "tutor"}!`} subtitle="Aqui está o resumo do cuidado com seus pets." />
    <View style={styles.cards}>
      <Card><Text style={[styles.cardTitle, { color: colors.foreground }]}>Meus pets</Text>{petItems.length === 0 ? <Text style={[styles.cardText, { color: colors.muted }]}>Você ainda não cadastrou nenhum pet.</Text> : petItems.slice(0, 2).map((pet) => <View key={pet.id} style={[styles.petRow, { borderTopColor: colors.border }]}><Text style={[styles.petName, { color: colors.foreground }]}>{pet.nome}</Text><Text style={[styles.petMeta, { color: colors.muted }]}>{pet.especie}</Text></View>)}<PrimaryButton label="Cadastrar pet" onPress={() => router.push("/(app)/pet-new")} /></Card>
      <Card><Text style={[styles.cardTitle, { color: colors.foreground }]}>Plano de cuidado pendente</Text>{pendingAlerts.length === 0 ? <Text style={[styles.cardText, { color: colors.muted }]}>Nenhum cuidado pendente no momento. Tudo em dia!</Text> : pendingAlerts.slice(0, 1).map((alert) => <View key={alert.id} style={styles.plan}><Text style={[styles.planTitle, { color: colors.foreground }]}>{alert.titulo}</Text><Text style={[styles.cardText, { color: colors.muted }]}>{alert.petNome} · {alert.tipo} · {alert.dataPrevista}</Text><StatusBadge label={alert.status} tone="info" /></View>)}<Pressable onPress={() => router.push("/(app)/(tabs)/care")} style={[styles.outlineButton, { borderColor: colors.border }]}><Text style={[styles.outlineText, { color: colors.foreground }]}>Ver plano completo</Text></Pressable></Card>
      <Card><Text style={[styles.cardTitle, { color: colors.foreground }]}>Triagens recentes</Text>{triageItems.length === 0 ? <Text style={[styles.cardText, { color: colors.muted }]}>Nenhuma triagem registrada ainda.</Text> : triageItems.slice(0, 2).map((triage) => <View key={triage.id} style={[styles.triageRow, { borderTopColor: colors.border }]}><View style={styles.triageCopy}><Text style={[styles.petName, { color: colors.foreground }]}>{triage.petNome ?? "Pet"}</Text><Text numberOfLines={1} style={[styles.petMeta, { color: colors.muted }]}>{triage.status}</Text></View><StatusBadge label={triage.urgencia} tone={triage.urgencia === "ALTA" || triage.urgencia === "EMERGENCIA" ? "danger" : "warning"} /></View>)}<PrimaryButton label="Registrar nova triagem" onPress={() => router.push("/(app)/triagem-new")} /></Card>
    </View>
  </MobilePage>;

  return <MobilePage refreshing={refreshing} onRefresh={() => void Promise.all([triagens.refetch(), alertas.refetch()])}>
    <PageHeading eyebrow={role === "GESTOR" ? "GESTÃO ZELO" : "OPERAÇÃO ZELO"} title={`Olá, ${user?.nome?.split(" ")[0] ?? "profissional"}!`} subtitle={role === "GESTOR" ? "Acompanhe sua clínica e a fila de atenção." : "Acompanhe os atendimentos prioritários."} />
    <View style={styles.metrics}><Metric label="Na fila" value={triageItems.filter((item) => item.status !== "CANCELADA").length} /><Metric label="Alertas" value={pendingAlerts.length} /></View>
    <ActionCard title="Fila de atenção" description="Veja as triagens ordenadas pelo risco e acompanhe o próximo atendimento." action={<PrimaryButton label="Abrir fila" onPress={() => router.push("/(app)/(tabs)/queue")} />} />
    <ActionCard title="Alertas" description="Gerencie alertas e acompanhe os planos de cuidado ativos." tone="soft" action={<PrimaryButton label="Ver alertas" onPress={() => router.push("/(app)/(tabs)/alertas")} />} />
    {role === "GESTOR" && <ActionCard title="Minha clínica" description="Atualize os dados da clínica vinculada ao seu perfil." action={<PrimaryButton label="Gerenciar clínica" onPress={() => router.push("/(app)/(tabs)/clinic")} />} />}
    {triageItems.length === 0 && alertItems.length === 0 && <EmptyMessage title="Tudo tranquilo por aqui" description="Assim que houver triagens ou alertas, eles aparecerão neste painel." />}
  </MobilePage>;
}

function Metric({ label, value }: { label: string; value: number }) { const colors = useColors(); return <View style={[styles.metric, { backgroundColor: colors.surface, borderColor: colors.border }]}><Text style={[styles.metricValue, { color: colors.foreground }]}>{value}</Text><Text style={[styles.metricLabel, { color: colors.muted }]}>{label}</Text></View>; }

const styles = StyleSheet.create({ cards: { gap: 14 }, cardTitle: { fontSize: 18, fontWeight: "900", marginBottom: 9 }, cardText: { fontSize: 13, lineHeight: 19 }, petRow: { borderTopWidth: 1, paddingVertical: 10, flexDirection: "row", justifyContent: "space-between" }, petName: { fontSize: 14, fontWeight: "800" }, petMeta: { fontSize: 12 }, plan: { gap: 5, paddingVertical: 4 }, planTitle: { fontSize: 15, fontWeight: "900" }, triageRow: { borderTopWidth: 1, paddingVertical: 10, flexDirection: "row", alignItems: "center", gap: 8 }, triageCopy: { flex: 1 }, outlineButton: { minHeight: 48, borderWidth: 1, borderRadius: 15, alignItems: "center", justifyContent: "center", marginTop: 5 }, outlineText: { fontSize: 13, fontWeight: "800" }, metrics: { flexDirection: "row", gap: 10 }, metric: { flex: 1, borderWidth: 1, borderRadius: 18, padding: 16, gap: 2 }, metricValue: { fontSize: 28, fontWeight: "900" }, metricLabel: { fontSize: 13, fontWeight: "700" } });
