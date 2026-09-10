import { Redirect, Stack } from "expo-router";

import { AppHeader } from "@/components/app-header";
import { LoadingState } from "@/components/zelo-ui";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/lib/auth-context";

export default function AppLayout() {
  const { isLoading, isAuthenticated } = useAuth();
  if (isLoading) return <ScreenContainer><LoadingState label="Validando sessão..." /></ScreenContainer>;
  if (!isAuthenticated) return <Redirect href="/(auth)/login" />;
  return <Stack screenOptions={{ headerShown: true, header: () => <AppHeader /> }} />;
}
