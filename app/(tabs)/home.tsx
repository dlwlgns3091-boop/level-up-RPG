import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CharacterCard } from "@/components/CharacterCard";
import { DiamondChart } from "@/components/DiamondChart";
import { QuestRow } from "@/components/QuestRow";
import { StreakBadge } from "@/components/StreakBadge";
import { STRINGS } from "@/constants/strings.ko";
import { successFeedback, tapFeedback } from "@/lib/haptic";
import { useCharacterStore } from "@/store/useCharacterStore";
import { pickCategoryXp } from "@/types/category";

export default function Home() {
  const router = useRouter();
  const character = useCharacterStore((s) => s.character);
  const streak = useCharacterStore((s) => s.streak);
  const todayQuests = useCharacterStore((s) => s.todayQuests);
  const completeQuest = useCharacterStore((s) => s.completeQuest);
  const refreshForNewDay = useCharacterStore((s) => s.refreshForNewDay);

  useFocusEffect(
    useCallback(() => {
      refreshForNewDay();
    }, [refreshForNewDay]),
  );

  const onToggleQuest = useCallback(
    (templateId: number, alreadyDone: boolean) => {
      if (alreadyDone) return;
      const result = completeQuest(templateId);
      if (!result) return;
      if (__DEV__) {
        console.log("[home] quest completed", {
          templateId,
          levelsGained: result.levelsGained,
          classChanged: result.classChange?.next ?? null,
        });
      }

      // 모달 chaining: 직업 변경이 있다면 그것을 먼저 push, 그 위에 레벨업 push
      // -> 사용자가 레벨업 dismiss 후 직업 변경 모달을 보게 됨.
      if (result.classChange) {
        router.push({
          pathname: "/modals/class-change",
          params: {
            previous: result.classChange.previous,
            next: result.classChange.next,
            isAwakening: result.classChange.isAwakening ? "1" : "0",
            level: String(result.classChange.level),
          },
        });
      }
      if (result.levelsGained > 0) {
        successFeedback().catch(() => undefined);
        router.push({
          pathname: "/modals/level-up",
          params: {
            level: String(result.newLevel),
            points: String(result.levelsGained),
          },
        });
      } else {
        tapFeedback().catch(() => undefined);
      }
    },
    [completeQuest, router],
  );

  if (!character) {
    return (
      <SafeAreaView className="flex-1 bg-bg">
        <View className="flex-1 items-center justify-center">
          <Text className="text-text-muted">캐릭터를 불러오는 중…</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top", "left", "right"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      >
        <CharacterCard character={character} />

        <View className="mt-4 rounded-2xl border border-bg-softer bg-bg-soft p-3">
          <DiamondChart stats={pickCategoryXp(character)} size={220} />
        </View>

        <View className="mt-6">
          <Text className="mb-3 text-lg font-bold text-text">
            {STRINGS.home.todaysQuests}
          </Text>
          {todayQuests.length === 0 ? (
            <View className="rounded-2xl border border-bg-softer bg-bg-soft p-6">
              <Text className="text-center text-text-muted">
                {STRINGS.home.noQuests}
              </Text>
            </View>
          ) : (
            todayQuests.map(({ template, completedCount }) => {
              const done = completedCount > 0;
              return (
                <QuestRow
                  key={template.id}
                  template={template}
                  done={done}
                  onPress={() => onToggleQuest(template.id, done)}
                />
              );
            })
          )}
        </View>

        {streak ? (
          <View className="mt-4">
            <StreakBadge streak={streak} />
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
