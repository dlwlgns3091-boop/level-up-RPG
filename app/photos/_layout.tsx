import { Stack } from "expo-router";

export default function PhotosLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#1E1A2E" },
      }}
    />
  );
}
