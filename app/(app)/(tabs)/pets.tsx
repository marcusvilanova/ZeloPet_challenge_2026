import { useRouter } from "expo-router";
import React from "react";
import { Alert, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";

import { Card, EmptyState, ErrorState, LoadingState, PrimaryButton, SectionTitle } from "@/components/zelo-ui";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useDeletePet, usePets } from "@/hooks/use-zelo";
import type { Pet } from "@/types/api";

export default function PetsScreen() {
  const colors = useColors();
  const router = useRouter();
  const pets = usePets();
  const remove = useDeletePet();
  if (pets.isLoading) return <ScreenContainer className="p-5"><LoadingState label="Carregando seus pets..." /></ScreenContainer>;
  if (pets.error && !pets.data) return <ScreenContainer className="p-5"><ErrorState message={pets.error instanceof Error ? pets.error.message : "Verifique a conexão com a API Java."} onRetry={() => void pets.refetch()} /></ScreenContainer>;
  const items = pets.data ?? [];
  function confirmRemove(pet: Pet) {
    Alert.alert("Remover pet", `Deseja remover ${pet.nome}?`, [{ text: "Cancelar", style: "cancel" }, { text: "Remover", style: "destructive", onPress: () => remove.mutate(pet.id) }]);
  }
  return <ScreenContainer className="p-5"><FlatList data={items} keyExtractor={(item) => String(item.id)} refreshControl={<RefreshControl refreshing={pets.isFetching} onRefresh={() => void pets.refetch()} tintColor={colors.primary} />} contentContainerStyle={items.length ? styles.list : styles.emptyList} ListHeaderComponent={<View style={styles.header}><SectionTitle title="Meus pets" subtitle="Acompanhe quem faz parte da sua família" /><PrimaryButton label="+ Cadastrar pet" onPress={() => router.push("/(app)/pet-new" as never)} /></View>} ListEmptyComponent={<EmptyState title="Nenhum pet cadastrado" description="Cadastre seu primeiro companheiro para começar a acompanhar os cuidados." />} renderItem={({ item }) => <PetCard pet={item} onEdit={() => router.push(`/(app)/pet/${item.id}` as never)} onDelete={() => confirmRemove(item)} colors={colors} />} /></ScreenContainer>;
}
function PetCard({ pet, onEdit, onDelete, colors }: { pet: Pet; onEdit: () => void; onDelete: () => void; colors: ReturnType<typeof useColors> }) { return <Card style={styles.card}><View style={styles.cardTop}><View style={[styles.petAvatar, { backgroundColor: `${colors.primary}18` }]}><Text style={{ fontSize: 26 }}>{pet.especie === "GATO" ? "🐱" : pet.especie === "CAO" ? "🐶" : "🐾"}</Text></View><View style={styles.copy}><Text style={[styles.petName, { color: colors.foreground }]}>{pet.nome}</Text><Text style={[styles.muted, { color: colors.muted }]}>{pet.especie}{pet.raca ? ` · ${pet.raca}` : ""}</Text></View></View><View style={[styles.details, { borderTopColor: colors.border }]}><Text style={[styles.detail, { color: colors.muted }]}>Sexo: <Text style={{ color: colors.foreground }}>{pet.sexo ?? "não informado"}</Text></Text><Text style={[styles.detail, { color: colors.muted }]}>Peso: <Text style={{ color: colors.foreground }}>{pet.pesoKg ? `${pet.pesoKg} kg` : "não informado"}</Text></Text></View><View style={styles.actions}><Pressable onPress={onEdit} style={[styles.outlineAction, { borderColor: colors.border }]}><Text style={[styles.actionText, { color: colors.foreground }]}>Editar</Text></Pressable><Pressable onPress={onDelete} style={[styles.outlineAction, { borderColor: `${colors.error}55` }]}><Text style={[styles.actionText, { color: colors.error }]}>Excluir</Text></Pressable></View></Card>; }
const styles = StyleSheet.create({ list: { gap: 14, paddingBottom: 28 }, emptyList: { flexGrow: 1 }, header: { gap: 6, marginBottom: 8 }, card: { gap: 14 }, cardTop: { flexDirection: "row", alignItems: "center", gap: 13 }, petAvatar: { width: 56, height: 56, borderRadius: 18, alignItems: "center", justifyContent: "center" }, copy: { flex: 1, gap: 3 }, petName: { fontSize: 19, fontWeight: "800" }, muted: { fontSize: 13 }, details: { borderTopWidth: 1, paddingTop: 12, flexDirection: "row", gap: 20 }, detail: { fontSize: 12 }, actions: { flexDirection: "row", gap: 9 }, outlineAction: { flex: 1, borderWidth: 1, borderRadius: 12, alignItems: "center", paddingVertical: 10 }, actionText: { fontWeight: "800", fontSize: 13 }, });
