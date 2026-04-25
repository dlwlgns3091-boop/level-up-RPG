import "../global.css";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { OfflineBanner } from "@/components/OfflineBanner";
import { COLORS, useColors } from "@/constants/theme";
import { useAppFonts } from "@/lib/fonts";
import { configureNotificationSystem } from "@/lib/notifications";
import { SUPABASE_CONFIGURED } from "@/lib/supabase";
import { paletteToVars } from "@/lib/themeVars";
import { useAuthStore } from "@/store/useAuthStore";
import { useCharacterStore } from "@/store/useCharacterStore";
import { useThemeStore } from "@/store/useThemeStore";

export default function RootLayout() {
  const hydrate = useCharacterStore((s) => s.hydrate);
  const hydrateAuth = useAuthStore((s) => s.hydrate);
  const hydrateTheme = useThemeStore((s) => s.hydrate);
  const themeReady = useThemeStore((s) => s.isReady);
  const themeId = useThemeStore((s) => s.themeId);
  const palette = useColors();
  const fontsLoaded = useAppFonts();

  useEffect(() => {
    hydrate();
    hydrateTheme().catch((e) => {
      if (__DEV__) console.log("[theme] hydrate rejected:", e);
    });
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
  }, [hydrate, hydrateAuth, hydrateTheme]);

  const themeVars = paletteToVars(palette);
  const isDark = themeId === "midnight";

  if (!fontsLoaded || !themeReady) {
    return (
      <SafeAreaProvider>
        <StatusBar style={isDark ? "light" : "dark"} />
        <View style={[{ flex: 1, backgroundColor: palette.bg }, themeVars]} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style={isDark ? "light" : "dark"} />
      <View
        style={[{ flex: 1, backgroundColor: palette.bg }, themeVars]}
      >
        <OfflineBanner />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: palette.bg },
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
