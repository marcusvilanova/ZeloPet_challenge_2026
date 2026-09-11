import { StyleSheet, Text, View } from "react-native";

import { StatusBadge } from "@/components/zelo-ui";
import { useColors } from "@/hooks/use-colors";
import { useTriagens } from "@/hooks/use-zelo";
import { EmptyMessage, MobilePage, PageHeading } from "@/screens/shared/screen-kit";

export default function AttentionQueueScreen() {
  const colors = useColors();
  const triagens = useTriagens();
  const items = [...(triagens.data ?? [])].sort((a, b) => b.scoreRisco - a.scoreRisco);
  return <MobilePage refreshing={triagens.isRefetching} onRefresh={() => void triagens.refetch()}>
    <PageHeading eyebrow="ATENDIMENTO" title="Fila de atenção" subtitle="Triagens priorizadas pelo nível de risco." />
    {triagens.isLoading && <Text style={[styles.muted, { color: colors.muted }]}>Carregando fila...</Text>}
    {!triagens.isLoading && items.length === 0 && <EmptyMessage title="Fila vazia" description="Não há triagens aguardando atendimento no momento." />}
    {items.map((triage, index) => <View key={triage.id} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}><View style={styles.top}><View style={styles.rank}><Text style={[styles.rankText, { color: colors.primary }]}>{String(index + 1).padStart(2, "0")}</Text></View><View style={styles.copy}><Text style={[styles.pet, { color: colors.foreground }]}>{triage.petNome ?? "Pet"}</Text><Text style={[styles.clinic, { color: colors.muted }]}>{triage.clinicaNome ?? "Clínica não informada"} · Canal {triage.canal}</Text></View><StatusBadge label={triage.urgencia} tone={triage.urgencia === "EMERGENCIA" || triage.urgencia === "ALTA" ? "danger" : triage.urgencia === "MEDIA" ? "warning" : "success"} /></View><Text style={[styles.report, { color: colors.foreground }]}>{triage.relato}</Text><View style={[styles.footer, { borderTopColor: colors.border }]}><Text style={[styles.status, { color: colors.muted }]}>{triage.status}</Text><Text style={[styles.score, { color: colors.primary }]}>Risco {triage.scoreRisco}</Text></View></View>)}
  </MobilePage>;
}
const styles = StyleSheet.create({ muted: { fontSize: 14 }, card: { borderWidth: 1, borderRadius: 18, padding: 16, gap: 12 }, top: { flexDirection: "row", alignItems: "center", gap: 10 }, rank: { width: 34, height: 34, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "#EAF5F0" }, rankText: { fontWeight: "900", fontSize: 12 }, copy: { flex: 1, gap: 3 }, pet: { fontSize: 17, fontWeight: "900" }, clinic: { fontSize: 12 }, report: { fontSize: 14, lineHeight: 20 }, footer: { flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, paddingTop: 11 }, status: { fontSize: 12, fontWeight: "800" }, score: { fontSize: 12, fontWeight: "900" } });
