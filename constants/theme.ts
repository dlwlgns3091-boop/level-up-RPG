import type { CategoryKey } from "./categories";

/**
 * Midnight Arcade 팔레트 (Phase 12.A).
 * 디자인 핸드오프(`design_handoff_lifequest/tokens.css`)와 정확히 동기화.
 *
 * - `ink`는 모든 보더 + stepped 그림자에 공통 사용 (Phase 12.C 도입).
 * - `hp/mp/xp/stamina`는 게임 게이지 색. 카테고리 색은 톤별 매핑(아래).
 *
 * 추후 Butter / Grove 테마 추가 시 이 객체를 함수가 반환하도록 확장하면 됨.
 */
export const COLORS = {
  // Surfaces
  bg: "#1E1A2E", // 플럼 네이비
  bgSoft: "#2B2640",
  bgSofter: "#3A3352",
  bgSunken: "#141020",

  // Text
  text: "#F5F0FF",
  textMuted: "#A89EC8",
  textSubtle: "#6B6288",

  // Brand (버터 골드)
  gold: "#FFD66B",
  goldDark: "#FFB84D",
  goldSoft: "#4A3A00", // brand-soft (다크 톤에선 어두운 골드 스미어)

  // Border + shadow 공용 잉크
  ink: "#0F0A1A",
  inkShadow: "#0A0614",

  // Game stats
  hp: "#FF8FA8",
  mp: "#8FCFFF",
  xp: "#FFD66B",
  stamina: "#8EE4A8",

  // Semantic
  success: "#8EE4A8",
  warning: "#FFB84D",
  danger: "#FF8FA8",
  info: "#8FCFFF",

  // Rarity (추후 인벤토리/업적용)
  rarity: {
    common: "#A89EC8",
    uncommon: "#8EE4A8",
    rare: "#8FCFFF",
    epic: "#D4A8F5",
    legendary: "#FFB84D",
  },

  // Category 매핑 (HP/MP/Epic/Stamina 톤)
  category: {
    exercise: "#FF8FA8", // HP
    study: "#8FCFFF", // MP
    creative: "#D4A8F5", // Epic
    productivity: "#8EE4A8", // Stamina
  } satisfies Record<CategoryKey, string>,
} as const;

export type { CategoryKey } from "./categories";
