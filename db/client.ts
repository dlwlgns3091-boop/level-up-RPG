import * as SQLite from "expo-sqlite";

const DB_NAME = "lifequest.db";

let cached: SQLite.SQLiteDatabase | null = null;

export function getDb(): SQLite.SQLiteDatabase {
  if (cached) return cached;
  cached = SQLite.openDatabaseSync(DB_NAME);
  cached.execSync("PRAGMA foreign_keys = ON;");
  return cached;
}

/** 테스트/리셋 용도. 프로덕션 코드 경로에서는 호출하지 말 것. */
export function _resetCache(): void {
  cached = null;
}
