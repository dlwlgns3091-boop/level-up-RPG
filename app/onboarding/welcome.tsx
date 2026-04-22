import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton } from "@/components/PrimaryButton";
import { COLORS } from "@/constants/theme";
import { STRINGS } from "@/constants/strings.ko";

export default function Welcome() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <View className="flex-1 items-center justify-center px-6">
        <View
          className="mb-8 h-24 w-24 items-center justify-center rounded-3xl"
          style={{ backgroundColor: `${COLORS.gold}22` }}
        >
          <Ionicons name="sparkles" size={48} color={COLORS.gold} />
        </View>

        <Text className="mb-2 text-4xl font-bold text-gold">
          {STRINGS.app.name}
        </Text>
        <Text className="mb-12 text-base text-text-muted">
          {STRINGS.app.tagline}
        </Text>

        <Text className="mb-3 text-2xl font-semibold text-text">
          {STRINGS.onboarding.welcomeTitle}
        </Text>
        <Text className="mb-12 text-center text-base leading-6 text-text-muted">
          {STRINGS.onboarding.welcomeBody}
        </Text>

        <View className="w-full">
          <PrimaryButton
            label={STRINGS.onboarding.welcomeCta}
            onPress={() => router.push("/onboarding/character-create")}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
