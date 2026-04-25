import { Pressable, Text, View } from "react-native";
import { CategoryIcon, CheckIcon } from "@/components/sprites";
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
  done: boolean;
  disabled?: boolean;
  onPress: () => void;
};

const ICON_BOX = 44;

export function QuestRow({ template, done, disabled = false, onPress }: Props) {
  const color = COLORS.category[template.category];

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        padding: 14,
        borderRadius: PIXEL_RADIUS.lg,
        borderWidth: PIXEL_BORDER_WIDTH,
        borderColor: COLORS.ink,
        backgroundColor: COLORS.bgSoft,
        opacity: done ? 0.65 : 1,
        ...steppedShadow(3),
      }}
    >
      {/* 카테고리 아이콘 박스 */}
      <View
        style={{
          width: ICON_BOX,
          height: ICON_BOX,
          marginRight: 12,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: PIXEL_RADIUS.md,
          borderWidth: PIXEL_BORDER_WIDTH,
          borderColor: COLORS.ink,
          backgroundColor: `${color}33`,
        }}
      >
        <CategoryIcon category={template.category} size={24} />
      </View>

      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: PIXEL_FONT.uiBold,
            fontSize: 14,
            color: COLORS.text,
            textDecorationLine: done ? "line-through" : "none",
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
      </View>

      {/* 완료 체크 또는 XP chip */}
      <View style={{ marginLeft: 12, alignItems: "flex-end" }}>
        {done ? (
          <View
            style={{
              width: 28,
              height: 28,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: PIXEL_RADIUS.md,
              borderWidth: PIXEL_BORDER_WIDTH,
              borderColor: COLORS.ink,
              backgroundColor: COLORS.gold,
            }}
          >
            <CheckIcon size={16} />
          </View>
        ) : (
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
        )}
      </View>
    </Pressable>
  );
}
