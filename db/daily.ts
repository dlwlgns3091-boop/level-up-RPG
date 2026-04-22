import { type CategoryKey } from "@/constants/categories";
import { CATEGORY_KEYS, pickCategoryXp } from "@/types/category";
import { getDb } from "./client";
import {
  countLogsForTemplateBetween,
  getKstDayBounds,
  listActiveTemplates,
  listTemplatesByCategory,
} from "./quest";
import type { Character, QuestTemplate } from "./types";

export type TodayQuest = {
  slot: number;
  template: QuestTemplate;
  completedCount: number;
};

function pickRandom<T>(items: readonly T[]): T | null {
  if (items.length === 0) return null;
  const idx = Math.floor(Math.random() * items.length);
  return items[idx] ?? null;
}

function shuffleTake<T>(items: readonly T[], n: number): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = arr[i];
    const other = arr[j];
    if (tmp !== undefined && other !== undefined) {
      arr[i] = other;
      arr[j] = tmp;
    }
  }
  return arr.slice(0, n);
}

/**
 * 카테고리 XP 기준으로 정렬. 동률은 안정성 위해 사전식.
 */
function rankCategoriesByXp(
  character: Character,
): readonly CategoryKey[] {
  const xp = pickCategoryXp(character);
  const ranked = [...CATEGORY_KEYS].sort((a, b) => {
    if (xp[b] !== xp[a]) return xp[b] - xp[a];
    return a.localeCompare(b);
  });
  return ranked;
}

/**
 * 스펙의 일일 퀘스트 생성 규칙 (카테고리 기반):
 *  - 비율 높은 2개 카테고리에서 각 1개  (주력)
 *  - 비율 낮은 1개 카테고리에서 1개      (약점 보완)
 *  - 임의 카테고리에서 랜덤 1개          (다양성)
 *
 * 신규 캐릭터는 모든 카테고리가 0이라 ranked가 사전식 순서가 되며,
 * 결과적으로 4개 카테고리에서 한 개씩 골고루 뽑힘.
 */
function pickTodayTemplates(character: Character): QuestTemplate[] {
  const ranked = rankCategoriesByXp(character);
  const top1 = ranked[0];
  const top2 = ranked[1];
  const weakest = ranked[3];

  const picks: QuestTemplate[] = [];
  const used = new Set<number>();

  for (const cat of [top1, top2, weakest]) {
    if (!cat) continue;
    const pool = listTemplatesByCategory(cat).filter((t) => !used.has(t.id));
    const choice = pickRandom(pool);
    if (choice) {
      picks.push(choice);
      used.add(choice.id);
    }
  }

  const allDailyPool = listActiveTemplates({ questType: "daily" }).filter(
    (t) => !used.has(t.id),
  );
  const randomPick = pickRandom(allDailyPool);
  if (randomPick) {
    picks.push(randomPick);
    used.add(randomPick.id);
  }

  // 결과 순서를 카테고리 기준으로 정돈해 일관된 표시
  picks.sort((a, b) => {
    const ai = CATEGORY_KEYS.indexOf(a.category);
    const bi = CATEGORY_KEYS.indexOf(b.category);
    return ai - bi;
  });

  return picks;
}

export function ensureTodaySelection(character: Character): void {
  const db = getDb();
  const { dateKey } = getKstDayBounds();

  const existing = db.getFirstSync<{ n: number }>(
    "SELECT COUNT(*) AS n FROM daily_quest WHERE date_key = ?;",
    [dateKey],
  );
  if ((existing?.n ?? 0) > 0) return;

  const picks = pickTodayTemplates(character);
  if (picks.length === 0) return;

  db.withTransactionSync(() => {
    for (let slot = 0; slot < picks.length; slot++) {
      const t = picks[slot];
      if (!t) continue;
      db.runSync(
        "INSERT INTO daily_quest (date_key, slot, template_id) VALUES (?, ?, ?);",
        [dateKey, slot, t.id],
      );
    }
  });
}

export function listTodayQuests(): TodayQuest[] {
  const db = getDb();
  const { start, end, dateKey } = getKstDayBounds();

  const rows = db.getAllSync<
    QuestTemplate & { slot: number; daily_id: number }
  >(
    `SELECT qt.*, dq.slot AS slot, dq.id AS daily_id
       FROM daily_quest dq
       JOIN quest_template qt ON qt.id = dq.template_id
       WHERE dq.date_key = ?
       ORDER BY dq.slot ASC;`,
    [dateKey],
  );

  return rows.map((r) => {
    const { slot, daily_id: _ignored, ...template } = r;
    const completedCount = countLogsForTemplateBetween(template.id, start, end);
    return { slot, template, completedCount };
  });
}
