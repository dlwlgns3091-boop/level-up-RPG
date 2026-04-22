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
import { CATEGORIES } from "@/constants/categories";
import { CLASS_BY_ID, type ClassId, getClass } from "@/constants/classes";
import { STRINGS } from "@/constants/strings.ko";
import { COLORS } from "@/constants/theme";
import { useCharacterStore } from "@/store/useCharacterStore";
import { pickCategoryXp } from "@/types/category";

export default function ClassChange() {
  const router = useRouter();
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

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 200 });
    scale.value = withSequence(
      withSpring(1.06, { damping: 9 }),
      withSpring(1, { damping: 11 }),
    );
  }, [opacity, scale]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
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
        style={containerStyle}
        className="w-full max-w-md rounded-3xl border border-bg-softer bg-bg-soft p-6"
      >
        <View className="items-center">
          <View
            className="h-16 w-16 items-center justify-center rounded-full"
            style={{ backgroundColor: `${COLORS.gold}33` }}
          >
            <Ionicons
              name={isAwakening ? "sparkles" : "swap-horizontal"}
              size={32}
              color={COLORS.gold}
            />
          </View>
          <Text className="mt-4 text-2xl font-bold text-gold">
            {isAwakening
              ? STRINGS.classChange.awakeningTitle
              : STRINGS.classChange.transitionTitle}
          </Text>
          <Text className="mt-2 text-center text-sm leading-5 text-text-muted">
            {isAwakening
              ? STRINGS.classChange.awakeningBody
              : STRINGS.classChange.transitionBody}
          </Text>
        </View>

        {xp ? (
          <View className="mt-5 rounded-2xl border border-bg-softer bg-bg p-3">
            {CATEGORIES.map((c) => {
              const value = xp[c.key];
              const ratio = total > 0 ? value / total : 0;
              return (
                <View key={c.key} className="mb-1.5 last:mb-0">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-xs text-text-muted">
                      {c.emoji} {c.nameKo}
                    </Text>
                    <Text className="text-xs text-text">{value} XP</Text>
                  </View>
                  <View className="mt-1 h-1 w-full overflow-hidden rounded-full bg-bg-softer">
                    <View
                      className="h-full"
                      style={{
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

        <View className="mt-5 items-center">
          {!isAwakening ? (
            <Text className="mb-1 text-xs text-text-muted">
              {previous.nameKo}에서
            </Text>
          ) : null}
          <Text className="text-2xl font-bold text-text">
            {next.nameKo}
          </Text>
          <Text className="mt-1 text-sm italic text-text-muted">
            "{next.flavor}"
          </Text>
        </View>

        <View className="mt-6">
          <PrimaryButton
            label={STRINGS.classChange.cta}
            onPress={close}
          />
        </View>
      </Animated.View>
    </Pressable>
  );
}
