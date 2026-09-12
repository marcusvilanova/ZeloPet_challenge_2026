import { Redirect } from "expo-router";

import { LoadingState } from "@/components/zelo-ui";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/lib/auth-context";

export default function EntryRoute() {
  const { isLoading, isAuthenticated } = useAuth();
  if (isLoading) {
    return <ScreenContainer><LoadingState label="Abrindo o Zelo..." /></ScreenContainer>;
  }
  return <Redirect href={isAuthenticated ? "/(app)/home" : "/(auth)/login"} />;
}
