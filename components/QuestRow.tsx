import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { STAT_LABELS_KO } from "@/constants/classes";
import { COLORS } from "@/constants/theme";
import type { QuestTemplate } from "@/db/types";

type Props = {
  template: QuestTemplate;
  done: boolean;
  disabled?: boolean;
  onPress: () => void;
};

export function QuestRow({ template, done, disabled = false, onPress }: Props) {
  const statColor = COLORS.stat[template.target_stat];

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      className={`mb-3 flex-row items-center rounded-2xl border p-4 ${
        done
          ? "border-bg-softer bg-bg-soft opacity-60"
          : "border-bg-softer bg-bg-soft active:opacity-80"
      }`}
    >
      <View
        className="mr-3 h-8 w-8 items-center justify-center rounded-lg border"
        style={{
          borderColor: done ? COLORS.gold : COLORS.textMuted,
          backgroundColor: done ? COLORS.gold : "transparent",
        }}
      >
        {done ? <Ionicons name="checkmark" size={18} color={COLORS.bg} /> : null}
      </View>

      <View className="flex-1">
        <Text
          className={`text-base font-semibold text-text ${
            done ? "line-through" : ""
          }`}
        >
          {template.title}
        </Text>
        {template.description ? (
          <Text className="mt-0.5 text-xs text-text-muted" numberOfLines={1}>
            {template.description}
          </Text>
        ) : null}
      </View>

      <View className="ml-3 items-end">
        <View
          className="rounded-full px-2 py-0.5"
          style={{ backgroundColor: `${statColor}33` }}
        >
          <Text className="text-xs font-semibold" style={{ color: statColor }}>
            +{template.xp_reward} {STAT_LABELS_KO[template.target_stat]}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
