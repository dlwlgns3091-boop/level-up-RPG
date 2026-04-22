import { useRouter } from "expo-router";
import { useCallback } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CharacterCard } from "@/components/CharacterCard";
import { QuestRow } from "@/components/QuestRow";
import { StreakBadge } from "@/components/StreakBadge";
import { STRINGS } from "@/constants/strings.ko";
import { useCharacterStore } from "@/store/useCharacterStore";

export default function Home() {
  const router = useRouter();
  const character = useCharacterStore((s) => s.character);
  const streak = useCharacterStore((s) => s.streak);
  const todayQuests = useCharacterStore((s) => s.todayQuests);
  const completeQuest = useCharacterStore((s) => s.completeQuest);

  const onToggleQuest = useCallback(
    (templateId: number, alreadyDone: boolean) => {
      if (alreadyDone) return;
      const result = completeQuest(templateId);
      if (result && result.levelsGained > 0) {
        router.push({
          pathname: "/modals/level-up",
          params: {
            level: String(result.newLevel),
            points: String(result.levelsGained * 3),
          },
        });
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
