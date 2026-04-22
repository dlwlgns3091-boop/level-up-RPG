import "../global.css";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { configureNotificationSystem } from "@/lib/notifications";
import { useCharacterStore } from "@/store/useCharacterStore";

export default function RootLayout() {
  const hydrate = useCharacterStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
    configureNotificationSystem().catch(() => {
      // 알림 설정 실패는 앱 사용을 막지 않는다
    });
  }, [hydrate]);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#0F172A" },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="modals/quest-detail"
          options={{ presentation: "modal" }}
        />
        <Stack.Screen
          name="modals/quest-create"
          options={{ presentation: "modal" }}
        />
        <Stack.Screen
          name="modals/level-up"
          options={{ presentation: "transparentModal", animation: "fade" }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
