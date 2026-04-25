import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import { Spinner } from "@/components/Spinner";
import { COLORS, useColors } from "@/constants/theme";
import { useOnlineStatus } from "@/lib/network";
import { useCoupleStore } from "@/store/useCoupleStore";
import { useEventStore } from "@/store/useEventStore";

const CALENDAR_THEME = {
  backgroundColor: COLORS.bg,
  calendarBackground: COLORS.bgSoft,
  textSectionTitleColor: COLORS.textMuted,
  dayTextColor: COLORS.text,
  todayTextColor: COLORS.gold,
  selectedDayTextColor: COLORS.bg,
  selectedDayBackgroundColor: COLORS.gold,
  monthTextColor: COLORS.text,
  arrowColor: COLORS.gold,
  textDisabledColor: COLORS.bgSofter,
  dotColor: COLORS.gold,
  selectedDotColor: COLORS.bg,
  textDayFontWeight: "500" as const,
  textMonthFontWeight: "700" as const,
};

export default function CalendarScreen() {
  const router = useRouter();
  const couple = useCoupleStore((s) => s.couple);

  const events = useEventStore((s) => s.events);
  const isLoading = useEventStore((s) => s.isLoading);
  const load = useEventStore((s) => s.load);

  const { isOnline } = useOnlineStatus();
  const [selected, setSelected] = useState<string | null>(todayKst());
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    if (!couple?.id) return;
    setRefreshing(true);
    try {
      await load(couple.id);
    } finally {
      setRefreshing(false);
    }
  }, [couple?.id, load]);

  useFocusEffect(
    useCallback(() => {
      if (couple?.id) load(couple.id);
    }, [couple?.id, load]),
  );

  const markedDates = useMemo(() => {
    const marks: Record<
      string,
      { marked?: boolean; selected?: boolean; dotColor?: string }
    > = {};
    for (const e of events) {
      marks[e.event_date] = { ...marks[e.event_date], marked: true, dotColor: COLORS.gold };
    }
    if (selected) {
      marks[selected] = {
        ...(marks[selected] ?? {}),
        selected: true,
      };
    }
    return marks;
  }, [events, selected]);

  const eventsForSelected = useMemo(() => {
    if (!selected) return [];
    return events.filter((e) => e.event_date === selected);
  }, [events, selected]);

  if (!couple || !couple.user_b) {
    return (
      <SafeAreaView className="flex-1 bg-bg" edges={["top", "left", "right"]}>
        <Header title="캘린더" onBack={() => router.back()} />
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="heart-outline" size={40} color={COLORS.textMuted} />
          <Text className="mt-3 text-center text-sm text-text-muted">
            커플 연결 후 사용할 수 있습니다.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top", "left", "right"]}>
      <Header
        title="캘린더"
        onBack={() => router.back()}
        right={
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/events/new",
                params: selected ? { date: selected } : {},
              })
            }
            disabled={!isOnline}
            className="p-1"
          >
            <Ionicons
              name="add-circle"
              size={28}
              color={isOnline ? COLORS.gold : COLORS.textMuted}
            />
          </Pressable>
        }
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.gold}
            colors={[COLORS.gold]}
          />
        }
      >
        <View className="m-5 overflow-hidden rounded-2xl border border-bg-softer">
          <Calendar
            markedDates={markedDates}
            onDayPress={(day) => setSelected(day.dateString)}
            theme={CALENDAR_THEME}
            monthFormat={"yyyy년 M월"}
            enableSwipeMonths
            firstDay={0}
          />
        </View>

        <View className="px-5">
          <Text className="mb-3 text-sm font-semibold text-text-muted">
            {selected
              ? `${formatDate(selected)} 기록`
              : "날짜를 선택하세요"}
          </Text>

          {isLoading && events.length === 0 ? (
            <View className="py-6">
              <Spinner label="불러오는 중…" />
            </View>
          ) : eventsForSelected.length === 0 ? (
            <View className="items-center rounded-2xl border border-bg-softer bg-bg-soft p-6">
              <Text className="text-sm text-text-muted">이 날엔 기록이 없습니다.</Text>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/events/new",
                    params: selected ? { date: selected } : {},
                  })
                }
                className="mt-3 rounded-2xl bg-gold px-4 py-2 active:opacity-80"
              >
                <Text className="text-sm font-bold text-bg">기록 추가</Text>
              </Pressable>
            </View>
          ) : (
            eventsForSelected.map((e) => (
              <Pressable
                key={e.id}
                onPress={() =>
                  router.push({
                    pathname: "/events/[id]",
                    params: { id: e.id },
                  })
                }
                className="mb-2 rounded-2xl border border-bg-softer bg-bg-soft p-4 active:opacity-80"
              >
                <Text className="text-base font-semibold text-text">
                  {e.title}
                </Text>
                {e.memo ? (
                  <Text
                    className="mt-1 text-sm text-text-muted"
                    numberOfLines={2}
                  >
                    {e.memo}
                  </Text>
                ) : null}
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Header({
  title,
  onBack,
  right,
}: {
  title: string;
  onBack: () => void;
  right?: React.ReactNode;
}) {
  return (
    <View className="flex-row items-center justify-between border-b border-bg-softer px-5 py-3">
      <Pressable onPress={onBack} className="p-1">
        <Ionicons name="chevron-back" size={24} color={COLORS.text} />
      </Pressable>
      <Text className="text-base font-bold text-text">{title}</Text>
      <View>{right ?? <View className="w-6" />}</View>
    </View>
  );
}

function todayKst(): string {
  const ms = 9 * 60 * 60 * 1000;
  const d = new Date(Date.now() + ms);
  const y = d.getUTCFullYear().toString().padStart(4, "0");
  const m = (d.getUTCMonth() + 1).toString().padStart(2, "0");
  const dd = d.getUTCDate().toString().padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

function formatDate(key: string): string {
  const p = key.split("-").map(Number);
  const y = p[0];
  const m = p[1];
  const d = p[2];
  if (!y || !m || !d) return key;
  return `${y}년 ${m}월 ${d}일`;
}
