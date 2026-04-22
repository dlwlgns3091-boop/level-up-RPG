import type { ClassId } from "@/constants/classes";
import { getDb } from "./client";
import type { ClassHistoryEntry } from "./types";

export function insertClassHistory(input: {
  class_id: ClassId;
  level_at_change: number;
  reason: ClassHistoryEntry["reason"];
  changed_at?: string;
}): ClassHistoryEntry {
  const db = getDb();
  const ts = input.changed_at ?? new Date().toISOString();
  const result = db.runSync(
    `INSERT INTO class_history (class_id, changed_at, level_at_change, reason)
     VALUES (?, ?, ?, ?);`,
    [input.class_id, ts, input.level_at_change, input.reason],
  );
  const id = Number(result.lastInsertRowId);
  const row = db.getFirstSync<ClassHistoryEntry>(
    "SELECT * FROM class_history WHERE id = ?;",
    [id],
  );
  if (!row) throw new Error("Failed to insert class history");
  return row;
}

export function listClassHistory(): ClassHistoryEntry[] {
  const db = getDb();
  return db.getAllSync<ClassHistoryEntry>(
    "SELECT * FROM class_history ORDER BY changed_at DESC;",
  );
}
