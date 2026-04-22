import { CLASSES } from "@/constants/classes";
import type { StatKey } from "@/constants/theme";
import { getDb } from "./client";
import {
  countLogsForTemplateBetween,
  getKstDayBounds,
  listActiveTemplates,
  listTemplatesByStat,
} from "./quest";
import type { Character, QuestTemplate } from "./types";

const STAT_KEYS: readonly StatKey[] = [
  "str",
  "int",
  "wis",
  "dex",
  "con",
  "cha",
] as const;

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

function findWeakestStat(character: Character): StatKey {
  let weakest: StatKey = "str";
  let min = character.str;
  for (const k of STAT_KEYS) {
    const v = character[k];
    if (v < min) {
      min = v;
      weakest = k;
    }
  }
  return weakest;
}

function getMainStat(character: Character): StatKey {
  const def = CLASSES.find((c) => c.key === character.class);
  return def?.mainStat ?? "str";
}

/**
 * 스펙의 일일 퀘스트 생성 규칙:
 *  - 주력 스탯 퀘스트 2개
 *  - 약점 스탯 퀘스트 1개
 *  - 랜덤 1개 (다양성)
 */
function pickTodayTemplates(character: Character): QuestTemplate[] {
  const mainStat = getMainStat(character);
  const weakestStat = findWeakestStat(character);
  const picks: QuestTemplate[] = [];
  const used = new Set<number>();

  const mainPool = listTemplatesByStat(mainStat).filter((t) => !used.has(t.id));
  for (const t of shuffleTake(mainPool, 2)) {
    picks.push(t);
    used.add(t.id);
  }

  const weakPool = listTemplatesByStat(weakestStat).filter(
    (t) => !used.has(t.id),
  );
  const weakPick = pickRandom(weakPool);
  if (weakPick) {
    picks.push(weakPick);
    used.add(weakPick.id);
  }

  const anyPool = listActiveTemplates({ questType: "daily" }).filter(
    (t) => !used.has(t.id),
  );
  const randomPick = pickRandom(anyPool);
  if (randomPick) {
    picks.push(randomPick);
    used.add(randomPick.id);
  }

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
