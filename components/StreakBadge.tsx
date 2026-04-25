import { Text, View } from "react-native";
import { FlagIcon, StarIcon } from "@/components/sprites";
import { COLORS } from "@/constants/theme";
import { calculateStreakBonus } from "@/db/streak";
import type { Streak } from "@/db/types";
import {
  PIXEL_BORDER_WIDTH,
  PIXEL_FONT,
  PIXEL_RADIUS,
  steppedShadow,
} from "./pixelStyles";

type Props = {
  streak: Streak;
};

export function StreakBadge({ streak }: Props) {
  const days = streak.current_streak;
  const longest = streak.longest_streak;

  if (days <= 0) {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 12,
          borderRadius: PIXEL_RADIUS.lg,
          borderWidth: PIXEL_BORDER_WIDTH,
          borderColor: COLORS.ink,
          backgroundColor: COLORS.bgSoft,
          ...steppedShadow(3),
        }}
      >
        <View style={{ marginRight: 10 }}>
          <StarIcon size={20} />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: PIXEL_FONT.ui,
              fontSize: 12,
              color: COLORS.textMuted,
            }}
          >
            첫 퀘스트를 완료하면 연속 달성이 시작됩니다
          </Text>
          {longest > 0 ? (
            <Text
              style={{
                marginTop: 2,
                fontFamily: PIXEL_FONT.ui,
                fontSize: 11,
                color: COLORS.textSubtle,
              }}
            >
              최고 기록: {longest}일
            </Text>
          ) : null}
        </View>
      </View>
    );
  }

  const mult = calculateStreakBonus(streak);
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderRadius: PIXEL_RADIUS.lg,
        borderWidth: PIXEL_BORDER_WIDTH,
        borderColor: COLORS.ink,
        backgroundColor: COLORS.bgSoft,
        ...steppedShadow(3),
      }}
    >
      <View
        style={{
          marginRight: 12,
          width: 36,
          height: 36,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: PIXEL_RADIUS.md,
          borderWidth: PIXEL_BORDER_WIDTH,
          borderColor: COLORS.ink,
          backgroundColor: `${COLORS.gold}33`,
        }}
      >
        <FlagIcon size={20} />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: PIXEL_FONT.display,
            fontSize: 20,
            color: COLORS.gold,
            lineHeight: 22,
          }}
        >
          {days}
          <Text
            style={{
              fontFamily: PIXEL_FONT.uiBold,
              fontSize: 12,
              color: COLORS.gold,
            }}
          >
            {" 일 연속  "}
          </Text>
          <Text
            style={{
              fontFamily: PIXEL_FONT.ui,
              fontSize: 11,
              color: COLORS.textMuted,
            }}
          >
            ({mult.toFixed(2)}x XP)
          </Text>
        </Text>
        {longest > days ? (
          <Text
            style={{
              marginTop: 2,
              fontFamily: PIXEL_FONT.ui,
              fontSize: 11,
              color: COLORS.textSubtle,
            }}
          >
            최고 기록 {longest}일
          </Text>
        ) : null}
      </View>
    </View>
  );
}
