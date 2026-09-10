import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { BrandMark, Card, PrimaryButton, TextField } from "@/components/zelo-ui";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/lib/auth-context";

export default function RegisterScreen() {
  const colors = useColors();
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState({ nome: "", email: "", senha: "", confirmarSenha: "", telefone: "", cidade: "", estado: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const update = (key: keyof typeof form) => (value: string) => setForm((current) => ({ ...current, [key]: value }));

  async function handleRegister() {
    setError("");
    if (!form.nome.trim()) return setError("Nome: informe seu nome completo.");
    if (!form.email.trim() || !form.email.includes("@")) return setError("E-mail: informe um endereço válido.");
    if (form.senha.length < 6) return setError("Senha: use pelo menos 6 caracteres.");
    if (!form.confirmarSenha) return setError("Confirmação da senha: repita sua senha.");
    if (form.senha !== form.confirmarSenha) return setError("Confirmação da senha: as senhas informadas não conferem.");
    try {
      setLoading(true);
      await register({ ...form, nome: form.nome.trim(), email: form.email.trim() });
      router.replace("/(app)/(tabs)/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível criar sua conta. Confira os dados e tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <BrandMark />
          <View style={styles.intro}><Text style={[styles.title, { color: colors.foreground }]}>Crie seu acesso</Text><Text style={[styles.subtitle, { color: colors.muted }]}>Comece a acompanhar a rotina de cuidado dos seus pets.</Text></View>
          <Card style={styles.formCard}>
            <TextField label="Nome completo" value={form.nome} onChangeText={update("nome")} placeholder="Seu nome" autoCapitalize="words" />
            <TextField label="E-mail" value={form.email} onChangeText={update("email")} placeholder="voce@email.com" keyboardType="email-address" autoCapitalize="none" />
            <View style={styles.row}><View style={styles.half}><TextField label="Telefone" value={form.telefone} onChangeText={update("telefone")} placeholder="(11) 99999-9999" keyboardType="phone-pad" /></View><View style={styles.uf}><TextField label="UF" value={form.estado} onChangeText={update("estado")} placeholder="SP" autoCapitalize="characters" maxLength={2} /></View></View>
            <TextField label="Cidade" value={form.cidade} onChangeText={update("cidade")} placeholder="Sua cidade" />
            <TextField label="Senha" value={form.senha} onChangeText={update("senha")} placeholder="Mínimo de 6 caracteres" secureTextEntry />
            <TextField label="Confirmar senha" value={form.confirmarSenha} onChangeText={update("confirmarSenha")} placeholder="Repita sua senha" secureTextEntry />
            {error ? <Text style={[styles.error, { color: colors.error }]}>{error}</Text> : null}
            <PrimaryButton label="Criar conta" onPress={handleRegister} loading={loading} />
            <View style={styles.registerRow}><Text style={{ color: colors.muted }}>Já possui acesso?</Text><Link href="/(auth)/login" asChild><Pressable><Text style={[styles.link, { color: colors.primary }]}>Voltar para login</Text></Pressable></Link></View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 }, scroll: { padding: 24, gap: 20 }, intro: { gap: 6 }, title: { fontSize: 31, fontWeight: "800", letterSpacing: -0.8 }, subtitle: { fontSize: 15, lineHeight: 22 }, formCard: { gap: 15 }, row: { flexDirection: "row", gap: 12 }, half: { flex: 1 }, uf: { width: 75 }, error: { fontSize: 13, lineHeight: 18 }, registerRow: { flexDirection: "row", justifyContent: "center", gap: 5, alignItems: "center" }, link: { fontWeight: "800" },
});
