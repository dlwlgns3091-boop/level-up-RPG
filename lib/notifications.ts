import Constants from "expo-constants";
import { Platform } from "react-native";

const DAILY_REMINDER_ID = "lifequest-daily-reminder";
const ANDROID_CHANNEL_ID = "daily-reminder";

export const DEFAULT_REMINDER_HOUR = 9;
export const DEFAULT_REMINDER_MINUTE = 0;

/**
 * Expo Go는 SDK 53+부터 Android에서 expo-notifications 관련 기능이 제거되어
 * 모듈을 단순히 import하는 것만으로도 빨간 경고 박스를 띄울 수 있다.
 *   - Expo Go + Android  -> 알림 관련 코드 전면 스킵 (모듈 require 자체도 건너뜀)
 *   - Expo Go + iOS      -> 로컬 알림은 아직 가능하므로 허용
 *   - Dev-build / Prod   -> 모두 정상
 *
 * Constants.appOwnership === 'expo' 이면 Expo Go에서 실행 중.
 */
const IS_EXPO_GO = Constants.appOwnership === "expo";
export const NOTIFICATIONS_SUPPORTED = !(
  IS_EXPO_GO && Platform.OS === "android"
);

export const NOTIFICATIONS_DISABLED_REASON: string | null =
  NOTIFICATIONS_SUPPORTED
    ? null
    : "Android Expo Go에서는 알림이 비활성화됩니다. Dev Build 또는 배포 빌드에서 작동합니다.";

type NotificationsModule = typeof import("expo-notifications");

let _module: NotificationsModule | null = null;
let _moduleLoadAttempted = false;

function getNotifications(): NotificationsModule | null {
  if (!NOTIFICATIONS_SUPPORTED) return null;
  if (_moduleLoadAttempted) return _module;
  _moduleLoadAttempted = true;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    _module = require("expo-notifications") as NotificationsModule;
    return _module;
  } catch (e) {
    devLog("require('expo-notifications') failed:", e);
    return null;
  }
}

function devLog(...args: unknown[]): void {
  if (__DEV__) console.log("[notifications]", ...args);
}

/** 앱 부팅 시 한 번만 호출. 실패해도 앱이 뜨지 않는 것을 막지 않는다. */
export async function configureNotificationSystem(): Promise<void> {
  const N = getNotifications();
  if (!N) {
    devLog(`skip configure — ${NOTIFICATIONS_DISABLED_REASON ?? "module unavailable"}`);
    return;
  }
  try {
    N.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  } catch (e) {
    devLog("setNotificationHandler failed:", e);
  }

  if (Platform.OS === "android") {
    try {
      await N.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
        name: "일일 퀘스트 리마인더",
        importance: N.AndroidImportance.DEFAULT,
        lockscreenVisibility: N.AndroidNotificationVisibility.PUBLIC,
      });
    } catch (e) {
      devLog("setNotificationChannelAsync failed:", e);
    }
  }
}

export async function hasNotificationPermission(): Promise<boolean> {
  const N = getNotifications();
  if (!N) return false;
  try {
    const settings = await N.getPermissionsAsync();
    return (
      settings.granted ||
      settings.ios?.status === N.IosAuthorizationStatus.PROVISIONAL
    );
  } catch (e) {
    devLog("getPermissionsAsync failed:", e);
    return false;
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  const N = getNotifications();
  if (!N) return false;
  try {
    const existing = await N.getPermissionsAsync();
    if (existing.granted) return true;
    const asked = await N.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: false,
        allowSound: true,
      },
    });
    return asked.granted;
  } catch (e) {
    devLog("requestPermissionsAsync failed:", e);
    return false;
  }
}

export async function isDailyReminderScheduled(): Promise<boolean> {
  const N = getNotifications();
  if (!N) return false;
  try {
    const scheduled = await N.getAllScheduledNotificationsAsync();
    return scheduled.some((n) => n.identifier === DAILY_REMINDER_ID);
  } catch (e) {
    devLog("getAllScheduledNotificationsAsync failed:", e);
    return false;
  }
}

export async function scheduleDailyReminder(
  hour: number = DEFAULT_REMINDER_HOUR,
  minute: number = DEFAULT_REMINDER_MINUTE,
): Promise<boolean> {
  const N = getNotifications();
  if (!N) return false;
  try {
    await N.cancelScheduledNotificationAsync(DAILY_REMINDER_ID).catch(
      () => undefined,
    );
    await N.scheduleNotificationAsync({
      identifier: DAILY_REMINDER_ID,
      content: {
        title: "오늘의 퀘스트가 기다리고 있어요",
        body: "연속 달성 스트릭을 이어가 보세요!",
      },
      trigger: {
        type: N.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
        channelId:
          Platform.OS === "android" ? ANDROID_CHANNEL_ID : undefined,
      },
    });
    return true;
  } catch (e) {
    devLog("scheduleNotificationAsync failed:", e);
    return false;
  }
}

export async function cancelDailyReminder(): Promise<void> {
  const N = getNotifications();
  if (!N) return;
  try {
    await N.cancelScheduledNotificationAsync(DAILY_REMINDER_ID);
  } catch (e) {
    devLog("cancelScheduledNotificationAsync failed:", e);
  }
}

export async function getScheduledReminderTime(): Promise<{
  hour: number;
  minute: number;
} | null> {
  const N = getNotifications();
  if (!N) return null;
  try {
    const scheduled = await N.getAllScheduledNotificationsAsync();
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
  } catch (e) {
    devLog("getAllScheduledNotificationsAsync failed:", e);
    return null;
  }
}
