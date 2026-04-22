import type { CategoryKey } from "./categories";

export const COLORS = {
  bg: "#0F172A",
  bgSoft: "#1E293B",
  bgSofter: "#334155",
  gold: "#FCD34D",
  goldDark: "#B45309",
  text: "#F8FAFC",
  textMuted: "#94A3B8",
  danger: "#EF4444",
  category: {
    exercise: "#EF4444",
    study: "#3B82F6",
    creative: "#A855F7",
    productivity: "#10B981",
  } satisfies Record<CategoryKey, string>,
} as const;

export type { CategoryKey } from "./categories";
