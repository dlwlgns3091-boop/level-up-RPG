import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const DAILY_REMINDER_ID = "lifequest-daily-reminder";
const ANDROID_CHANNEL_ID = "daily-reminder";

export const DEFAULT_REMINDER_HOUR = 9;
export const DEFAULT_REMINDER_MINUTE = 0;

/**
 * 앱 부팅 시 한 번만 호출. 포그라운드에서 알림이 표시되도록 하고
 * Android 채널을 준비한다.
 */
export async function configureNotificationSystem(): Promise<void> {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
      name: "일일 퀘스트 리마인더",
      importance: Notifications.AndroidImportance.DEFAULT,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    });
  }
}

export async function hasNotificationPermission(): Promise<boolean> {
  const settings = await Notifications.getPermissionsAsync();
  return (
    settings.granted ||
    settings.ios?.status ===
      Notifications.IosAuthorizationStatus.PROVISIONAL
  );
}

export async function requestNotificationPermission(): Promise<boolean> {
  const existing = await Notifications.getPermissionsAsync();
  if (existing.granted) return true;
  const asked = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: false,
      allowSound: true,
    },
  });
  return asked.granted;
}

export async function isDailyReminderScheduled(): Promise<boolean> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  return scheduled.some((n) => n.identifier === DAILY_REMINDER_ID);
}

/**
 * 주어진 시각(기기 로컬 시간)에 매일 울리는 리마인더를 스케줄.
 * 이미 등록되어 있으면 취소 후 재등록 (시간 변경 반영).
 */
export async function scheduleDailyReminder(
  hour: number = DEFAULT_REMINDER_HOUR,
  minute: number = DEFAULT_REMINDER_MINUTE,
): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(
    DAILY_REMINDER_ID,
  ).catch(() => undefined);

  await Notifications.scheduleNotificationAsync({
    identifier: DAILY_REMINDER_ID,
    content: {
      title: "오늘의 퀘스트가 기다리고 있어요",
      body: "연속 달성 스트릭을 이어가 보세요!",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
      channelId:
        Platform.OS === "android" ? ANDROID_CHANNEL_ID : undefined,
    },
  });
}

export async function cancelDailyReminder(): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(
    DAILY_REMINDER_ID,
  ).catch(() => undefined);
}

export async function getScheduledReminderTime(): Promise<{
  hour: number;
  minute: number;
} | null> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const hit = scheduled.find((n) => n.identifier === DAILY_REMINDER_ID);
  if (!hit) return null;
  const trigger = hit.trigger as
    | { hour?: number; minute?: number }
    | null;
  if (
    !trigger ||
    typeof trigger.hour !== "number" ||
    typeof trigger.minute !== "number"
  ) {
    return null;
  }
  return { hour: trigger.hour, minute: trigger.minute };
}
