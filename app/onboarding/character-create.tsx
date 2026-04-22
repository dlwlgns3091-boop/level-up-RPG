import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton } from "@/components/PrimaryButton";
import { CLASSES, STAT_LABELS_KO } from "@/constants/classes";
import { STRINGS } from "@/constants/strings.ko";
import { COLORS, type ClassKey } from "@/constants/theme";
import { useCharacterStore } from "@/store/useCharacterStore";

const VALID_CLASS_KEYS = new Set<ClassKey>(CLASSES.map((c) => c.key));

function isClassKey(value: string | undefined): value is ClassKey {
  return typeof value === "string" && VALID_CLASS_KEYS.has(value as ClassKey);
}

export default function CharacterCreate() {
  const router = useRouter();
  const params = useLocalSearchParams<{ class?: string }>();
  const classKey: ClassKey | null = isClassKey(params.class)
    ? params.class
    : null;
  const def = useMemo(
    () => CLASSES.find((c) => c.key === classKey) ?? null,
    [classKey],
  );

  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const createCharacter = useCharacterStore((s) => s.createCharacter);

  const trimmed = name.trim();
  const isValid = trimmed.length >= 1 && trimmed.length <= 16;

  const handleSubmit = () => {
    if (!isValid || !classKey || submitting) return;
    setSubmitting(true);
    try {
      createCharacter({ name: trimmed, class: classKey });
      router.replace("/(tabs)/home");
    } catch {
      setSubmitting(false);
    }
  };

  if (!def) {
    return (
      <SafeAreaView className="flex-1 bg-bg">
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-base text-text-muted">
            직업이 지정되지 않았습니다.
          </Text>
          <View className="mt-6 w-full">
            <PrimaryButton
              label="직업 다시 선택"
              variant="secondary"
              onPress={() => router.replace("/onboarding/class-select")}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const accent = COLORS.stat[def.mainStat];

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
            완료 후에는 변경할 수 있는 화면이 아직 없으니 신중히 정해주세요.
          </Text>

          <View
            className="mt-8 flex-row items-center rounded-2xl border border-bg-softer bg-bg-soft p-4"
            style={{ borderColor: `${accent}66` }}
          >
            <View
              className="mr-3 h-12 w-12 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${accent}33` }}
            >
              <Ionicons name="person" size={24} color={accent} />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-text">
                선택한 직업: {def.nameKo}
              </Text>
              <Text className="text-xs text-text-muted">
                주 스탯 · {STAT_LABELS_KO[def.mainStat]} · {def.concept}
              </Text>
            </View>
          </View>

          <View className="mt-8">
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
