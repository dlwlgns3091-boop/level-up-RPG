import { getDb } from "./client";

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS character (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  class TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 1,
  current_xp INTEGER NOT NULL DEFAULT 0,
  gold INTEGER NOT NULL DEFAULT 0,
  str INTEGER NOT NULL DEFAULT 10,
  int INTEGER NOT NULL DEFAULT 10,
  wis INTEGER NOT NULL DEFAULT 10,
  dex INTEGER NOT NULL DEFAULT 10,
  con INTEGER NOT NULL DEFAULT 10,
  cha INTEGER NOT NULL DEFAULT 10,
  unspent_stat_points INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS quest_template (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  quest_type TEXT NOT NULL,
  target_stat TEXT NOT NULL,
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
  stat_gained TEXT NOT NULL,
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
`;

export function migrate(): void {
  const db = getDb();
  db.execSync(SCHEMA_SQL);
  ensureSingletonRows();
}

function ensureSingletonRows(): void {
  const db = getDb();
  // streak는 1행만 유지하므로 id=1 행을 보장한다.
  db.runSync(
    "INSERT OR IGNORE INTO streak (id, current_streak, longest_streak, last_completed_date) VALUES (1, 0, 0, NULL);",
  );
}
