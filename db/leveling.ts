import type { ClassKey, StatKey } from "@/constants/theme";
import { CLASSES } from "@/constants/classes";

export const STAT_POINTS_PER_LEVEL = 3;

export function xpForNextLevel(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.5));
}

export function isClassSpecialty(
  classKey: ClassKey,
  stat: StatKey,
): boolean {
  const def = CLASSES.find((c) => c.key === classKey);
  return def?.mainStat === stat;
}

/**
 * XP를 추가하면서 누적 레벨업을 처리한다.
 * 입력 character는 변경하지 않고 새 객체를 반환한다.
 */
export function applyXpGain(params: {
  level: number;
  current_xp: number;
  unspent_stat_points: number;
  xp_to_add: number;
}): {
  level: number;
  current_xp: number;
  unspent_stat_points: number;
  levels_gained: number;
} {
  let level = params.level;
  let current_xp = params.current_xp + params.xp_to_add;
  let unspent_stat_points = params.unspent_stat_points;
  let levels_gained = 0;

  while (current_xp >= xpForNextLevel(level)) {
    current_xp -= xpForNextLevel(level);
    level += 1;
    unspent_stat_points += STAT_POINTS_PER_LEVEL;
    levels_gained += 1;
  }

  return { level, current_xp, unspent_stat_points, levels_gained };
}
