import type { CategoryKey } from "@/constants/categories";

export type { CategoryKey };

export type CategoryXP = Record<CategoryKey, number>;

export const EMPTY_CATEGORY_XP: CategoryXP = {
  exercise: 0,
  study: 0,
  creative: 0,
  productivity: 0,
} as const;

export const CATEGORY_KEYS: readonly CategoryKey[] = [
  "exercise",
  "study",
  "creative",
  "productivity",
] as const;
