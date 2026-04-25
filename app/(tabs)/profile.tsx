import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Pressable, ScrollView, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PIXEL_FONT } from "@/components/pixelStyles";
import { CLASS_BY_ID, getClass } from "@/constants/classes";
import { STRINGS } from "@/constants/strings.ko";
import { COLORS } from "@/constants/theme";
import { listClassHistory } from "@/db/classHistory";
import type { ClassHistoryEntry } from "@/db/types";
import {
  cancelDailyReminder,
  DEFAULT_REMINDER_HOUR,
  DEFAULT_REMINDER_MINUTE,
  getScheduledReminderTime,
  hasNotificationPermission,
  isDailyReminderScheduled,
  NOTIFICATIONS_DISABLED_REASON,
  NOTIFICATIONS_SUPPORTED,
  requestNotificationPermission,
  scheduleDailyReminder,
} from "@/lib/notifications";
import { SUPABASE_CONFIGURED } from "@/lib/supabase";
import { useAuthStore } from "@/store/useAuthStore";
import { useCharacterStore } from "@/store/useCharacterStore";

const HOUR_OPTIONS = [7, 8, 9, 12, 20, 22] as const;

export default function Profile() {
  const router = useRouter();
  const character = useCharacterStore((s) => s.character);
  const streak = useCharacterStore((s) => s.streak);
  const resetAll = useCharacterStore((s) => s.resetAll);

  const authReady = useAuthStore((s) => s.isReady);
  const authSession = useAuthStore((s) => s.session);
  const authUser = useAuthStore((s) => s.user);
  const authBusy = useAuthStore((s) => s.busy);
  const signOut = useAuthStore((s) => s.signOut);

  const [reminderOn, setReminderOn] = useState<boolean>(false);
  const [reminderHour, setReminderHour] = useState<number>(
    DEFAULT_REMINDER_HOUR,
  );
  const [reminderMinute, setReminderMinute] = useState<number>(
    DEFAULT_REMINDER_MINUTE,
  );
  const [busy, setBusy] = useState<boolean>(false);
  const [history, setHistory] = useState<ClassHistoryEntry[]>([]);

  const loadAll = useCallback(async () => {
    const scheduled = await isDailyReminderScheduled();
    setReminderOn(scheduled);
    if (scheduled) {
      const time = await getScheduledReminderTime();
      if (time) {
        setReminderHour(time.hour);
        setReminderMinute(time.minute);
      }
    }
    setHistory(listClassHistory());
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAll();
    }, [loadAll]),
  );

  const toggleReminder = async (next: boolean) => {
    if (busy) return;
    setBusy(true);
    try {
      if (next) {
        const hasPerm =
          (await hasNotificationPermission()) ||
          (await requestNotificationPermission());
        if (!hasPerm) {
          Alert.alert(
            "알림 권한 필요",
            "매일 리마인더를 받으려면 설정에서 알림 권한을 허용해주세요.",
          );
          setBusy(false);
          return;
        }
        await scheduleDailyReminder(reminderHour, reminderMinute);
        setReminderOn(true);
      } else {
        await cancelDailyReminder();
        setReminderOn(false);
      }
    } finally {
      setBusy(false);
    }
  };

  const pickHour = async (hour: number) => {
    setReminderHour(hour);
    if (reminderOn) {
      setBusy(true);
      try {
        await scheduleDailyReminder(hour, reminderMinute);
      } finally {
        setBusy(false);
      }
    }
  };

  const currentClassDef = character
    ? getClass(character.current_class_id)
    : null;

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top", "left", "right"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 140 }}
      >
        <Text
          style={{
            marginBottom: 16,
            fontFamily: PIXEL_FONT.display,
            fontSize: 26,
            color: COLORS.gold,
            letterSpacing: 1,
          }}
        >
          {STRINGS.profile.title}
        </Text>

        {character ? (
          <View className="mb-6 rounded-2xl border border-bg-softer bg-bg-soft p-4">
            <Text className="text-lg font-semibold text-text">
              {character.name}
            </Text>
            <Text className="mt-1 text-sm font-semibold text-gold">
              {currentClassDef?.nameKo ?? ""}
            </Text>
            <Text className="mt-0.5 text-xs text-text-muted">
              {currentClassDef?.flavor ?? ""}
            </Text>
            <Text className="mt-2 text-xs text-text-muted">
              Lv.{character.level} · 생성일{" "}
              {character.created_at.slice(0, 10)}
            </Text>
          </View>
        ) : null}

        <Section title={STRINGS.profile.classHistory}>
          {history.length === 0 ? (
            <Text className="text-xs text-text-muted">아직 이력 없음</Text>
          ) : (
            history.map((h) => {
              const def = CLASS_BY_ID[h.class_id];
              const reasonLabel =
                h.reason === "initial"
                  ? "시작"
                  : h.reason === "awakening"
                    ? "각성"
                    : "전직";
              return (
                <View
                  key={h.id}
                  className="mb-1.5 flex-row items-center justify-between"
                >
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-text">
                      {def?.nameKo ?? h.class_id}
                    </Text>
                    <Text className="text-[11px] text-text-muted">
                      Lv.{h.level_at_change} · {reasonLabel}
                    </Text>
                  </View>
                  <Text className="text-[11px] text-text-muted">
                    {h.changed_at.slice(0, 10)}
                  </Text>
                </View>
              );
            })
          )}
        </Section>

        <Section title="연속 달성">
          <Row label="현재 연속">
            <Text className="text-sm font-semibold text-gold">
              {streak?.current_streak ?? 0}일
            </Text>
          </Row>
          <Row label="최고 기록">
            <Text className="text-sm font-semibold text-text">
              {streak?.longest_streak ?? 0}일
            </Text>
          </Row>
          {streak?.last_completed_date ? (
            <Row label="마지막 완료">
              <Text className="text-sm text-text-muted">
                {streak.last_completed_date}
              </Text>
            </Row>
          ) : null}
        </Section>

        <Section title="계정">
          {!SUPABASE_CONFIGURED ? (
            <Text className="text-xs text-text-muted">
              Supabase가 설정되지 않았습니다. 커플 공유 기능을 쓰려면 .env에 EXPO_PUBLIC_SUPABASE_URL과 EXPO_PUBLIC_SUPABASE_ANON_KEY를 설정하세요.
            </Text>
          ) : !authReady ? (
            <Text className="text-xs text-text-muted">세션 확인 중…</Text>
          ) : authSession && authUser ? (
            <>
              <View className="py-1">
                <Text className="text-xs text-text-muted">로그인 이메일</Text>
                <Text className="mt-0.5 text-sm text-text">
                  {authUser.email ?? "(이메일 없음)"}
                </Text>
              </View>
              <Pressable
                onPress={() => {
                  Alert.alert(
                    "로그아웃",
                    "로그아웃하시면 커플 공유 기능을 다시 사용하려면 로그인이 필요합니다.",
                    [
                      { text: STRINGS.common.cancel, style: "cancel" },
                      {
                        text: "로그아웃",
                        style: "destructive",
                        onPress: async () => {
                          await signOut();
                        },
                      },
                    ],
                  );
                }}
                className="mt-3 flex-row items-center justify-center rounded-xl border border-bg-softer bg-bg px-3 py-2 active:opacity-80"
                disabled={authBusy}
              >
                <Ionicons
                  name="log-out-outline"
                  size={16}
                  color={COLORS.textMuted}
                />
                <Text className="ml-2 text-sm text-text-muted">로그아웃</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Text className="mb-3 text-xs text-text-muted">
                로그인 시 커플 공유 기능(사진·일정)을 사용할 수 있습니다. 로컬 데이터(레벨/퀘스트/스탯)는 로그인과 무관하게 유지됩니다.
              </Text>
              <View className="flex-row">
                <View className="mr-2 flex-1">
                  <Pressable
                    onPress={() => router.push("/auth/sign-in")}
                    className="items-center justify-center rounded-2xl bg-gold px-4 py-3 active:opacity-80"
                  >
                    <Text className="text-sm font-bold text-bg">로그인</Text>
                  </Pressable>
                </View>
                <View className="flex-1">
                  <Pressable
                    onPress={() => router.push("/auth/sign-up")}
                    className="items-center justify-center rounded-2xl border border-bg-softer bg-bg-soft px-4 py-3 active:opacity-80"
                  >
                    <Text className="text-sm font-bold text-text">회원가입</Text>
                  </Pressable>
                </View>
              </View>
            </>
          )}
        </Section>

        <Section title="알림">
          <View className="flex-row items-center justify-between py-1">
            <View className="flex-1">
              <Text className="text-sm text-text">일일 퀘스트 리마인더</Text>
              <Text className="mt-0.5 text-[11px] text-text-muted">
                매일 정해진 시간에 알림을 보냅니다
              </Text>
            </View>
            <Switch
              value={reminderOn}
              onValueChange={toggleReminder}
              disabled={busy || !NOTIFICATIONS_SUPPORTED}
              trackColor={{ false: COLORS.bgSofter, true: COLORS.goldDark }}
              thumbColor={reminderOn ? COLORS.gold : COLORS.textMuted}
            />
          </View>

          {NOTIFICATIONS_DISABLED_REASON ? (
            <Text className="mt-2 text-[11px] text-text-muted">
              {NOTIFICATIONS_DISABLED_REASON}
            </Text>
          ) : null}

          {reminderOn ? (
            <View className="mt-3">
              <Text className="mb-2 text-xs text-text-muted">
                알림 시간 (현재: {formatTime(reminderHour, reminderMinute)})
              </Text>
              <View className="flex-row flex-wrap">
                {HOUR_OPTIONS.map((h) => {
                  const active = h === reminderHour;
                  return (
                    <Pressable
                      key={h}
                      onPress={() => pickHour(h)}
                      className="mb-2 mr-2 rounded-full border px-3 py-2"
                      style={{
                        borderColor: active ? COLORS.gold : COLORS.bgSofter,
                        backgroundColor: active
                          ? `${COLORS.gold}22`
                          : COLORS.bgSoft,
                      }}
                    >
                      <Text
                        className="text-xs font-semibold"
                        style={{
                          color: active ? COLORS.gold : COLORS.textMuted,
                        }}
                      >
                        {formatTime(h, 0)}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ) : null}
        </Section>

        <Section title="업적">
          <Text className="text-xs text-text-muted">
            추후 업데이트 예정 (Phase 9)
          </Text>
        </Section>

        <Section title="정보">
          <Row label={STRINGS.app.name}>
            <Text className="text-xs text-text-muted">v0.2.0 (Phase 8.5)</Text>
          </Row>
        </Section>

        <View className="mt-4">
          <Text className="mb-2 text-sm font-semibold text-text-muted">
            위험한 작업
          </Text>
          <Pressable
            onPress={() => {
              Alert.alert(
                "모든 데이터 초기화",
                "캐릭터, 퀘스트 기록, 커스텀 퀘스트, 직업 이력, 스트릭이 모두 삭제됩니다. 되돌릴 수 없습니다.",
                [
                  { text: STRINGS.common.cancel, style: "cancel" },
                  {
                    text: "초기화",
                    style: "destructive",
                    onPress: async () => {
                      await cancelDailyReminder().catch(() => undefined);
                      resetAll();
                      router.replace("/onboarding/welcome");
                    },
                  },
                ],
              );
            }}
            className="flex-row items-center justify-center rounded-2xl border bg-bg-soft p-4 active:opacity-80"
            style={{ borderColor: COLORS.danger }}
          >
            <Ionicons name="trash" size={18} color={COLORS.danger} />
            <Text
              className="ml-2 text-base font-bold"
              style={{ color: COLORS.danger }}
            >
              모든 데이터 초기화
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function formatTime(h: number, m: number): string {
  const hh = h.toString().padStart(2, "0");
  const mm = m.toString().padStart(2, "0");
  return `${hh}:${mm}`;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View className="mb-4">
      <Text className="mb-2 text-sm font-semibold text-text-muted">
        {title}
      </Text>
      <View className="rounded-2xl border border-bg-softer bg-bg-soft p-4">
        {children}
      </View>
    </View>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View className="flex-row items-center justify-between py-1.5">
      <Text className="text-sm text-text">{label}</Text>
      <View className="flex-row items-center">{children}</View>
    </View>
  );
}
