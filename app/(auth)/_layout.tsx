import { Redirect, Stack } from "expo-router";

import { LoadingState } from "@/components/zelo-ui";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/lib/auth-context";

export default function AuthLayout() {
  const { isLoading, isAuthenticated } = useAuth();
  if (isLoading) return <ScreenContainer><LoadingState label="Validando sessão..." /></ScreenContainer>;
  if (isAuthenticated) return <Redirect href="/(app)/(tabs)/dashboard" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
