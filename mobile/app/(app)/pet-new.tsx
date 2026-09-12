import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Card, LoadingState, PrimaryButton, SectionTitle, TextField } from "@/components/zelo-ui";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useCreatePet, usePet, useUpdatePet } from "@/hooks/use-zelo";
import type { PetInput, PetSex, PetSpecies } from "@/types/api";

const species: { value: PetSpecies; label: string; emoji: string }[] = [{ value: "CAO", label: "Cão", emoji: "🐶" }, { value: "GATO", label: "Gato", emoji: "🐱" }, { value: "OUTRO", label: "Outro", emoji: "🐾" }];
const sexes: { value: PetSex; label: string }[] = [{ value: "M", label: "Macho" }, { value: "F", label: "Fêmea" }, { value: "I", label: "Não informar" }];

export default function PetFormScreen() {
  const colors = useColors();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const editingId = id ? Number(id) : 0;
  const pet = usePet(editingId);
  const create = useCreatePet();
  const update = useUpdatePet(editingId);
  const [form, setForm] = useState<PetInput>({ nome: "", especie: "CAO", raca: "", sexo: "I", dataNascimento: "", pesoKg: undefined, castrado: false });
  const [error, setError] = useState("");
  const mutation = editingId ? update : create;
  useEffect(() => { if (pet.data) setForm({ nome: pet.data.nome, especie: pet.data.especie, raca: pet.data.raca ?? "", sexo: pet.data.sexo ?? "I", dataNascimento: pet.data.dataNascimento ?? "", pesoKg: pet.data.pesoKg ?? undefined, castrado: pet.data.castrado ?? false }); }, [pet.data]);
  if (editingId && pet.isLoading) return <ScreenContainer className="p-5"><LoadingState label="Carregando dados do pet..." /></ScreenContainer>;
  const set = (key: keyof PetInput, value: string | number | boolean | undefined) => setForm((current) => ({ ...current, [key]: value }));
  async function save() { setError(""); if (!form.nome.trim()) return setError("Informe o nome do pet."); try { await mutation.mutateAsync({ ...form, nome: form.nome.trim(), raca: form.raca?.trim() || undefined, dataNascimento: form.dataNascimento?.trim() || undefined }); router.back(); } catch (err) { setError(err instanceof Error ? err.message : "Não foi possível salvar o pet."); } }
  return <ScreenContainer className="p-5"><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled"><Pressable onPress={() => router.back()}><Text style={[styles.back, { color: colors.primary }]}>‹ Voltar</Text></Pressable><SectionTitle title={editingId ? "Editar pet" : "Novo pet"} subtitle={editingId ? "Mantenha os dados sempre atualizados" : "Conte um pouco sobre seu companheiro"} /><Card style={styles.card}><TextField label="Nome do pet" value={form.nome} onChangeText={(value) => set("nome", value)} placeholder="Ex.: Mel" autoCapitalize="words" /><Text style={[styles.label, { color: colors.foreground }]}>Espécie</Text><View style={styles.options}>{species.map((item) => <Pressable key={item.value} onPress={() => set("especie", item.value)} style={[styles.option, { borderColor: form.especie === item.value ? colors.primary : colors.border, backgroundColor: form.especie === item.value ? `${colors.primary}12` : colors.background }]}><Text style={styles.emoji}>{item.emoji}</Text><Text style={[styles.optionText, { color: colors.foreground }]}>{item.label}</Text></Pressable>)}</View><TextField label="Raça (opcional)" value={form.raca} onChangeText={(value) => set("raca", value)} placeholder="Ex.: SRD" /><Text style={[styles.label, { color: colors.foreground }]}>Sexo</Text><View style={styles.sexOptions}>{sexes.map((item) => <Pressable key={item.value} onPress={() => set("sexo", item.value)} style={[styles.sex, { borderColor: form.sexo === item.value ? colors.primary : colors.border, backgroundColor: form.sexo === item.value ? `${colors.primary}12` : colors.background }]}><Text style={[styles.optionText, { color: colors.foreground }]}>{item.label}</Text></Pressable>)}</View><TextField label="Data de nascimento (opcional)" value={form.dataNascimento} onChangeText={(value) => set("dataNascimento", value)} placeholder="AAAA-MM-DD" /><TextField label="Peso em kg (opcional)" value={form.pesoKg ? String(form.pesoKg) : ""} onChangeText={(value) => set("pesoKg", value ? Number(value.replace(",", ".")) : undefined)} placeholder="Ex.: 8.5" keyboardType="decimal-pad" />{error ? <Text style={[styles.error, { color: colors.error }]}>{error}</Text> : null}<PrimaryButton label={editingId ? "Salvar alterações" : "Cadastrar pet"} onPress={save} loading={mutation.isPending} /></Card></ScrollView></ScreenContainer>;
}
const styles = StyleSheet.create({ content: { gap: 18, paddingBottom: 32 }, back: { fontWeight: "800", fontSize: 15 }, card: { gap: 15 }, label: { fontSize: 13, fontWeight: "700", marginBottom: -5 }, options: { flexDirection: "row", gap: 9 }, option: { flex: 1, minHeight: 74, borderRadius: 14, borderWidth: 1, alignItems: "center", justifyContent: "center", gap: 4 }, emoji: { fontSize: 25 }, optionText: { fontSize: 12, fontWeight: "700" }, sexOptions: { flexDirection: "row", gap: 8 }, sex: { flex: 1, minHeight: 42, borderRadius: 12, borderWidth: 1, alignItems: "center", justifyContent: "center" }, error: { fontSize: 13, lineHeight: 18 }, });
