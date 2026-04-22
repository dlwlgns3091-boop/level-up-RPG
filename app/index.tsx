import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { COLORS } from "@/constants/theme";
import { useCharacterStore } from "@/store/useCharacterStore";

export default function Index() {
  const isReady = useCharacterStore((s) => s.isReady);
  const character = useCharacterStore((s) => s.character);

  if (!isReady) {
    return (
      <View className="flex-1 items-center justify-center bg-bg">
        <ActivityIndicator color={COLORS.gold} />
      </View>
    );
  }

  return character ? (
    <Redirect href="/(tabs)/home" />
  ) : (
    <Redirect href="/onboarding/welcome" />
  );
}
