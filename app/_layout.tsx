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
    // 동기 throw까지 방어 — Expo Go Android에서 알림 모듈 로드가 터져도
    // 앱 부팅이 막히지 않도록.
    try {
      configureNotificationSystem().catch((e) => {
        if (__DEV__) console.log("[notifications] init rejected:", e);
      });
    } catch (e) {
      if (__DEV__) console.log("[notifications] init threw sync:", e);
    }
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
        <Stack.Screen
          name="modals/class-change"
          options={{ presentation: "transparentModal", animation: "fade" }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
