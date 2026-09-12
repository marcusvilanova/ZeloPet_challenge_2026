import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { BrandMark, Card, PrimaryButton, TextField } from "@/components/zelo-ui";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/lib/auth-context";

export default function LoginScreen() {
  const colors = useColors();
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError("");
    if (!email.trim() || !email.includes("@")) return setError("Informe um e-mail válido.");
    if (senha.length < 6) return setError("A senha deve ter pelo menos 6 caracteres.");
    try {
      setLoading(true);
      await login(email.trim(), senha);
      router.replace("/(app)/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível entrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.hero}>
            <BrandMark />
            <Text style={[styles.eyebrow, { color: colors.primary }]}>CUIDADO CONTÍNUO</Text>
            <Text style={[styles.title, { color: colors.foreground }]}>Seu pet bem cuidado, todos os dias.</Text>
            <Text style={[styles.subtitle, { color: colors.muted }]}>Acompanhe a saúde, os alertas e as triagens dos seus companheiros em um só lugar.</Text>
          </View>
          <Card style={styles.formCard}>
            <Text style={[styles.formTitle, { color: colors.foreground }]}>Entrar no Zelo</Text>
            <Text style={[styles.formSubtitle, { color: colors.muted }]}>Use o mesmo acesso da plataforma Java.</Text>
            <TextField label="E-mail" value={email} onChangeText={setEmail} placeholder="voce@email.com" keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
            <TextField label="Senha" value={senha} onChangeText={setSenha} placeholder="Sua senha" secureTextEntry autoComplete="password" />
            {error ? <Text style={[styles.error, { color: colors.error }]}>{error}</Text> : null}
            <PrimaryButton label="Entrar" onPress={handleLogin} loading={loading} />
            <View style={styles.registerRow}>
              <Text style={{ color: colors.muted }}>Ainda não possui conta?</Text>
              <Link href="/(auth)/register" asChild>
                <Pressable><Text style={[styles.link, { color: colors.primary }]}>Criar cadastro</Text></Pressable>
              </Link>
            </View>
          </Card>
          <Text style={[styles.security, { color: colors.muted }]}>Acesso seguro por autenticação da API Zelo</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { flexGrow: 1, padding: 24, justifyContent: "center", gap: 26 },
  hero: { gap: 10 },
  eyebrow: { fontSize: 11, fontWeight: "800", letterSpacing: 1.4, marginTop: 12 },
  title: { fontSize: 34, lineHeight: 40, fontWeight: "800", letterSpacing: -1.1 },
  subtitle: { fontSize: 15, lineHeight: 23, maxWidth: 380 },
  formCard: { gap: 16 },
  formTitle: { fontSize: 24, fontWeight: "800" },
  formSubtitle: { fontSize: 14, marginTop: -10 },
  error: { fontSize: 13, lineHeight: 18 },
  registerRow: { flexDirection: "row", justifyContent: "center", gap: 5, alignItems: "center", marginTop: 2 },
  link: { fontWeight: "800" },
  security: { textAlign: "center", fontSize: 12 },
});
