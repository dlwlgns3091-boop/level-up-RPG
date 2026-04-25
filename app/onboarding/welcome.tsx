import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton } from "@/components/PrimaryButton";
import { PIXEL_BORDER_WIDTH, PIXEL_FONT, PIXEL_RADIUS } from "@/components/pixelStyles";
import { ApprenticeCodex } from "@/components/sprites";
import { STRINGS } from "@/constants/strings.ko";
import { COLORS, useColors } from "@/constants/theme";

export default function Welcome() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <View className="flex-1 items-center justify-center px-6">
        {/* 캐릭터 카드 */}
        <View
          style={{
            marginBottom: 24,
            width: 144,
            height: 144,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: PIXEL_BORDER_WIDTH,
            borderColor: COLORS.ink,
            borderRadius: PIXEL_RADIUS.lg,
            backgroundColor: COLORS.bgSoft,
          }}
        >
          <ApprenticeCodex size={120} />
        </View>

        <Text
          style={{
            fontFamily: PIXEL_FONT.display,
            fontSize: 32,
            color: COLORS.gold,
            letterSpacing: 1,
            marginBottom: 6,
          }}
        >
          {STRINGS.app.name}
        </Text>
        <Text
          style={{
            fontFamily: PIXEL_FONT.ui,
            fontSize: 12,
            color: COLORS.textMuted,
            marginBottom: 36,
          }}
        >
          {STRINGS.app.tagline}
        </Text>

        <Text
          style={{
            fontFamily: PIXEL_FONT.uiBold,
            fontSize: 18,
            color: COLORS.text,
            marginBottom: 12,
            textAlign: "center",
          }}
        >
          {STRINGS.onboarding.welcomeTitle}
        </Text>
        <Text
          style={{
            fontFamily: PIXEL_FONT.ui,
            fontSize: 13,
            lineHeight: 20,
            color: COLORS.textMuted,
            textAlign: "center",
            marginBottom: 40,
          }}
        >
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
