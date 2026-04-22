import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { STAT_LABELS_KO } from "@/constants/classes";
import { COLORS } from "@/constants/theme";
import type { QuestTemplate } from "@/db/types";

type Props = {
  template: QuestTemplate;
  weekCount: number;
  onPress: () => void;
};

export function WeeklyQuestRow({ template, weekCount, onPress }: Props) {
  const statColor = COLORS.stat[template.target_stat];

  return (
    <Pressable
      onPress={onPress}
      className="mb-3 flex-row items-center rounded-2xl border border-bg-softer bg-bg-soft p-4 active:opacity-80"
    >
      <View
        className="mr-3 h-10 w-10 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${statColor}33` }}
      >
        <Ionicons name="flame" size={20} color={statColor} />
      </View>

      <View className="flex-1">
        <Text className="text-base font-semibold text-text">
          {template.title}
        </Text>
        {template.description ? (
          <Text className="mt-0.5 text-xs text-text-muted" numberOfLines={1}>
            {template.description}
          </Text>
        ) : null}
        <Text className="mt-1 text-xs text-text-muted">
          이번 주 {weekCount}회 완료
        </Text>
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
        <View className="mt-1 flex-row items-center">
          <Ionicons name="add-circle" size={14} color={COLORS.gold} />
          <Text className="ml-1 text-xs font-semibold text-gold">+1회 기록</Text>
        </View>
      </View>
    </Pressable>
  );
}
