import { getDb } from "./client";
import { migrate } from "./schema";
import { seedDefaultTemplatesIfNeeded } from "./seed";

let initialized = false;

export function initDb(): void {
  if (initialized) return;
  migrate();
  seedDefaultTemplatesIfNeeded();
  initialized = true;
}

/**
 * 모든 사용자 데이터 삭제. 씨드 퀘스트 템플릿과 스트릭 싱글턴 행은
 * 빈 상태로 다시 보장한다. 스키마는 그대로 유지.
 */
export function resetAllData(): void {
  const db = getDb();
  db.withTransactionSync(() => {
    db.execSync(`
      DELETE FROM quest_log;
      DELETE FROM daily_quest;
      DELETE FROM title;
      DELETE FROM quest_template;
      DELETE FROM character;
      DELETE FROM class_history;
      DELETE FROM achievement;
      UPDATE streak
         SET current_streak = 0,
             longest_streak = 0,
             last_completed_date = NULL
       WHERE id = 1;
    `);
  });
  seedDefaultTemplatesIfNeeded();
}
