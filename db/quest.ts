import type { CategoryKey } from "@/constants/categories";
import { getDb } from "./client";
import type {
  NewQuestTemplateInput,
  QuestLog,
  QuestTemplate,
  QuestType,
} from "./types";

export function listActiveTemplates(filter?: {
  questType?: QuestType;
  isCustom?: boolean;
}): QuestTemplate[] {
  const db = getDb();
  const wheres: string[] = ["is_active = 1"];
  const params: (string | number)[] = [];
  if (filter?.questType) {
    wheres.push("quest_type = ?");
    params.push(filter.questType);
  }
  if (typeof filter?.isCustom === "boolean") {
    wheres.push("is_custom = ?");
    params.push(filter.isCustom ? 1 : 0);
  }
  return db.getAllSync<QuestTemplate>(
    `SELECT * FROM quest_template WHERE ${wheres.join(" AND ")} ORDER BY id ASC;`,
    params,
  );
}

export function listTemplatesByCategory(
  category: CategoryKey,
): QuestTemplate[] {
  const db = getDb();
  return db.getAllSync<QuestTemplate>(
    `SELECT * FROM quest_template
       WHERE is_active = 1 AND quest_type = 'daily' AND category = ?;`,
    [category],
  );
}

export function getTemplate(id: number): QuestTemplate | null {
  const db = getDb();
  return (
    db.getFirstSync<QuestTemplate>(
      "SELECT * FROM quest_template WHERE id = ?;",
      [id],
    ) ?? null
  );
}

export function createTemplate(input: NewQuestTemplateInput): QuestTemplate {
  const db = getDb();
  const result = db.runSync(
    `INSERT INTO quest_template
       (title, description, quest_type, category, xp_reward, repeat_pattern, is_custom, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, 1);`,
    [
      input.title,
      input.description ?? null,
      input.quest_type,
      input.category,
      input.xp_reward,
      input.repeat_pattern ?? null,
      input.is_custom ? 1 : 0,
    ],
  );
  const id = Number(result.lastInsertRowId);
  const row = getTemplate(id);
  if (!row) throw new Error("Failed to create quest template");
  return row;
}

export function deactivateTemplate(id: number): void {
  const db = getDb();
  db.runSync("UPDATE quest_template SET is_active = 0 WHERE id = ?;", [id]);
}

export function insertQuestLog(input: {
  template_id: number;
  xp_gained: number;
  category_gained: CategoryKey;
  streak_multiplier: number;
  completed_at?: string;
}): QuestLog {
  const db = getDb();
  const completedAt = input.completed_at ?? new Date().toISOString();
  const result = db.runSync(
    `INSERT INTO quest_log
       (template_id, completed_at, xp_gained, category_gained, streak_multiplier)
     VALUES (?, ?, ?, ?, ?);`,
    [
      input.template_id,
      completedAt,
      input.xp_gained,
      input.category_gained,
      input.streak_multiplier,
    ],
  );
  const id = Number(result.lastInsertRowId);
  const row = db.getFirstSync<QuestLog>(
    "SELECT * FROM quest_log WHERE id = ?;",
    [id],
  );
  if (!row) throw new Error("Failed to insert quest log");
  return row;
}

/**
 * 한국 표준시(KST, UTC+9) 기준 "오늘"의 시작/끝 ISO 문자열을 반환한다.
 */
export function getKstDayBounds(now: Date = new Date()): {
  start: string;
  end: string;
  dateKey: string;
} {
  const kstOffsetMs = 9 * 60 * 60 * 1000;
  const kstNow = new Date(now.getTime() + kstOffsetMs);
  const y = kstNow.getUTCFullYear();
  const m = kstNow.getUTCMonth();
  const d = kstNow.getUTCDate();
  const startKstAsUtc = Date.UTC(y, m, d, 0, 0, 0, 0);
  const start = new Date(startKstAsUtc - kstOffsetMs).toISOString();
  const end = new Date(
    startKstAsUtc - kstOffsetMs + 24 * 60 * 60 * 1000,
  ).toISOString();
  const dateKey = `${y.toString().padStart(4, "0")}-${(m + 1).toString().padStart(2, "0")}-${d.toString().padStart(2, "0")}`;
  return { start, end, dateKey };
}

export function getKstWeekBounds(now: Date = new Date()): {
  start: string;
  end: string;
} {
  const kstOffsetMs = 9 * 60 * 60 * 1000;
  const kstNow = new Date(now.getTime() + kstOffsetMs);
  const y = kstNow.getUTCFullYear();
  const m = kstNow.getUTCMonth();
  const d = kstNow.getUTCDate();
  const todayUtc = Date.UTC(y, m, d);
  const dow = new Date(todayUtc).getUTCDay();
  const daysSinceMonday = (dow + 6) % 7;
  const mondayUtc = todayUtc - daysSinceMonday * 24 * 60 * 60 * 1000;
  const start = new Date(mondayUtc - kstOffsetMs).toISOString();
  const end = new Date(
    mondayUtc - kstOffsetMs + 7 * 24 * 60 * 60 * 1000,
  ).toISOString();
  return { start, end };
}

export function listLogsBetween(startIso: string, endIso: string): QuestLog[] {
  const db = getDb();
  return db.getAllSync<QuestLog>(
    `SELECT * FROM quest_log
       WHERE completed_at >= ? AND completed_at < ?
       ORDER BY completed_at ASC;`,
    [startIso, endIso],
  );
}

export function listLogsForTemplateBetween(
  templateId: number,
  startIso: string,
  endIso: string,
): QuestLog[] {
  const db = getDb();
  return db.getAllSync<QuestLog>(
    `SELECT * FROM quest_log
       WHERE template_id = ? AND completed_at >= ? AND completed_at < ?
       ORDER BY completed_at ASC;`,
    [templateId, startIso, endIso],
  );
}

export function countLogsForTemplateBetween(
  templateId: number,
  startIso: string,
  endIso: string,
): number {
  const db = getDb();
  const row = db.getFirstSync<{ n: number }>(
    `SELECT COUNT(*) AS n FROM quest_log
       WHERE template_id = ? AND completed_at >= ? AND completed_at < ?;`,
    [templateId, startIso, endIso],
  );
  return row?.n ?? 0;
}
