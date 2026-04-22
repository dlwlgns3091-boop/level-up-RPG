import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type Props = {
  current: number;
  need: number;
  /** 0..1 */
  ratio: number;
};

export function XpBar({ current, need, ratio }: Props) {
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
    <View className="w-full">
      <View className="h-3 w-full overflow-hidden rounded-full bg-bg-softer">
        <Animated.View className="h-full bg-gold" style={animatedStyle} />
      </View>
      <Text className="mt-1 text-xs text-text-muted">
        {current} / {need} XP
      </Text>
    </View>
  );
}
