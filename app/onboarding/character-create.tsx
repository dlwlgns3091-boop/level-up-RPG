import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton } from "@/components/PrimaryButton";
import {
  PIXEL_BORDER_WIDTH,
  PIXEL_FONT,
  PIXEL_RADIUS,
  pixelCard,
} from "@/components/pixelStyles";
import { CategoryIcon } from "@/components/sprites";
import { CATEGORIES } from "@/constants/categories";
import { STRINGS } from "@/constants/strings.ko";
import { COLORS, useColors } from "@/constants/theme";
import { useCharacterStore } from "@/store/useCharacterStore";

export default function CharacterCreate() {
  const router = useRouter();
  const COLORS = useColors();
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const createCharacter = useCharacterStore((s) => s.createCharacter);

  const trimmed = name.trim();
  const isValid = trimmed.length >= 1 && trimmed.length <= 16;

  const handleSubmit = () => {
    if (!isValid || submitting) return;
    setSubmitting(true);
    try {
      createCharacter({ name: trimmed });
      router.replace("/onboarding/intro");
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <View className="flex-1 px-6 pt-6">
          <Text
            style={{
              fontFamily: PIXEL_FONT.uiBold,
              fontSize: 20,
              color: COLORS.text,
            }}
          >
            {STRINGS.onboarding.nameInputTitle}
          </Text>
          <Text
            style={{
              marginTop: 8,
              fontFamily: PIXEL_FONT.ui,
              fontSize: 12,
              color: COLORS.textMuted,
            }}
          >
            직업은 선택하지 않습니다. 활동에 따라 자동으로 각성됩니다.
          </Text>

          <View
            style={{
              marginTop: 24,
              padding: 14,
              backgroundColor: COLORS.bgSoft,
              ...pixelCard(COLORS.ink, PIXEL_RADIUS.lg, 4),
            }}
          >
            <Text
              style={{
                marginBottom: 10,
                fontFamily: PIXEL_FONT.uiBold,
                fontSize: 11,
                color: COLORS.textMuted,
                letterSpacing: 0.4,
              }}
            >
              4개 영역
            </Text>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
              }}
            >
              {CATEGORIES.map((c) => (
                <View
                  key={c.key}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginRight: 8,
                    marginBottom: 6,
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: PIXEL_RADIUS.pill,
                    borderWidth: PIXEL_BORDER_WIDTH,
                    borderColor: COLORS.ink,
                    backgroundColor: `${c.color}33`,
                  }}
                >
                  <CategoryIcon category={c.key} size={14} />
                  <Text
                    style={{
                      marginLeft: 6,
                      fontFamily: PIXEL_FONT.uiBold,
                      fontSize: 11,
                      color: c.color,
                    }}
                  >
                    {c.nameKo}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={{ marginTop: 24 }}>
            <Text
              style={{
                marginBottom: 8,
                fontFamily: PIXEL_FONT.uiBold,
                fontSize: 12,
                color: COLORS.textMuted,
              }}
            >
              캐릭터 이름
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder={STRINGS.onboarding.nameInputPlaceholder}
              placeholderTextColor={COLORS.textMuted}
              maxLength={16}
              autoFocus
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 14,
                borderRadius: PIXEL_RADIUS.md,
                borderWidth: PIXEL_BORDER_WIDTH,
                borderColor: COLORS.ink,
                backgroundColor: COLORS.bgSoft,
                fontFamily: PIXEL_FONT.uiBold,
                fontSize: 16,
                color: COLORS.text,
              }}
            />
            <Text
              style={{
                marginTop: 6,
                fontFamily: PIXEL_FONT.ui,
                fontSize: 11,
                color: COLORS.textSubtle,
              }}
            >
              {trimmed.length}/16자
            </Text>
          </View>
        </View>

        <View
          style={{
            paddingHorizontal: 24,
            paddingTop: 16,
            paddingBottom: 24,
            borderTopWidth: PIXEL_BORDER_WIDTH,
            borderTopColor: COLORS.ink,
            backgroundColor: COLORS.bg,
          }}
        >
          <PrimaryButton
            label={STRINGS.onboarding.nameInputCta}
            disabled={!isValid || submitting}
            onPress={handleSubmit}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
