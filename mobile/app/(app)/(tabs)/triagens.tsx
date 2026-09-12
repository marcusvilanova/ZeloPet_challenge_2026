import { useRouter } from "expo-router";
import React from "react";
import { Alert, FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";

import { Card, EmptyState, ErrorState, LoadingState, PrimaryButton, SectionTitle, StatusBadge } from "@/components/zelo-ui";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useCancelTriagem, useDeleteTriagem, useTriagens } from "@/hooks/use-zelo";
import type { Triage } from "@/types/api";

export default function TriagensScreen() {
  const colors = useColors(); const router = useRouter(); const triagens = useTriagens(); const cancel = useCancelTriagem(); const remove = useDeleteTriagem();
  if (triagens.isLoading) return <ScreenContainer className="p-5"><LoadingState label="Carregando triagens..." /></ScreenContainer>;
  if (triagens.error && !triagens.data) return <ScreenContainer className="p-5"><ErrorState message={triagens.error instanceof Error ? triagens.error.message : "Verifique a conexão com a API Java."} onRetry={() => void triagens.refetch()} /></ScreenContainer>;
  const items = triagens.data ?? [];
  function actions(item: Triage) { Alert.alert("Ações da triagem", item.petNome ?? "Triagem", [{ text: "Fechar" }, ...(item.status === "ABERTA" ? [{ text: "Cancelar triagem", style: "destructive" as const, onPress: () => cancel.mutate(item.id) }] : []), { text: "Excluir registro", style: "destructive", onPress: () => remove.mutate(item.id) }]); }
  return <ScreenContainer className="p-5"><FlatList data={items} keyExtractor={(item) => String(item.id)} refreshControl={<RefreshControl refreshing={triagens.isFetching} onRefresh={() => void triagens.refetch()} tintColor={colors.primary} />} contentContainerStyle={items.length ? styles.list : styles.emptyList} ListHeaderComponent={<View style={styles.header}><SectionTitle title="Triagens" subtitle="Histórico dos relatos enviados às clínicas" /><PrimaryButton label="+ Nova triagem" onPress={() => router.push("/(app)/triagem-new" as never)} /></View>} ListEmptyComponent={<EmptyState title="Nenhuma triagem" description="Registre um relato quando precisar de orientação para seu pet." />} renderItem={({ item }) => <TriageCard item={item} colors={colors} onActions={() => actions(item)} />} /></ScreenContainer>;
}
function TriageCard({ item, colors, onActions }: { item: Triage; colors: ReturnType<typeof useColors>; onActions: () => void }) { const tone = item.urgencia === "EMERGENCIA" || item.urgencia === "ALTA" ? "danger" : item.urgencia === "MEDIA" ? "warning" : "success"; return <Card style={styles.card}><View style={styles.top}><View style={styles.copy}><Text style={[styles.title, { color: colors.foreground }]}>{item.petNome ?? "Pet"}</Text><Text style={[styles.date, { color: colors.muted }]}>{item.criadaEm}</Text></View><StatusBadge label={item.urgencia} tone={tone} /></View><Text numberOfLines={3} style={[styles.relato, { color: colors.foreground }]}>{item.relato}</Text><View style={styles.bottom}><StatusBadge label={item.status} tone={item.status === "ATENDIDA" ? "success" : item.status === "CANCELADA" ? "danger" : "info"} /><Text style={[styles.action, { color: colors.primary }]} onPress={onActions}>Gerenciar</Text></View></Card>; }
const styles = StyleSheet.create({ list: { gap: 14, paddingBottom: 28 }, emptyList: { flexGrow: 1 }, header: { gap: 6, marginBottom: 8 }, card: { gap: 14 }, top: { flexDirection: "row", alignItems: "flex-start", gap: 10 }, copy: { flex: 1, gap: 4 }, title: { fontSize: 18, fontWeight: "800" }, date: { fontSize: 12 }, relato: { fontSize: 14, lineHeight: 21 }, bottom: { borderTopWidth: 1, borderTopColor: "#E5E7EB", paddingTop: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, action: { fontSize: 13, fontWeight: "800" }, });
