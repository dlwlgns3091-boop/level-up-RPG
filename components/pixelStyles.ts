import { Platform, type ViewStyle } from "react-native";
import { COLORS } from "@/constants/theme";

/** Phase 12.C에서 도입한 픽셀 토큰. tailwind 토큰과 1:1 동기화. */
export const PIXEL_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  pill: 999,
} as const;

export const PIXEL_BORDER_WIDTH = 2;

/**
 * 폰트 패밀리 상수.
 * 폰트 파일이 없을 때 RN은 시스템 폰트로 fallback (Phase 12.A 참고).
 */
export const PIXEL_FONT = {
  display: "DungGeunMo",
  ui: "Galmuri11",
  uiBold: "Galmuri11-Bold",
  body: "Pretendard",
  bodyBold: "Pretendard-Bold",
} as const;

/**
 * Stepped 3D 그림자 — `box-shadow: 0 Ny 0 0 ink` 흉내.
 *
 * - iOS: 네이티브 shadow* (`shadowRadius: 0` = 하드 그림자).
 * - Android: shadow*가 무시되므로 elevation도 0으로 고정해 머티리얼 부드러운
 *   그림자가 끼는 것을 방지. 카드의 2px 잉크 보더가 시각적 정의를 대신 함.
 *   (필요 시 추후 absolute 레이어 트릭으로 강화 가능.)
 */
export function steppedShadow(offsetY = 4): ViewStyle {
  if (Platform.OS === "android") {
    return { elevation: 0 };
  }
  return {
    shadowColor: COLORS.ink,
    shadowOffset: { width: 0, height: offsetY },
    shadowOpacity: 1,
    shadowRadius: 0,
  };
}

/** 자주 쓰는 픽셀 프레임(2px ink 보더 + 라운드) 베이스. 배경색은 호출부에서. */
export function pixelFrame(radius: number = PIXEL_RADIUS.lg): ViewStyle {
  return {
    borderWidth: PIXEL_BORDER_WIDTH,
    borderColor: COLORS.ink,
    borderRadius: radius,
  };
}

/** 카드 표준: 픽셀 프레임 + stepped 그림자. */
export function pixelCard(radius: number = PIXEL_RADIUS.lg, offsetY = 4): ViewStyle {
  return {
    ...pixelFrame(radius),
    ...steppedShadow(offsetY),
  };
}
