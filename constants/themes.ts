import type { CategoryKey } from "./categories";

export type ThemeId = "midnight" | "butter";

/** 한 테마의 모든 색 토큰. 모든 화면이 이 객체에서 색을 가져온다. */
export type Palette = {
  bg: string;
  bgSoft: string;
  bgSofter: string;
  bgSunken: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  gold: string;
  goldDark: string;
  goldSoft: string;
  /** 모든 보더 + stepped 그림자 공용. 다크 테마에선 거의 검정, 라이트에선 다크 브라운. */
  ink: string;
  inkShadow: string;
  hp: string;
  mp: string;
  xp: string;
  stamina: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  rarity: {
    common: string;
    uncommon: string;
    rare: string;
    epic: string;
    legendary: string;
  };
  category: Record<CategoryKey, string>;
};

/**
 * Midnight Arcade — 다크 (기본).
 * `tokens.css`의 [data-theme="midnight-arcade"] 1:1 동기화.
 */
export const MIDNIGHT_PALETTE: Palette = {
  bg: "#1E1A2E",
  bgSoft: "#2B2640",
  bgSofter: "#3A3352",
  bgSunken: "#141020",
  text: "#F5F0FF",
  textMuted: "#A89EC8",
  textSubtle: "#6B6288",
  gold: "#FFD66B",
  goldDark: "#FFB84D",
  goldSoft: "#4A3A00",
  ink: "#0F0A1A",
  inkShadow: "#0A0614",
  hp: "#FF8FA8",
  mp: "#8FCFFF",
  xp: "#FFD66B",
  stamina: "#8EE4A8",
  success: "#8EE4A8",
  warning: "#FFB84D",
  danger: "#FF8FA8",
  info: "#8FCFFF",
  rarity: {
    common: "#A89EC8",
    uncommon: "#8EE4A8",
    rare: "#8FCFFF",
    epic: "#D4A8F5",
    legendary: "#FFB84D",
  },
  category: {
    exercise: "#FF8FA8",
    study: "#8FCFFF",
    creative: "#D4A8F5",
    productivity: "#8EE4A8",
  },
};

/**
 * Parchment Quest — 라이트 (Butter).
 * `tokens.css`의 [data-theme="parchment-light"] 1:1 동기화.
 * 다크 잉크는 #3A2E1F (다크 브라운) — 모든 보더/그림자가 이 색.
 */
export const BUTTER_PALETTE: Palette = {
  bg: "#FFF6E3",
  bgSoft: "#FFFDF5",
  bgSofter: "#FFFFFF",
  bgSunken: "#F5E8C8",
  text: "#3A2E1F",
  textMuted: "#8A7856",
  textSubtle: "#B8A888",
  gold: "#FFD66B",
  goldDark: "#E8A83C",
  goldSoft: "#FFF2C4",
  ink: "#3A2E1F",
  inkShadow: "#3A2E1F",
  hp: "#FF7B7B",
  mp: "#6BAEE8",
  xp: "#FFD66B",
  stamina: "#7EC96A",
  success: "#7EC96A",
  warning: "#FFA94D",
  danger: "#FF7B7B",
  info: "#6BAEE8",
  rarity: {
    common: "#B8A888",
    uncommon: "#7EC96A",
    rare: "#6BAEE8",
    epic: "#C78BE8",
    legendary: "#FFA94D",
  },
  category: {
    exercise: "#FF7B7B",
    study: "#6BAEE8",
    creative: "#C78BE8",
    productivity: "#7EC96A",
  },
};

export const PALETTES: Record<ThemeId, Palette> = {
  midnight: MIDNIGHT_PALETTE,
  butter: BUTTER_PALETTE,
};

export const THEME_LABELS: Record<ThemeId, string> = {
  midnight: "🌙 Midnight",
  butter: "🌼 Butter",
};
