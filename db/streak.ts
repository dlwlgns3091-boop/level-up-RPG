import { getDb } from "./client";
import { getKstDayBounds } from "./quest";
import type { Streak } from "./types";

export function getStreak(): Streak {
  const db = getDb();
  const row = db.getFirstSync<Streak>("SELECT * FROM streak WHERE id = 1;");
  if (!row) {
    throw new Error("streak singleton row missing — did migrate() run?");
  }
  return row;
}

export function calculateStreakBonus(streak: Streak): number {
  const raw = 1 + streak.current_streak * 0.05;
  return Math.min(raw, 2);
}

function dayKeyOffset(dateKey: string, deltaDays: number): string {
  const parts = dateKey.split("-").map((n) => Number(n));
  const y = parts[0] ?? 1970;
  const m = parts[1] ?? 1;
  const d = parts[2] ?? 1;
  const t = Date.UTC(y, m - 1, d) + deltaDays * 24 * 60 * 60 * 1000;
  const dt = new Date(t);
  return `${dt.getUTCFullYear().toString().padStart(4, "0")}-${(dt.getUTCMonth() + 1).toString().padStart(2, "0")}-${dt.getUTCDate().toString().padStart(2, "0")}`;
}

/**
 * 앱 시작 시 호출. 마지막 완료일이 어제보다 오래되었으면 current_streak을 0으로 리셋.
 * (longest_streak은 유지)
 */
export function reconcileStreak(): Streak {
  const current = getStreak();
  if (!current.last_completed_date || current.current_streak === 0) {
    return current;
  }
  const { dateKey: todayKey } = getKstDayBounds();
  const yesterdayKey = dayKeyOffset(todayKey, -1);
  if (
    current.last_completed_date === todayKey ||
    current.last_completed_date === yesterdayKey
  ) {
    return current;
  }
  const db = getDb();
  db.runSync("UPDATE streak SET current_streak = 0 WHERE id = 1;");
  return { ...current, current_streak: 0 };
}

/**
 * 오늘 첫 퀘스트 완료 시 호출. 어제 완료가 있었으면 +1, 없었으면 1로 리셋.
 * 같은 날 두 번째 이후 호출은 noop.
 */
export function bumpStreakForToday(): Streak {
  const db = getDb();
  const { dateKey } = getKstDayBounds();
  const current = getStreak();

  if (current.last_completed_date === dateKey) {
    return current;
  }

  const yesterdayKey = dayKeyOffset(dateKey, -1);

  const next =
    current.last_completed_date === yesterdayKey ? current.current_streak + 1 : 1;
  const longest = Math.max(current.longest_streak, next);

  db.runSync(
    `UPDATE streak
       SET current_streak = ?, longest_streak = ?, last_completed_date = ?
     WHERE id = 1;`,
    [next, longest, dateKey],
  );

  return {
    id: 1,
    current_streak: next,
    longest_streak: longest,
    last_completed_date: dateKey,
  };
}

