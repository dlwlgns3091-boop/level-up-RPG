import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { successFeedback, tapFeedback } from "@/lib/haptic";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PIXEL_FONT } from "@/components/pixelStyles";
import { QuestRow } from "@/components/QuestRow";
import { SegmentedTabs } from "@/components/SegmentedTabs";
import { WeeklyQuestRow } from "@/components/WeeklyQuestRow";
import { STRINGS } from "@/constants/strings.ko";
import { COLORS } from "@/constants/theme";
import {
  countLogsForTemplateBetween,
  getKstDayBounds,
  getKstWeekBounds,
  listActiveTemplates,
} from "@/db/quest";
import type { QuestTemplate } from "@/db/types";
import { useCharacterStore } from "@/store/useCharacterStore";

type TabKey = "daily" | "weekly" | "custom";

const TABS = [
  { key: "daily", label: STRINGS.quests.daily },
  { key: "weekly", label: STRINGS.quests.weekly },
  { key: "custom", label: STRINGS.quests.custom },
] as const;

type DailyRow = { template: QuestTemplate; done: boolean };
type WeeklyRow = { template: QuestTemplate; weekCount: number };
type CustomRow = { template: QuestTemplate; doneToday: boolean };

export default function Quests() {
  const router = useRouter();
  const [active, setActive] = useState<TabKey>("daily");

  const todayQuests = useCharacterStore((s) => s.todayQuests);
  const completeQuest = useCharacterStore((s) => s.completeQuest);

  const [weekly, setWeekly] = useState<WeeklyRow[]>([]);
  const [custom, setCustom] = useState<CustomRow[]>([]);

  const loadWeekly = useCallback(() => {
    const { start, end } = getKstWeekBounds();
    const rows = listActiveTemplates({ questType: "weekly" }).map(
      (template) => ({
        template,
        weekCount: countLogsForTemplateBetween(template.id, start, end),
      }),
    );
    setWeekly(rows);
  }, []);

  const loadCustom = useCallback(() => {
    const day = getKstDayBounds();
    const rows = listActiveTemplates({ isCustom: true }).map((template) => ({
      template,
      doneToday: countLogsForTemplateBetween(template.id, day.start, day.end) > 0,
    }));
    setCustom(rows);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadWeekly();
      loadCustom();
    }, [loadWeekly, loadCustom]),
  );

  const onCompleteAndMaybeLevelUp = useCallback(
    (templateId: number) => {
      const result = completeQuest(templateId);
      if (!result) return;
      if (__DEV__) {
        console.log("[quests] quest completed", {
          templateId,
          levelsGained: result.levelsGained,
          classChanged: result.classChange?.next ?? null,
        });
      }
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
      // 완료 후 해당 탭 리스트 재조회 (완료 수 카운트 반영)
      loadWeekly();
      loadCustom();
    },
    [completeQuest, router, loadWeekly, loadCustom],
  );

  const dailyRows: DailyRow[] = todayQuests.map(
    ({ template, completedCount }) => ({
      template,
      done: completedCount > 0,
    }),
  );

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top", "left", "right"]}>
      <View className="px-5 pt-4">
        <Text
          style={{
            marginBottom: 12,
            fontFamily: PIXEL_FONT.display,
            fontSize: 26,
            color: COLORS.gold,
            letterSpacing: 1,
          }}
        >
          {STRINGS.tabs.quests}
        </Text>
        <SegmentedTabs options={TABS} value={active} onChange={setActive} />
      </View>

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingVertical: 16, paddingBottom: 40 }}
      >
        {active === "daily" ? (
          dailyRows.length === 0 ? (
            <EmptyState text={STRINGS.home.noQuests} />
          ) : (
            dailyRows.map(({ template, done }) => (
              <QuestRow
                key={template.id}
                template={template}
                done={done}
                onPress={() => {
                  if (done) return;
                  onCompleteAndMaybeLevelUp(template.id);
                }}
              />
            ))
          )
        ) : null}

        {active === "weekly" ? (
          weekly.length === 0 ? (
            <EmptyState text="이번 주 도전 퀘스트가 없습니다." />
          ) : (
            weekly.map(({ template, weekCount }) => (
              <WeeklyQuestRow
                key={template.id}
                template={template}
                weekCount={weekCount}
                onPress={() => onCompleteAndMaybeLevelUp(template.id)}
              />
            ))
          )
        ) : null}

        {active === "custom" ? (
          <>
            <Pressable
              onPress={() => router.push("/modals/quest-create")}
              className="mb-3 flex-row items-center justify-center rounded-2xl border p-4"
              style={{ borderColor: `${COLORS.gold}66` }}
            >
              <Ionicons name="add-circle" size={20} color={COLORS.gold} />
              <Text className="ml-2 text-base font-semibold text-gold">
                {STRINGS.quests.addCustom}
              </Text>
            </Pressable>
            {custom.length === 0 ? (
              <EmptyState text="아직 커스텀 퀘스트가 없습니다. 위 버튼을 눌러 추가해보세요." />
            ) : (
              custom.map(({ template, doneToday }) => (
                <QuestRow
                  key={template.id}
                  template={template}
                  done={doneToday}
                  onPress={() => {
                    if (doneToday) return;
                    onCompleteAndMaybeLevelUp(template.id);
                  }}
                />
              ))
            )}
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <View className="rounded-2xl border border-bg-softer bg-bg-soft p-6">
      <Text className="text-center text-text-muted">{text}</Text>
    </View>
  );
}
