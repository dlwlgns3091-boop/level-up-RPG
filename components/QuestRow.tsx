import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { CategoryIcon, CheckIcon } from "@/components/sprites";
import { CATEGORY_LABELS_KO } from "@/constants/categories";
import { useColors } from "@/constants/theme";
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
  onLongPress?: () => void;
};

const ICON_BOX = 44;
const CHECK_BOX = 28;

export function QuestRow({
  template,
  done,
  disabled = false,
  onPress,
  onLongPress,
}: Props) {
  const COLORS = useColors();
  const color = COLORS.category[template.category];

  const checkScale = useSharedValue(done ? 1 : 0);
  const checkOpacity = useSharedValue(done ? 1 : 0);

  useEffect(() => {
    if (done) {
      checkOpacity.value = withDelay(80, withTiming(1, { duration: 180 }));
      checkScale.value = withDelay(
        80,
        withSequence(
          withSpring(1.18, { damping: 8 }),
          withSpring(1, { damping: 11 }),
        ),
      );
    } else {
      checkOpacity.value = withTiming(0, { duration: 100 });
      checkScale.value = withTiming(0, { duration: 100 });
    }
  }, [done, checkOpacity, checkScale]);

  const checkStyle = useAnimatedStyle(() => ({
    opacity: checkOpacity.value,
    transform: [{ scale: checkScale.value }],
  }));

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      onLongPress={onLongPress}
      delayLongPress={400}
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
        ...steppedShadow(COLORS.ink, 3),
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

      {/* 우측 영역: done이면 체크 타일이 entrance 애니메이션, 아니면 XP chip */}
      <View
        style={{
          marginLeft: 12,
          alignItems: "flex-end",
          justifyContent: "center",
          minWidth: CHECK_BOX,
          minHeight: CHECK_BOX,
        }}
      >
        {done ? (
          <Animated.View
            style={[
              {
                width: CHECK_BOX,
                height: CHECK_BOX,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: PIXEL_RADIUS.md,
                borderWidth: PIXEL_BORDER_WIDTH,
                borderColor: COLORS.ink,
                backgroundColor: COLORS.gold,
              },
              checkStyle,
            ]}
          >
            <CheckIcon size={16} />
          </Animated.View>
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
