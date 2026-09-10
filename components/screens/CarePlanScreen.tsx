import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { PrimaryButton, StatusBadge } from "@/components/zelo-ui";
import { useColors } from "@/hooks/use-colors";
import { useAlertas, useCancelAlerta, useConfirmAlerta } from "@/hooks/use-zelo";
import { EmptyMessage, MobilePage, PageHeading } from "@/components/screen-kit";

export default function CarePlanScreen() {
  const colors = useColors();
  const router = useRouter();
  const alerts = useAlertas();
  const confirm = useConfirmAlerta();
  const cancel = useCancelAlerta();
  const items = alerts.data ?? [];
  return <MobilePage refreshing={alerts.isRefetching} onRefresh={() => void alerts.refetch()}>
    <PageHeading eyebrow="CICLO ZELO" title="Plano de cuidado" subtitle="Lembretes para acompanhar a saúde do seu pet." action={<Pressable onPress={() => router.push("/(app)/alerta-new")} style={[styles.smallAction, { backgroundColor: colors.primary }]}><Text style={styles.smallActionText}>Novo</Text></Pressable>} />
    {alerts.isLoading && <Text style={[styles.muted, { color: colors.muted }]}>Carregando lembretes...</Text>}
    {!alerts.isLoading && items.length === 0 && <EmptyMessage title="Nenhum cuidado pendente" description="Crie um lembrete para não esquecer vacinas, checkups e retornos." />}
    {items.map((alert) => <View key={alert.id} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}><View style={styles.row}><View style={styles.copy}><Text style={[styles.title, { color: colors.foreground }]}>{alert.titulo}</Text><Text style={[styles.meta, { color: colors.muted }]}>{alert.petNome ?? "Pet"} · {alert.tipo} · previsto para {alert.dataPrevista}</Text></View><StatusBadge label={alert.status} tone={alert.status === "CONCLUIDO" ? "success" : alert.status === "CANCELADO" ? "danger" : "info"} /></View>{alert.descricao && <Text style={[styles.description, { color: colors.foreground }]}>{alert.descricao}</Text>}{(alert.status === "PENDENTE" || alert.status === "ENVIADO") && <View style={styles.actions}><PrimaryButton label="Confirmar realizado" onPress={() => confirm.mutate(alert.id)} loading={confirm.isPending} /><Pressable onPress={() => cancel.mutate(alert.id)} style={[styles.cancel, { borderColor: colors.error }]}><Text style={[styles.cancelText, { color: colors.error }]}>Cancelar</Text></Pressable></View>}</View>)}
  </MobilePage>;
}
const styles = StyleSheet.create({ smallAction: { borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10 }, smallActionText: { color: "#FFFFFF", fontWeight: "900", fontSize: 13 }, muted: { fontSize: 14 }, card: { borderWidth: 1, borderRadius: 18, padding: 16, gap: 12 }, row: { flexDirection: "row", alignItems: "flex-start", gap: 8 }, copy: { flex: 1, gap: 5 }, title: { fontSize: 17, fontWeight: "900" }, meta: { fontSize: 12, lineHeight: 18 }, description: { fontSize: 14, lineHeight: 20 }, actions: { flexDirection: "row", alignItems: "center", gap: 9 }, cancel: { minHeight: 52, borderWidth: 1, borderRadius: 16, justifyContent: "center", paddingHorizontal: 14 }, cancelText: { fontSize: 13, fontWeight: "900" } });
