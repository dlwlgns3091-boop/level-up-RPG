import { Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DiamondChart } from "@/components/DiamondChart";
import { CATEGORIES, CATEGORY_LABELS_KO } from "@/constants/categories";
import { getClass } from "@/constants/classes";
import { STRINGS } from "@/constants/strings.ko";
import { useCharacterStore } from "@/store/useCharacterStore";
import { pickCategoryXp } from "@/types/category";

export default function Stats() {
  const character = useCharacterStore((s) => s.character);

  if (!character) {
    return (
      <SafeAreaView className="flex-1 bg-bg">
        <View className="flex-1 items-center justify-center">
          <Text className="text-text-muted">캐릭터를 불러오는 중…</Text>
        </View>
      </SafeAreaView>
    );
  }

  const xp = pickCategoryXp(character);
  const total = xp.exercise + xp.study + xp.creative + xp.productivity;
  const def = getClass(character.current_class_id);

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top", "left", "right"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      >
        <Text className="mb-2 text-2xl font-bold text-gold">
          {STRINGS.stats.title}
        </Text>

        <View className="mb-4 rounded-2xl border border-bg-softer bg-bg-soft p-4">
          <Text className="text-xs text-text-muted">현재 직업</Text>
          <Text className="mt-1 text-lg font-bold text-gold">{def.nameKo}</Text>
          <Text className="mt-0.5 text-xs text-text-muted">{def.flavor}</Text>
        </View>

        <View className="mb-4 rounded-2xl border border-bg-softer bg-bg-soft p-3">
          <DiamondChart stats={xp} />
        </View>

        <View className="mb-3 flex-row items-center justify-between rounded-2xl border border-bg-softer bg-bg-soft p-3">
          <Text className="text-sm text-text-muted">
            {STRINGS.stats.totalXpLabel}
          </Text>
          <Text className="text-sm font-semibold text-gold">{total} XP</Text>
        </View>

        {CATEGORIES.map((c) => {
          const value = xp[c.key];
          const ratio = total > 0 ? value / total : 0;
          return (
            <View
              key={c.key}
              className="mb-2 rounded-2xl border border-bg-softer bg-bg-soft p-3"
            >
              <View className="flex-row items-center">
                <View
                  className="mr-3 h-9 w-9 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${c.color}33` }}
                >
                  <Text className="text-base">{c.emoji}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-sm text-text-muted">
                    {CATEGORY_LABELS_KO[c.key]}
                  </Text>
                  <Text className="text-base font-bold text-text">
                    {value} XP
                    <Text className="text-xs font-normal text-text-muted">
                      {"  "}({(ratio * 100).toFixed(0)}%)
                    </Text>
                  </Text>
                </View>
              </View>
              <View className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-bg-softer">
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

        <View className="mt-3 rounded-2xl border border-bg-softer bg-bg-soft p-3">
          <Text className="text-[11px] leading-4 text-text-muted">
            매 레벨업마다 활동 비율을 기준으로 직업이 자동 재평가됩니다. 카테고리 색상이 곧 그 카테고리의 정체성입니다.
          </Text>
          <Text className="mt-1 text-[11px] text-text-muted">
            팁: 한 카테고리에 60%+ 집중하면 순수형, 4개를 비등하게 키우면 퍼펙트 휴먼.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
