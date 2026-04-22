import { getDb } from "./client";

/**
 * 2 = Phase 8.5: 4-category + auto-class system.
 * v1(기존 6스탯) 데이터는 호환되지 않으므로 파괴적 마이그레이션.
 */
const CURRENT_SCHEMA_VERSION = 2;

const NEW_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS character (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  current_class_id TEXT NOT NULL DEFAULT 'apprentice',
  level INTEGER NOT NULL DEFAULT 1,
  current_xp INTEGER NOT NULL DEFAULT 0,
  gold INTEGER NOT NULL DEFAULT 0,
  exercise_xp INTEGER NOT NULL DEFAULT 0,
  study_xp INTEGER NOT NULL DEFAULT 0,
  creative_xp INTEGER NOT NULL DEFAULT 0,
  productivity_xp INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS quest_template (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  quest_type TEXT NOT NULL,
  category TEXT NOT NULL,
  xp_reward INTEGER NOT NULL,
  repeat_pattern TEXT,
  is_custom INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS quest_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  template_id INTEGER NOT NULL,
  completed_at TEXT NOT NULL,
  xp_gained INTEGER NOT NULL,
  category_gained TEXT NOT NULL,
  streak_multiplier REAL NOT NULL DEFAULT 1.0,
  FOREIGN KEY (template_id) REFERENCES quest_template(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_quest_log_completed_at
  ON quest_log(completed_at);
CREATE INDEX IF NOT EXISTS idx_quest_log_template_id
  ON quest_log(template_id);

CREATE TABLE IF NOT EXISTS streak (
  id INTEGER PRIMARY KEY,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_completed_date TEXT
);

CREATE TABLE IF NOT EXISTS title (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  unlocked_at TEXT NOT NULL,
  is_equipped INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS daily_quest (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date_key TEXT NOT NULL,
  slot INTEGER NOT NULL,
  template_id INTEGER NOT NULL,
  UNIQUE(date_key, slot),
  FOREIGN KEY (template_id) REFERENCES quest_template(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_daily_quest_date_key
  ON daily_quest(date_key);

CREATE TABLE IF NOT EXISTS class_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  class_id TEXT NOT NULL,
  changed_at TEXT NOT NULL,
  level_at_change INTEGER NOT NULL,
  reason TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_class_history_changed_at
  ON class_history(changed_at);

CREATE TABLE IF NOT EXISTS achievement (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  unlocked_at TEXT,
  progress INTEGER NOT NULL DEFAULT 0,
  target INTEGER
);
`;

const DROP_V1_TABLES_SQL = `
DROP TABLE IF EXISTS quest_log;
DROP TABLE IF EXISTS daily_quest;
DROP TABLE IF EXISTS title;
DROP TABLE IF EXISTS quest_template;
DROP TABLE IF EXISTS character;
DROP TABLE IF EXISTS streak;
DROP TABLE IF EXISTS class_history;
DROP TABLE IF EXISTS achievement;
`;

export function migrate(): void {
  const db = getDb();
  const row = db.getFirstSync<{ user_version: number }>(
    "PRAGMA user_version;",
  );
  const existingVersion = row?.user_version ?? 0;

  if (existingVersion > 0 && existingVersion < CURRENT_SCHEMA_VERSION) {
    // v1 -> v2: 구조 자체가 달라져 안전한 ALTER가 불가능. 테이블 전체 삭제.
    db.execSync(DROP_V1_TABLES_SQL);
  }

  db.execSync(NEW_SCHEMA_SQL);
  db.execSync(`PRAGMA user_version = ${CURRENT_SCHEMA_VERSION};`);

  ensureSingletonRows();
}

function ensureSingletonRows(): void {
  const db = getDb();
  db.runSync(
    "INSERT OR IGNORE INTO streak (id, current_streak, longest_streak, last_completed_date) VALUES (1, 0, 0, NULL);",
  );
}
