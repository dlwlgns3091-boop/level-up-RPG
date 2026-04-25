import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { COLORS } from "@/constants/theme";
import { PIXEL_BORDER_WIDTH, PIXEL_FONT, PIXEL_RADIUS } from "./pixelStyles";

type Props = {
  current: number;
  need: number;
  /** 0..1 */
  ratio: number;
  /** 색 변경 가능 (HP/MP/XP 등) */
  color?: string;
};

const BAR_HEIGHT = 18;

export function XpBar({ current, need, ratio, color = COLORS.xp }: Props) {
  const percent = useSharedValue(Math.min(100, Math.max(0, ratio * 100)));

  useEffect(() => {
    percent.value = withTiming(Math.min(100, Math.max(0, ratio * 100)), {
      duration: 600,
    });
  }, [ratio, percent]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${percent.value}%`,
  }));

  return (
    <View style={{ width: "100%" }}>
      <View
        style={{
          height: BAR_HEIGHT,
          width: "100%",
          overflow: "hidden",
          borderRadius: PIXEL_RADIUS.pill,
          borderWidth: PIXEL_BORDER_WIDTH,
          borderColor: COLORS.ink,
          backgroundColor: COLORS.bgSofter,
        }}
      >
        <Animated.View
          style={[
            {
              height: "100%",
              backgroundColor: color,
              borderRadius: PIXEL_RADIUS.pill,
            },
            animatedStyle,
          ]}
        >
          {/* inset 하이라이트 */}
          <View
            style={{
              height: 3,
              marginTop: 2,
              marginHorizontal: 4,
              borderRadius: PIXEL_RADIUS.pill,
              backgroundColor: "rgba(255,255,255,0.4)",
            }}
          />
        </Animated.View>
      </View>
      <Text
        style={{
          marginTop: 4,
          fontSize: 11,
          color: COLORS.textMuted,
          fontFamily: PIXEL_FONT.ui,
        }}
      >
        {current} / {need} XP
      </Text>
    </View>
  );
}
