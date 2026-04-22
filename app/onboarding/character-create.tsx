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
import { CATEGORIES } from "@/constants/categories";
import { STRINGS } from "@/constants/strings.ko";
import { COLORS } from "@/constants/theme";
import { useCharacterStore } from "@/store/useCharacterStore";

export default function CharacterCreate() {
  const router = useRouter();
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
          <Text className="text-2xl font-bold text-text">
            {STRINGS.onboarding.nameInputTitle}
          </Text>
          <Text className="mt-2 text-sm text-text-muted">
            직업은 선택하지 않습니다. 활동에 따라 자동으로 각성됩니다.
          </Text>

          <View className="mt-6 rounded-2xl border border-bg-softer bg-bg-soft p-4">
            <Text className="mb-2 text-xs text-text-muted">4개 영역</Text>
            <View className="flex-row flex-wrap">
              {CATEGORIES.map((c) => (
                <View
                  key={c.key}
                  className="mb-2 mr-2 rounded-full px-3 py-1.5"
                  style={{ backgroundColor: `${c.color}33` }}
                >
                  <Text
                    className="text-xs font-semibold"
                    style={{ color: c.color }}
                  >
                    {c.emoji} {c.nameKo}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View className="mt-6">
            <Text className="mb-2 text-sm text-text-muted">캐릭터 이름</Text>
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
              className="rounded-2xl border border-bg-softer bg-bg-soft px-4 py-4 text-base text-text"
            />
            <Text className="mt-2 text-xs text-text-muted">
              {trimmed.length}/16자
            </Text>
          </View>
        </View>

        <View className="border-t border-bg-softer bg-bg px-6 pt-4 pb-6">
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
