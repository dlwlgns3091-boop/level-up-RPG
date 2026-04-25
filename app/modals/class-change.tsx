import { useLocalSearchParams, useRouter } from "expo-router";
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
import { PrimaryButton } from "@/components/PrimaryButton";
import {
  PIXEL_BORDER_WIDTH,
  PIXEL_FONT,
  PIXEL_RADIUS,
  pixelCard,
} from "@/components/pixelStyles";
import { CategoryIcon, ClassSprite, StarIcon } from "@/components/sprites";
import { CATEGORIES } from "@/constants/categories";
import { CLASS_BY_ID, type ClassId, getClass } from "@/constants/classes";
import { STRINGS } from "@/constants/strings.ko";
import { COLORS, useColors } from "@/constants/theme";
import { useCharacterStore } from "@/store/useCharacterStore";
import { pickCategoryXp } from "@/types/category";

export default function ClassChange() {
  const router = useRouter();
  const COLORS = useColors();
  const params = useLocalSearchParams<{
    previous?: string;
    next?: string;
    isAwakening?: string;
    level?: string;
  }>();

  const character = useCharacterStore((s) => s.character);
  const clearPending = useCharacterStore((s) => s.clearPendingClassChange);

  const previousId = (params.previous ?? "apprentice") as ClassId;
  const nextId = (params.next ?? "apprentice") as ClassId;
  const isAwakening = params.isAwakening === "1";

  const previous = CLASS_BY_ID[previousId] ?? getClass("apprentice");
  const next = CLASS_BY_ID[nextId] ?? getClass("apprentice");
  const xp = character ? pickCategoryXp(character) : null;
  const total = xp
    ? xp.exercise + xp.study + xp.creative + xp.productivity
    : 0;

  const scale = useSharedValue(0.6);
  const opacity = useSharedValue(0);
  // 이전 캐릭터 fade-out → 새 캐릭터 fade-in + scale up
  const prevOpacity = useSharedValue(isAwakening ? 0 : 1);
  const prevScale = useSharedValue(1);
  const nextOpacity = useSharedValue(0);
  const nextScale = useSharedValue(0.7);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 200 });
    scale.value = withSequence(
      withSpring(1.06, { damping: 9 }),
      withSpring(1, { damping: 11 }),
    );

    if (isAwakening) {
      // 각성: 새 캐릭터만 등장
      nextOpacity.value = withDelay(150, withTiming(1, { duration: 400 }));
      nextScale.value = withDelay(150, withSpring(1, { damping: 10 }));
    } else {
      // 전직: 이전 → 새로 cross-fade
      prevOpacity.value = withTiming(0, { duration: 350 });
      prevScale.value = withTiming(0.85, { duration: 350 });
      nextOpacity.value = withDelay(250, withTiming(1, { duration: 450 }));
      nextScale.value = withDelay(250, withSpring(1, { damping: 10 }));
    }
  }, [
    opacity,
    scale,
    prevOpacity,
    prevScale,
    nextOpacity,
    nextScale,
    isAwakening,
  ]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));
  const prevSpriteStyle = useAnimatedStyle(() => ({
    opacity: prevOpacity.value,
    transform: [{ scale: prevScale.value }],
  }));
  const nextSpriteStyle = useAnimatedStyle(() => ({
    opacity: nextOpacity.value,
    transform: [{ scale: nextScale.value }],
  }));

  const close = () => {
    clearPending();
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)/home");
  };

  return (
    <Pressable
      onPress={close}
      className="flex-1 items-center justify-center bg-black/75 px-6"
    >
      <Animated.View
        style={[
          containerStyle,
          {
            width: "100%",
            maxWidth: 420,
            padding: 22,
            backgroundColor: COLORS.bgSoft,
            ...pixelCard(COLORS.ink, PIXEL_RADIUS.xl, 6),
          },
        ]}
      >
        <View style={{ alignItems: "center" }}>
          {/* 캐릭터 트랜지션 영역 */}
          <View
            style={{
              width: 168,
              height: 168,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: PIXEL_RADIUS.lg,
              borderWidth: PIXEL_BORDER_WIDTH,
              borderColor: COLORS.ink,
              backgroundColor: `${COLORS.gold}22`,
            }}
          >
            <Animated.View style={[{ position: "absolute" }, sparkleStarStyle(0)]}>
              <StarIcon size={16} />
            </Animated.View>
            {!isAwakening ? (
              <Animated.View
                style={[{ position: "absolute" }, prevSpriteStyle]}
              >
                <ClassSprite classId={previousId} size={132} />
              </Animated.View>
            ) : null}
            <Animated.View style={[{ position: "absolute" }, nextSpriteStyle]}>
              <ClassSprite classId={nextId} size={132} />
            </Animated.View>
          </View>

          <Text
            style={{
              marginTop: 18,
              fontFamily: PIXEL_FONT.display,
              fontSize: 24,
              color: COLORS.gold,
              letterSpacing: 1,
            }}
          >
            {isAwakening
              ? STRINGS.classChange.awakeningTitle
              : STRINGS.classChange.transitionTitle}
          </Text>
          <Text
            style={{
              marginTop: 8,
              fontFamily: PIXEL_FONT.ui,
              fontSize: 12,
              lineHeight: 18,
              color: COLORS.textMuted,
              textAlign: "center",
            }}
          >
            {isAwakening
              ? STRINGS.classChange.awakeningBody
              : STRINGS.classChange.transitionBody}
          </Text>
        </View>

        {xp ? (
          <View
            style={{
              marginTop: 16,
              padding: 12,
              backgroundColor: COLORS.bg,
              borderRadius: PIXEL_RADIUS.md,
              borderWidth: PIXEL_BORDER_WIDTH,
              borderColor: COLORS.ink,
            }}
          >
            {CATEGORIES.map((c) => {
              const value = xp[c.key];
              const ratio = total > 0 ? value / total : 0;
              return (
                <View key={c.key} style={{ marginBottom: 6 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <CategoryIcon category={c.key} size={12} />
                      <Text
                        style={{
                          marginLeft: 6,
                          fontFamily: PIXEL_FONT.uiBold,
                          fontSize: 11,
                          color: COLORS.textMuted,
                        }}
                      >
                        {c.nameKo}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontFamily: PIXEL_FONT.uiBold,
                        fontSize: 11,
                        color: COLORS.text,
                      }}
                    >
                      {value} XP
                    </Text>
                  </View>
                  <View
                    style={{
                      marginTop: 4,
                      height: 4,
                      width: "100%",
                      overflow: "hidden",
                      borderRadius: PIXEL_RADIUS.pill,
                      backgroundColor: COLORS.bgSofter,
                    }}
                  >
                    <View
                      style={{
                        height: "100%",
                        width: `${Math.min(100, ratio * 100)}%`,
                        backgroundColor: c.color,
                      }}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        ) : null}

        <View style={{ marginTop: 18, alignItems: "center" }}>
          {!isAwakening ? (
            <Text
              style={{
                fontFamily: PIXEL_FONT.ui,
                fontSize: 11,
                color: COLORS.textSubtle,
                marginBottom: 4,
              }}
            >
              {previous.nameKo}에서
            </Text>
          ) : null}
          <Text
            style={{
              fontFamily: PIXEL_FONT.uiBold,
              fontSize: 22,
              color: COLORS.text,
            }}
          >
            {next.nameKo}
          </Text>
          <Text
            style={{
              marginTop: 4,
              fontFamily: PIXEL_FONT.ui,
              fontSize: 12,
              fontStyle: "italic",
              color: COLORS.textMuted,
            }}
          >
            "{next.flavor}"
          </Text>
        </View>

        <View style={{ marginTop: 20 }}>
          <PrimaryButton label={STRINGS.classChange.cta} onPress={close} />
        </View>
      </Animated.View>
    </Pressable>
  );
}

// 정적 sparkle 위치 — 별 한 개를 캐릭터 영역 우상단에 고정 노출
// (애니메이션 추가는 향후 폴리싱)
function sparkleStarStyle(_index: number) {
  return { top: 12, right: 16, opacity: 0.7 } as const;
}
