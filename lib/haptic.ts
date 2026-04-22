import * as Haptics from "expo-haptics";
import { Platform, Vibration } from "react-native";

/**
 * expo-haptics를 1차로 시도하고, Android Expo Go + 일부 Samsung 기기처럼
 * 피드백이 미약한 환경에서도 진동이 전달되도록 RN Vibration으로 폴백한다.
 * 항상 Promise<void>로 동기화해 호출부가 `.catch(() => undefined)`로 감싸면
 * 실패가 UX를 막지 않는다.
 */
export async function tapFeedback(): Promise<void> {
  const ran = await tryHaptic(() =>
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  );
  if (!ran && Platform.OS === "android") {
    Vibration.vibrate(30);
  }
}

export async function successFeedback(): Promise<void> {
  const ran = await tryHaptic(() =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  );
  if (!ran && Platform.OS === "android") {
    Vibration.vibrate([0, 40, 60, 40]);
  }
}

async function tryHaptic(run: () => Promise<void>): Promise<boolean> {
  try {
    await run();
    if (__DEV__) {
      console.log("[haptic] fired via expo-haptics");
    }
    return true;
  } catch (e) {
    if (__DEV__) {
      console.log("[haptic] expo-haptics failed:", e);
    }
    return false;
  }
}
