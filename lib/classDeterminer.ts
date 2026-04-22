import type { CategoryKey } from "@/constants/categories";
import { CLASS_BY_ID, type ClassId } from "@/constants/classes";
import type { CategoryXP } from "@/types/category";

const PURE_THRESHOLD = 0.6;
const TRIPLE_TOP_THRESHOLD = 0.2;
const TRIPLE_WEAK_MAX = 0.12;
const PERFECT_MIN = 0.18;
const ACTIVE_CATEGORY_MIN_XP = 20;
const APPRENTICE_MIN_TOTAL = 50;

const PURE_BY_CATEGORY: Readonly<Record<CategoryKey, ClassId>> = {
  exercise: "iron_heart",
  study: "librarian_king",
  creative: "pixel_master",
  productivity: "time_hacker",
};

const DUAL_BY_PAIR: ReadonlyMap<string, ClassId> = new Map([
  ["exercise+study", "sparta_scholar"],
  ["creative+exercise", "physical_artist"],
  ["exercise+productivity", "life_athlete"],
  ["creative+study", "story_mage"],
  ["productivity+study", "project_mage"],
  ["creative+productivity", "indie_hacker"],
]);

const TRIPLE_BY_WEAKEST: Readonly<Record<CategoryKey, ClassId>> = {
  productivity: "renaissance",
  creative: "godsaeng_hunter",
  study: "street_artist",
  exercise: "digital_wizard",
};

type RatioEntry = { key: CategoryKey; ratio: number; xp: number };

function ratiosOf(stats: CategoryXP, total: number): RatioEntry[] {
  const entries: RatioEntry[] = (
    Object.entries(stats) as Array<[CategoryKey, number]>
  ).map(([key, xp]) => ({ key, xp, ratio: total > 0 ? xp / total : 0 }));
  entries.sort((a, b) => b.ratio - a.ratio);
  return entries;
}

function totalOf(stats: CategoryXP): number {
  return stats.exercise + stats.study + stats.creative + stats.productivity;
}

function activeCount(stats: CategoryXP): number {
  return (Object.values(stats) as number[]).filter(
    (xp) => xp >= ACTIVE_CATEGORY_MIN_XP,
  ).length;
}

function dualKey(a: CategoryKey, b: CategoryKey): string {
  return [a, b].sort().join("+");
}

function rawDetermine(stats: CategoryXP): ClassId {
  const total = totalOf(stats);
  if (total < APPRENTICE_MIN_TOTAL) return "apprentice";
  if (activeCount(stats) < 2) return "apprentice";

  const r = ratiosOf(stats, total);
  const top = r[0];
  const fourth = r[3];
  if (!top || !fourth) return "apprentice";

  // 순수형: 1위가 60% 이상
  if (top.ratio >= PURE_THRESHOLD) {
    return PURE_BY_CATEGORY[top.key];
  }

  // 전능형: 4위도 18% 이상 (모두 비등)
  if (fourth.ratio >= PERFECT_MIN) {
    return "perfect_human";
  }

  // 3중 조합: 3위 20%+, 4위 12% 미만
  const third = r[2];
  if (third && third.ratio >= TRIPLE_TOP_THRESHOLD && fourth.ratio < TRIPLE_WEAK_MAX) {
    return TRIPLE_BY_WEAKEST[fourth.key];
  }

  // 2중 조합: 상위 2개
  const second = r[1];
  if (second) {
    return DUAL_BY_PAIR.get(dualKey(top.key, second.key)) ?? "apprentice";
  }

  return "apprentice";
}

/**
 * Hysteresis: 직업이 바뀌어야 한다고 판정되었을 때, 현재 직업의 주력
 * 카테고리에 총 XP의 5% 보너스를 주고 다시 판정해서 같은 결과면 바꾼다.
 * 경계 근처의 작은 변동으로 직업이 자주 바뀌는 것을 방지.
 */
export function determineClass(
  stats: CategoryXP,
  currentClassId: ClassId = "apprentice",
): ClassId {
  const raw = rawDetermine(stats);
  if (raw === currentClassId) return currentClassId;

  const def = CLASS_BY_ID[currentClassId];
  if (!def || def.primary.length === 0) {
    // 수련생이거나 정의 없는 경우 그대로 변경
    return raw;
  }

  const total = totalOf(stats);
  const boost = Math.max(1, Math.floor(total * 0.05));
  const biased: CategoryXP = { ...stats };
  for (const cat of def.primary) {
    biased[cat] = biased[cat] + boost;
  }
  const biasedResult = rawDetermine(biased);
  return biasedResult === currentClassId ? currentClassId : raw;
}

export const __testing = {
  rawDetermine,
  ratiosOf,
  activeCount,
  PURE_THRESHOLD,
  TRIPLE_TOP_THRESHOLD,
  TRIPLE_WEAK_MAX,
  PERFECT_MIN,
};
