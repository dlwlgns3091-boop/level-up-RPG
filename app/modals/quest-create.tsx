import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { type ReactNode, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton } from "@/components/PrimaryButton";
import { STAT_LABELS_KO } from "@/constants/classes";
import { STRINGS } from "@/constants/strings.ko";
import { COLORS, type StatKey } from "@/constants/theme";
import { createTemplate } from "@/db/quest";
import type { QuestType } from "@/db/types";

const STAT_OPTIONS: readonly StatKey[] = [
  "str",
  "int",
  "wis",
  "dex",
  "con",
  "cha",
] as const;

const XP_OPTIONS = [10, 20, 30, 50] as const;

type FrequencyKey = "daily" | "weekly";

const FREQUENCY_OPTIONS: readonly {
  key: FrequencyKey;
  label: string;
  hint: string;
}[] = [
  { key: "daily", label: "매일", hint: "일일 탭에서 매일 완료 체크" },
  { key: "weekly", label: "주간", hint: "주간 탭에서 누적 횟수 기록" },
];

export default function QuestCreate() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stat, setStat] = useState<StatKey>("str");
  const [xp, setXp] = useState<number>(20);
  const [frequency, setFrequency] = useState<FrequencyKey>("daily");
  const [submitting, setSubmitting] = useState(false);

  const trimmedTitle = title.trim();
  const isValid = trimmedTitle.length >= 1 && trimmedTitle.length <= 40;

  const handleSave = () => {
    if (!isValid || submitting) return;
    setSubmitting(true);
    try {
      const questType: QuestType = frequency;
      const trimmedDesc = description.trim();
      createTemplate({
        title: trimmedTitle,
        description: trimmedDesc.length > 0 ? trimmedDesc : null,
        quest_type: questType,
        target_stat: stat,
        xp_reward: xp,
        repeat_pattern: frequency,
        is_custom: true,
      });
      router.back();
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
        <View className="flex-row items-center justify-between border-b border-bg-softer px-5 py-3">
          <Pressable onPress={() => router.back()} className="p-1">
            <Ionicons name="close" size={24} color={COLORS.textMuted} />
          </Pressable>
          <Text className="text-base font-bold text-text">
            커스텀 퀘스트 추가
          </Text>
          <View className="w-6" />
        </View>

        <ScrollView
          className="flex-1 px-5"
          contentContainerStyle={{ paddingVertical: 16, paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
        >
          <Field label="제목">
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="예: 캘리그래피 10분"
              placeholderTextColor={COLORS.textMuted}
              maxLength={40}
              className="rounded-2xl border border-bg-softer bg-bg-soft px-4 py-3 text-base text-text"
            />
            <Text className="mt-1 text-xs text-text-muted">
              {trimmedTitle.length}/40자
            </Text>
          </Field>

          <Field label="설명 (선택)">
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="선택 입력"
              placeholderTextColor={COLORS.textMuted}
              maxLength={80}
              multiline
              className="min-h-[56px] rounded-2xl border border-bg-softer bg-bg-soft px-4 py-3 text-base text-text"
            />
          </Field>

          <Field label="반복 주기">
            <View className="flex-row">
              {FREQUENCY_OPTIONS.map((opt) => {
                const active = opt.key === frequency;
                return (
                  <Pressable
                    key={opt.key}
                    onPress={() => setFrequency(opt.key)}
                    className={`mr-2 flex-1 rounded-2xl border px-3 py-3 ${
                      active
                        ? "border-gold bg-bg-soft"
                        : "border-bg-softer bg-bg-soft active:opacity-80"
                    }`}
                  >
                    <Text
                      className={`text-center text-sm font-bold ${
                        active ? "text-gold" : "text-text"
                      }`}
                    >
                      {opt.label}
                    </Text>
                    <Text className="mt-1 text-center text-[10px] text-text-muted">
                      {opt.hint}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Field>

          <Field label="연관 스탯">
            <View className="flex-row flex-wrap">
              {STAT_OPTIONS.map((s) => {
                const active = s === stat;
                const color = COLORS.stat[s];
                return (
                  <Pressable
                    key={s}
                    onPress={() => setStat(s)}
                    className="mb-2 mr-2 rounded-full border px-3 py-2"
                    style={{
                      borderColor: active ? color : COLORS.bgSofter,
                      backgroundColor: active ? `${color}33` : COLORS.bgSoft,
                    }}
                  >
                    <Text
                      className="text-xs font-semibold"
                      style={{ color: active ? color : COLORS.textMuted }}
                    >
                      {STAT_LABELS_KO[s]}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Field>

          <Field label="완료 시 획득 XP">
            <View className="flex-row">
              {XP_OPTIONS.map((n) => {
                const active = n === xp;
                return (
                  <Pressable
                    key={n}
                    onPress={() => setXp(n)}
                    className={`mr-2 flex-1 rounded-2xl border py-3 ${
                      active
                        ? "border-gold bg-bg-soft"
                        : "border-bg-softer bg-bg-soft active:opacity-80"
                    }`}
                  >
                    <Text
                      className={`text-center text-sm font-bold ${
                        active ? "text-gold" : "text-text"
                      }`}
                    >
                      +{n}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Field>
        </ScrollView>

        <View className="border-t border-bg-softer bg-bg px-5 pt-4 pb-6">
          <PrimaryButton
            label={STRINGS.common.save}
            disabled={!isValid || submitting}
            onPress={handleSave}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <View className="mb-5">
      <Text className="mb-2 text-sm text-text-muted">{label}</Text>
      {children}
    </View>
  );
}
