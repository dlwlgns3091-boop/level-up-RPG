import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { PrimaryButton } from "@/components/PrimaryButton";
import { COLORS } from "@/constants/theme";

export default function LevelUp() {
  const router = useRouter();
  const params = useLocalSearchParams<{ level?: string; points?: string }>();
  const level = Number(params.level ?? "1");
  const levelsGained = Number(params.points ?? "1");

  const scale = useSharedValue(0.6);
  const opacity = useSharedValue(0);
  const glow = useSharedValue(0.8);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 200 });
    scale.value = withSequence(
      withSpring(1.08, { damping: 9 }),
      withSpring(1, { damping: 11 }),
    );
    glow.value = withTiming(1.2, { duration: 700 });
  }, [opacity, scale, glow]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));
  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glow.value }],
    opacity: 0.25,
  }));

  const handleClose = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)/home");
  };

  return (
    <Pressable
      onPress={handleClose}
      className="flex-1 items-center justify-center bg-black/70 px-6"
    >
      <Animated.View
        style={containerStyle}
        className="w-full max-w-md rounded-3xl border border-bg-softer bg-bg-soft p-8"
      >
        <View className="items-center">
          <View className="relative items-center justify-center">
            <Animated.View
              style={[
                glowStyle,
                {
                  position: "absolute",
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  backgroundColor: COLORS.gold,
                },
              ]}
            />
            <View
              className="h-20 w-20 items-center justify-center rounded-full"
              style={{ backgroundColor: `${COLORS.gold}33` }}
            >
              <Ionicons name="trophy" size={40} color={COLORS.gold} />
            </View>
          </View>

          <Text className="mt-6 text-3xl font-bold text-gold">레벨 업!</Text>
          <Text className="mt-2 text-lg font-semibold text-text">
            Lv.{level} 달성
          </Text>
          {levelsGained > 1 ? (
            <Text className="mt-1 text-sm text-text-muted">
              한 번에 {levelsGained}레벨 상승
            </Text>
          ) : null}
        </View>

        <View className="mt-8">
          <PrimaryButton label="확인" onPress={handleClose} />
        </View>
      </Animated.View>
    </Pressable>
  );
}
