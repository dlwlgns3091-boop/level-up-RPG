import { useThemeStore } from "@/store/useThemeStore";
import type { CategoryKey } from "./categories";
import { MIDNIGHT_PALETTE, type Palette } from "./themes";

/**
 * 정적(default) 컬러 토큰. 모듈 로드 시점에 캡처되므로 테마 토글에 반응하지 않는다.
 * 호환성을 위해 남겨두고, 신규 코드/테마-반응이 필요한 곳은 `useColors()` 사용.
 *
 * Phase 12.F부터: 컴포넌트 내부에서 색을 쓸 땐 반드시 `const COLORS = useColors();`로 받아쓰기.
 * 모듈 레벨/유틸 함수에선 기본 팔레트(Midnight) 색이 그대로 쓰임 — 라이트 테마에서도 잉크/그림자
 * 같은 디테일이 어색하지 않은지 확인 필요.
 */
export const COLORS: Palette = MIDNIGHT_PALETTE;

/** 현재 활성 팔레트를 구독한다. 테마 변경 시 자동 재렌더. */
export function useColors(): Palette {
  return useThemeStore((s) => s.palette);
}

export type { CategoryKey } from "./categories";
