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

/**
 * Character row → CategoryXP. db/types에 의존 없이 캐릭터의 카테고리 컬럼만 추출.
 */
export function pickCategoryXp(c: {
  exercise_xp: number;
  study_xp: number;
  creative_xp: number;
  productivity_xp: number;
}): CategoryXP {
  return {
    exercise: c.exercise_xp,
    study: c.study_xp,
    creative: c.creative_xp,
    productivity: c.productivity_xp,
  };
}
