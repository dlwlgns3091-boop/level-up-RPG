import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants/theme";
import { useCoupleStore } from "@/store/useCoupleStore";
import { useEventStore } from "@/store/useEventStore";
import { usePhotoStore } from "@/store/usePhotoStore";

const THUMB_SIZE = 64;

export default function LogScreen() {
  const router = useRouter();
  const couple = useCoupleStore((s) => s.couple);

  const events = useEventStore((s) => s.events);
  const isLoading = useEventStore((s) => s.isLoading);
  const loadEvents = useEventStore((s) => s.load);

  const photos = usePhotoStore((s) => s.photos);
  const signedUrls = usePhotoStore((s) => s.signedUrls);
  const loadPhotos = usePhotoStore((s) => s.load);

  useFocusEffect(
    useCallback(() => {
      if (couple?.id) {
        loadEvents(couple.id);
        loadPhotos(couple.id);
      }
    }, [couple?.id, loadEvents, loadPhotos]),
  );

  // 사진이 이벤트에 묶여 있으면 그 섬네일을 이벤트 카드에 보여준다.
  const photosByEvent = useMemo(() => {
    const map = new Map<string, typeof photos>();
    for (const p of photos) {
      if (!p.event_id) continue;
      const list = map.get(p.event_id) ?? [];
      list.push(p);
      map.set(p.event_id, list);
    }
    return map;
  }, [photos]);

  const grouped = useMemo(() => groupByDate(events), [events]);

  // 방금 돌아왔을 때 signed URL 재조회 — 내부에서 load()가 이미 signUrls를 호출하므로 no-op이지만
  // 첫 렌더에 대비해 URL 없는 썸네일이 있으면 로드 시도.
  useEffect(() => {
    // nothing additional; usePhotoStore.load() already batch-signs.
  }, []);

  if (!couple || !couple.user_b) {
    return (
      <SafeAreaView className="flex-1 bg-bg" edges={["top", "left", "right"]}>
        <Header title="기록" onBack={() => router.back()} />
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
        title="기록"
        onBack={() => router.back()}
        right={
          <Pressable
            onPress={() => router.push("/events/new")}
            className="p-1"
          >
            <Ionicons name="add-circle" size={28} color={COLORS.gold} />
          </Pressable>
        }
      />

      {isLoading && events.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-text-muted">불러오는 중…</Text>
        </View>
      ) : events.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="journal" size={48} color={COLORS.textMuted} />
          <Text className="mt-4 text-center text-base text-text">
            아직 기록이 없습니다
          </Text>
          <Text className="mt-1 text-center text-sm text-text-muted">
            오늘 있었던 일을 남겨보세요.
          </Text>
          <Pressable
            onPress={() => router.push("/events/new")}
            className="mt-5 rounded-2xl bg-gold px-5 py-3 active:opacity-80"
          >
            <Text className="text-sm font-bold text-bg">첫 기록 작성</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        >
          {grouped.map(({ dateKey, items }) => (
            <View key={dateKey} className="mb-5">
              <Text className="mb-2 text-sm font-semibold text-text-muted">
                {formatDate(dateKey)}
              </Text>
              {items.map((e) => {
                const eventPhotos = photosByEvent.get(e.id) ?? [];
                return (
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
                        numberOfLines={3}
                      >
                        {e.memo}
                      </Text>
                    ) : null}
                    {eventPhotos.length > 0 ? (
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="mt-3"
                        contentContainerStyle={{ gap: 6 }}
                      >
                        {eventPhotos.map((p) => {
                          const url = signedUrls[p.storage_path];
                          return (
                            <View
                              key={p.id}
                              style={{
                                width: THUMB_SIZE,
                                height: THUMB_SIZE,
                                borderRadius: 8,
                                overflow: "hidden",
                                backgroundColor: COLORS.bg,
                              }}
                            >
                              {url ? (
                                <Image
                                  source={{ uri: url }}
                                  style={{ width: "100%", height: "100%" }}
                                  contentFit="cover"
                                  transition={120}
                                />
                              ) : null}
                            </View>
                          );
                        })}
                      </ScrollView>
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
          ))}
        </ScrollView>
      )}
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

type Event = {
  id: string;
  event_date: string;
  title: string;
  memo: string | null;
  created_at: string;
};

function groupByDate(
  events: readonly Event[],
): { dateKey: string; items: Event[] }[] {
  const map = new Map<string, Event[]>();
  for (const e of events) {
    const list = map.get(e.event_date) ?? [];
    list.push(e);
    map.set(e.event_date, list);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([dateKey, items]) => ({ dateKey, items }));
}

function formatDate(key: string): string {
  const p = key.split("-").map(Number);
  const y = p[0];
  const m = p[1];
  const d = p[2];
  if (!y || !m || !d) return key;
  return `${y}년 ${m}월 ${d}일`;
}
