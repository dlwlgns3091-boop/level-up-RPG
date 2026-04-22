import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { STRINGS } from "@/constants/strings.ko";

export default function Welcome() {
  return (
    <SafeAreaView className="flex-1 bg-bg">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="mb-4 text-4xl font-bold text-gold">
          {STRINGS.app.name}
        </Text>
        <Text className="mb-12 text-base text-text-muted">
          {STRINGS.app.tagline}
        </Text>
        <Text className="mb-4 text-2xl font-semibold text-text">
          {STRINGS.onboarding.welcomeTitle}
        </Text>
        <Text className="mb-12 text-center text-base text-text-muted">
          {STRINGS.onboarding.welcomeBody}
        </Text>
        <Link href="/onboarding/class-select" asChild>
          <Pressable className="rounded-2xl bg-gold px-8 py-4 active:opacity-80">
            <Text className="text-base font-bold text-bg">
              {STRINGS.onboarding.welcomeCta}
            </Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}
