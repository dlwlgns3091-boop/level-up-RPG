import { Text, View } from "react-native";
import { COLORS } from "@/constants/theme";
import { calculateStreakBonus } from "@/db/streak";
import type { Streak } from "@/db/types";

type Props = {
  streak: Streak;
};

export function StreakBadge({ streak }: Props) {
  const days = streak.current_streak;
  const longest = streak.longest_streak;

  if (days <= 0) {
    return (
      <View className="rounded-2xl border border-bg-softer bg-bg-soft p-3">
        <Text className="text-center text-xs text-text-muted">
          첫 퀘스트를 완료하면 연속 달성이 시작됩니다 🔥
        </Text>
        {longest > 0 ? (
          <Text className="mt-1 text-center text-[11px] text-text-muted">
            최고 기록: {longest}일
          </Text>
        ) : null}
      </View>
    );
  }

  const mult = calculateStreakBonus(streak);
  return (
    <View
      className="rounded-2xl border bg-bg-soft p-3"
      style={{ borderColor: `${COLORS.gold}66` }}
    >
      <Text className="text-center text-sm text-gold">
        🔥 연속 {days}일 달성 중 ({mult.toFixed(2)}x XP)
      </Text>
      {longest > days ? (
        <Text className="mt-1 text-center text-[11px] text-text-muted">
          최고 기록 {longest}일
        </Text>
      ) : null}
    </View>
  );
}
