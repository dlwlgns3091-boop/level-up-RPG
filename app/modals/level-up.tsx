import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { PrimaryButton } from "@/components/PrimaryButton";
import {
  PIXEL_BORDER_WIDTH,
  PIXEL_FONT,
  PIXEL_RADIUS,
  pixelCard,
} from "@/components/pixelStyles";
import { ClassSprite, StarIcon, TrophyIcon } from "@/components/sprites";
import type { ClassId } from "@/constants/classes";
import { COLORS } from "@/constants/theme";
import { useCharacterStore } from "@/store/useCharacterStore";

export default function LevelUp() {
  const router = useRouter();
  const params = useLocalSearchParams<{ level?: string; points?: string }>();
  const level = Number(params.level ?? "1");
  const levelsGained = Number(params.points ?? "1");

  const character = useCharacterStore((s) => s.character);
  const classId: ClassId = character?.current_class_id ?? "apprentice";

  const scale = useSharedValue(0.6);
  const opacity = useSharedValue(0);
  const bounce = useSharedValue(0);
  const sparkleA = useSharedValue(0);
  const sparkleB = useSharedValue(0);
  const sparkleC = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 200 });
    scale.value = withSequence(
      withSpring(1.06, { damping: 9 }),
      withSpring(1, { damping: 11 }),
    );
    // 캐릭터 bounce: 0 → -10 → 0 반복 3회
    bounce.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 220, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 220, easing: Easing.in(Easing.quad) }),
      ),
      3,
      false,
    );
    // 파티클 fade-in 시차
    sparkleA.value = withTiming(1, { duration: 300 });
    sparkleB.value = withTiming(1, { duration: 400 });
    sparkleC.value = withTiming(1, { duration: 600 });
  }, [opacity, scale, bounce, sparkleA, sparkleB, sparkleC]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));
  const charStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounce.value }],
  }));
  const sparkleAStyle = useAnimatedStyle(() => ({ opacity: sparkleA.value }));
  const sparkleBStyle = useAnimatedStyle(() => ({ opacity: sparkleB.value }));
  const sparkleCStyle = useAnimatedStyle(() => ({ opacity: sparkleC.value }));

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
        style={[
          containerStyle,
          {
            width: "100%",
            maxWidth: 420,
            padding: 24,
            backgroundColor: COLORS.bgSoft,
            ...pixelCard(PIXEL_RADIUS.xl, 6),
          },
        ]}
      >
        <View style={{ alignItems: "center" }}>
          {/* 캐릭터 + 파티클 */}
          <View
            style={{
              width: 180,
              height: 180,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Animated.View style={[{ position: "absolute", top: 12, left: 16 }, sparkleAStyle]}>
              <StarIcon size={20} />
            </Animated.View>
            <Animated.View style={[{ position: "absolute", top: 30, right: 18 }, sparkleBStyle]}>
              <StarIcon size={14} />
            </Animated.View>
            <Animated.View style={[{ position: "absolute", bottom: 18, left: 28 }, sparkleCStyle]}>
              <StarIcon size={16} />
            </Animated.View>

            <View
              style={{
                width: 144,
                height: 144,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: PIXEL_RADIUS.lg,
                borderWidth: PIXEL_BORDER_WIDTH,
                borderColor: COLORS.ink,
                backgroundColor: `${COLORS.gold}22`,
              }}
            >
              <Animated.View style={charStyle}>
                <ClassSprite classId={classId} size={120} />
              </Animated.View>
            </View>

            <View
              style={{
                position: "absolute",
                bottom: -6,
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: PIXEL_RADIUS.pill,
                borderWidth: PIXEL_BORDER_WIDTH,
                borderColor: COLORS.ink,
                backgroundColor: COLORS.gold,
              }}
            >
              <TrophyIcon size={12} />
              <Text
                style={{
                  marginLeft: 4,
                  fontFamily: PIXEL_FONT.uiBold,
                  fontSize: 11,
                  color: COLORS.ink,
                }}
              >
                Lv.{level}
              </Text>
            </View>
          </View>

          <Text
            style={{
              marginTop: 24,
              fontFamily: PIXEL_FONT.display,
              fontSize: 36,
              color: COLORS.gold,
              letterSpacing: 1,
            }}
          >
            LEVEL UP!
          </Text>
          <Text
            style={{
              marginTop: 6,
              fontFamily: PIXEL_FONT.uiBold,
              fontSize: 14,
              color: COLORS.text,
            }}
          >
            Lv.{level} 달성
          </Text>
          {levelsGained > 1 ? (
            <Text
              style={{
                marginTop: 4,
                fontFamily: PIXEL_FONT.ui,
                fontSize: 12,
                color: COLORS.textMuted,
              }}
            >
              한 번에 {levelsGained}레벨 상승
            </Text>
          ) : null}
        </View>

        <View style={{ marginTop: 24 }}>
          <PrimaryButton label="확인" onPress={handleClose} />
        </View>
      </Animated.View>
    </Pressable>
  );
}
