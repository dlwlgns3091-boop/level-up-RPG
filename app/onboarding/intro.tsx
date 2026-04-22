import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton } from "@/components/PrimaryButton";
import { CATEGORIES } from "@/constants/categories";
import { STRINGS } from "@/constants/strings.ko";
import { COLORS } from "@/constants/theme";

export default function Intro() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <View className="flex-1 items-center justify-center px-6">
        <View
          className="mb-6 h-20 w-20 items-center justify-center rounded-3xl"
          style={{ backgroundColor: `${COLORS.gold}22` }}
        >
          <Ionicons name="compass" size={40} color={COLORS.gold} />
        </View>

        <Text className="mb-3 text-center text-2xl font-bold text-text">
          {STRINGS.onboarding.intro.title}
        </Text>
        <Text className="mb-10 text-center text-base leading-6 text-text-muted">
          {STRINGS.onboarding.intro.body}
        </Text>

        <View className="mb-12 w-full rounded-2xl border border-bg-softer bg-bg-soft p-4">
          {CATEGORIES.map((c) => (
            <View
              key={c.key}
              className="flex-row items-center py-1.5"
            >
              <View
                className="mr-3 h-7 w-7 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${c.color}33` }}
              >
                <Text>{c.emoji}</Text>
              </View>
              <Text className="text-sm font-semibold text-text">
                {c.nameKo}
              </Text>
            </View>
          ))}
        </View>

        <View className="w-full">
          <PrimaryButton
            label={STRINGS.onboarding.intro.cta}
            onPress={() => router.replace("/(tabs)/home")}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
