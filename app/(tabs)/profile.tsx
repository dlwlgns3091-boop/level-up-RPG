import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Pressable, ScrollView, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CLASSES } from "@/constants/classes";
import { STRINGS } from "@/constants/strings.ko";
import { COLORS } from "@/constants/theme";
import {
  cancelDailyReminder,
  DEFAULT_REMINDER_HOUR,
  DEFAULT_REMINDER_MINUTE,
  getScheduledReminderTime,
  hasNotificationPermission,
  isDailyReminderScheduled,
  requestNotificationPermission,
  scheduleDailyReminder,
} from "@/lib/notifications";
import { useCharacterStore } from "@/store/useCharacterStore";

const HOUR_OPTIONS = [7, 8, 9, 12, 20, 22] as const;

export default function Profile() {
  const character = useCharacterStore((s) => s.character);
  const streak = useCharacterStore((s) => s.streak);

  const [reminderOn, setReminderOn] = useState<boolean>(false);
  const [reminderHour, setReminderHour] = useState<number>(
    DEFAULT_REMINDER_HOUR,
  );
  const [reminderMinute, setReminderMinute] = useState<number>(
    DEFAULT_REMINDER_MINUTE,
  );
  const [busy, setBusy] = useState<boolean>(false);

  const loadReminderState = useCallback(async () => {
    const scheduled = await isDailyReminderScheduled();
    setReminderOn(scheduled);
    if (scheduled) {
      const time = await getScheduledReminderTime();
      if (time) {
        setReminderHour(time.hour);
        setReminderMinute(time.minute);
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadReminderState();
    }, [loadReminderState]),
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

  const classDef = character
    ? CLASSES.find((c) => c.key === character.class) ?? null
    : null;

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top", "left", "right"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      >
        <Text className="mb-4 text-2xl font-bold text-gold">
          {STRINGS.profile.title}
        </Text>

        {character ? (
          <View className="mb-6 rounded-2xl border border-bg-softer bg-bg-soft p-4">
            <Text className="text-lg font-semibold text-text">
              {character.name}
              <Text className="text-text-muted">
                {" the "}
                {classDef?.nameKo ?? ""}
              </Text>
            </Text>
            <Text className="mt-1 text-sm text-text-muted">
              Lv.{character.level} · 생성일{" "}
              {character.created_at.slice(0, 10)}
            </Text>
          </View>
        ) : null}

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
              disabled={busy}
              trackColor={{ false: COLORS.bgSofter, true: COLORS.goldDark }}
              thumbColor={reminderOn ? COLORS.gold : COLORS.textMuted}
            />
          </View>

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

        <Section title="정보">
          <Row label={STRINGS.app.name}>
            <Text className="text-xs text-text-muted">v0.1.0 (MVP)</Text>
          </Row>
          <Row label="칭호 시스템">
            <Text className="text-xs text-text-muted">추후 업데이트 예정</Text>
          </Row>
        </Section>
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
      <View className="flex-row items-center">
        {children}
        <Ionicons
          name="chevron-forward"
          size={14}
          color="transparent"
          style={{ marginLeft: 6 }}
        />
      </View>
    </View>
  );
}
