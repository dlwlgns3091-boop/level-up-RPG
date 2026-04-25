import { Pressable, Text, View } from "react-native";
import { FlagIcon, TrophyIcon } from "@/components/sprites";
import { CATEGORY_LABELS_KO } from "@/constants/categories";
import { COLORS } from "@/constants/theme";
import type { QuestTemplate } from "@/db/types";
import {
  PIXEL_BORDER_WIDTH,
  PIXEL_FONT,
  PIXEL_RADIUS,
  steppedShadow,
} from "./pixelStyles";

type Props = {
  template: QuestTemplate;
  weekCount: number;
  onPress: () => void;
};

export function WeeklyQuestRow({ template, weekCount, onPress }: Props) {
  const color = COLORS.category[template.category];

  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        padding: 14,
        borderRadius: PIXEL_RADIUS.lg,
        borderWidth: PIXEL_BORDER_WIDTH,
        borderColor: COLORS.ink,
        backgroundColor: COLORS.bgSoft,
        ...steppedShadow(3),
      }}
    >
      <View
        style={{
          width: 44,
          height: 44,
          marginRight: 12,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: PIXEL_RADIUS.md,
          borderWidth: PIXEL_BORDER_WIDTH,
          borderColor: COLORS.ink,
          backgroundColor: `${color}33`,
        }}
      >
        <TrophyIcon size={24} />
      </View>

      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: PIXEL_FONT.uiBold,
            fontSize: 14,
            color: COLORS.text,
          }}
        >
          {template.title}
        </Text>
        {template.description ? (
          <Text
            style={{
              marginTop: 2,
              fontFamily: PIXEL_FONT.ui,
              fontSize: 11,
              color: COLORS.textMuted,
            }}
            numberOfLines={1}
          >
            {template.description}
          </Text>
        ) : null}
        <Text
          style={{
            marginTop: 4,
            fontFamily: PIXEL_FONT.ui,
            fontSize: 11,
            color: COLORS.textMuted,
          }}
        >
          이번 주 {weekCount}회 완료
        </Text>
      </View>

      <View style={{ marginLeft: 12, alignItems: "flex-end" }}>
        <View
          style={{
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: PIXEL_RADIUS.pill,
            borderWidth: PIXEL_BORDER_WIDTH,
            borderColor: COLORS.ink,
            backgroundColor: `${color}33`,
          }}
        >
          <Text
            style={{
              fontFamily: PIXEL_FONT.uiBold,
              fontSize: 11,
              color,
            }}
          >
            +{template.xp_reward} {CATEGORY_LABELS_KO[template.category]}
          </Text>
        </View>
        <View
          style={{
            marginTop: 4,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <FlagIcon size={12} />
          <Text
            style={{
              marginLeft: 4,
              fontFamily: PIXEL_FONT.uiBold,
              fontSize: 10,
              color: COLORS.gold,
            }}
          >
            +1회 기록
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
