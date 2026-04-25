import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton } from "@/components/PrimaryButton";
import { CategoryIcon, KeyIcon } from "@/components/sprites";
import {
  PIXEL_BORDER_WIDTH,
  PIXEL_FONT,
  PIXEL_RADIUS,
  pixelCard,
} from "@/components/pixelStyles";
import { CATEGORIES } from "@/constants/categories";
import { STRINGS } from "@/constants/strings.ko";
import { COLORS } from "@/constants/theme";

export default function Intro() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <View className="flex-1 items-center justify-center px-6">
        <View
          style={{
            marginBottom: 24,
            width: 80,
            height: 80,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: PIXEL_RADIUS.lg,
            borderWidth: PIXEL_BORDER_WIDTH,
            borderColor: COLORS.ink,
            backgroundColor: `${COLORS.gold}22`,
          }}
        >
          <KeyIcon size={40} />
        </View>

        <Text
          style={{
            fontFamily: PIXEL_FONT.uiBold,
            fontSize: 18,
            color: COLORS.text,
            marginBottom: 12,
            textAlign: "center",
          }}
        >
          {STRINGS.onboarding.intro.title}
        </Text>
        <Text
          style={{
            fontFamily: PIXEL_FONT.ui,
            fontSize: 13,
            lineHeight: 20,
            color: COLORS.textMuted,
            textAlign: "center",
            marginBottom: 32,
          }}
        >
          {STRINGS.onboarding.intro.body}
        </Text>

        <View
          style={{
            marginBottom: 40,
            width: "100%",
            padding: 14,
            backgroundColor: COLORS.bgSoft,
            ...pixelCard(PIXEL_RADIUS.lg, 4),
          }}
        >
          {CATEGORIES.map((c) => (
            <View
              key={c.key}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 4,
              }}
            >
              <View
                style={{
                  width: 32,
                  height: 32,
                  marginRight: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: PIXEL_RADIUS.md,
                  borderWidth: PIXEL_BORDER_WIDTH,
                  borderColor: COLORS.ink,
                  backgroundColor: `${c.color}33`,
                }}
              >
                <CategoryIcon category={c.key} size={18} />
              </View>
              <Text
                style={{
                  fontFamily: PIXEL_FONT.uiBold,
                  fontSize: 13,
                  color: COLORS.text,
                }}
              >
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
