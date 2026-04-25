import "../global.css";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { OfflineBanner } from "@/components/OfflineBanner";
import { COLORS } from "@/constants/theme";
import { useAppFonts } from "@/lib/fonts";
import { configureNotificationSystem } from "@/lib/notifications";
import { SUPABASE_CONFIGURED } from "@/lib/supabase";
import { useAuthStore } from "@/store/useAuthStore";
import { useCharacterStore } from "@/store/useCharacterStore";

export default function RootLayout() {
  const hydrate = useCharacterStore((s) => s.hydrate);
  const hydrateAuth = useAuthStore((s) => s.hydrate);
  const fontsLoaded = useAppFonts();

  useEffect(() => {
    hydrate();
    try {
      configureNotificationSystem().catch((e) => {
        if (__DEV__) console.log("[notifications] init rejected:", e);
      });
    } catch (e) {
      if (__DEV__) console.log("[notifications] init threw sync:", e);
    }
    if (SUPABASE_CONFIGURED) {
      hydrateAuth().catch((e) => {
        if (__DEV__) console.log("[auth] hydrate rejected:", e);
      });
    }
  }, [hydrate, hydrateAuth]);

  // 폰트 로드 동안 빈 배경만 — splash 효과. 폰트 파일이 없으면 즉시 true.
  if (!fontsLoaded) {
    return (
      <SafeAreaProvider>
        <StatusBar style="light" />
        <View style={{ flex: 1, backgroundColor: COLORS.bg }} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
        <OfflineBanner />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: COLORS.bg },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="auth" options={{ presentation: "modal" }} />
          <Stack.Screen name="photos" />
          <Stack.Screen name="calendar" />
          <Stack.Screen name="log" />
          <Stack.Screen name="events" />
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
      </View>
    </SafeAreaProvider>
  );
}
