import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { PrimaryButton, TextField } from "@/components/zelo-ui";
import { useColors } from "@/hooks/use-colors";
import { useMyClinic, useUpdateClinic } from "@/hooks/use-zelo";
import { EmptyMessage, MobilePage, PageHeading } from "@/components/screen-kit";

export default function ClinicScreen() {
  const colors = useColors();
  const clinics = useMyClinic();
  const updateClinic = useUpdateClinic();
  const clinic = clinics.data;
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const startEditing = () => { setName(clinic?.nome ?? ""); setCity(clinic?.cidade ?? ""); setState(clinic?.estado ?? ""); setEditing(true); };
  const save = async () => { if (!clinic || !name.trim()) return; await updateClinic.mutateAsync({ id: clinic.id, input: { nome: name.trim(), cidade: city.trim(), estado: state.trim().toUpperCase() } }); setEditing(false); };
  return <MobilePage refreshing={clinics.isRefetching} onRefresh={() => void clinics.refetch()}><PageHeading eyebrow="GESTÃO" title="Minha clínica" subtitle="Confira as informações da unidade e mantenha o cadastro atualizado." />{clinics.isLoading && <Text style={[styles.muted, { color: colors.muted }]}>Carregando clínica...</Text>}{!clinics.isLoading && !clinic && <EmptyMessage title="Clínica não encontrada" description="O usuário gestor ainda não está vinculado a uma clínica no banco de dados." />}{clinic && !editing && <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}><View style={styles.icon}><Text style={styles.iconText}>+</Text></View><Text style={[styles.name, { color: colors.foreground }]}>{clinic.nome}</Text><Text style={[styles.info, { color: colors.muted }]}>{clinic.cidade ?? "Cidade não informada"} · {clinic.estado ?? "UF"}</Text><PrimaryButton label="Editar dados da clínica" onPress={startEditing} /></View>}{clinic && editing && <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}><TextField label="Nome da clínica" value={name} onChangeText={setName} /><TextField label="Cidade" value={city} onChangeText={setCity} /><TextField label="Estado" value={state} onChangeText={setState} maxLength={2} autoCapitalize="characters" /><PrimaryButton label="Salvar alterações" onPress={() => void save()} loading={updateClinic.isPending} /><Pressable onPress={() => setEditing(false)} style={styles.cancel}><Text style={[styles.cancelText, { color: colors.muted }]}>Voltar sem salvar</Text></Pressable></View>}</MobilePage>;
}
const styles = StyleSheet.create({ muted: { fontSize: 14 }, card: { borderWidth: 1, borderRadius: 20, padding: 18, gap: 13 }, icon: { width: 48, height: 48, borderRadius: 16, backgroundColor: "#E8F3EE", alignItems: "center", justifyContent: "center" }, iconText: { color: "#17735E", fontSize: 23, fontWeight: "900" }, name: { fontSize: 22, fontWeight: "900" }, info: { fontSize: 14 }, cancel: { alignItems: "center", padding: 8 }, cancelText: { fontSize: 13, fontWeight: "800" } });
