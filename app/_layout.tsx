import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
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
