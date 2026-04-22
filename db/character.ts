import type { StatKey } from "@/constants/theme";
import { getDb } from "./client";
import type { Character, NewCharacterInput } from "./types";

const STAT_COLUMNS: readonly StatKey[] = [
  "str",
  "int",
  "wis",
  "dex",
  "con",
  "cha",
] as const;

export function getCharacter(): Character | null {
  const db = getDb();
  const row = db.getFirstSync<Character>(
    "SELECT * FROM character ORDER BY id ASC LIMIT 1;",
  );
  return row ?? null;
}

export function createCharacter(input: NewCharacterInput): Character {
  const db = getDb();
  const createdAt = new Date().toISOString();
  const result = db.runSync(
    `INSERT INTO character (name, class, created_at)
     VALUES (?, ?, ?);`,
    [input.name, input.class, createdAt],
  );
  const id = Number(result.lastInsertRowId);
  const row = db.getFirstSync<Character>(
    "SELECT * FROM character WHERE id = ?;",
    [id],
  );
  if (!row) {
    throw new Error("Failed to create character");
  }
  return row;
}

export function updateCharacterProgress(params: {
  id: number;
  level: number;
  current_xp: number;
  unspent_stat_points: number;
  gold: number;
}): void {
  const db = getDb();
  db.runSync(
    `UPDATE character
       SET level = ?, current_xp = ?, unspent_stat_points = ?, gold = ?
     WHERE id = ?;`,
    [
      params.level,
      params.current_xp,
      params.unspent_stat_points,
      params.gold,
      params.id,
    ],
  );
}

export function incrementStat(
  characterId: number,
  stat: StatKey,
  delta: number,
): void {
  if (!STAT_COLUMNS.includes(stat)) {
    throw new Error(`Invalid stat key: ${stat}`);
  }
  const db = getDb();
  db.runSync(
    `UPDATE character SET ${stat} = ${stat} + ? WHERE id = ?;`,
    [delta, characterId],
  );
}

export function spendStatPoint(characterId: number, stat: StatKey): Character {
  if (!STAT_COLUMNS.includes(stat)) {
    throw new Error(`Invalid stat key: ${stat}`);
  }
  const db = getDb();
  db.withTransactionSync(() => {
    const row = db.getFirstSync<{ unspent_stat_points: number }>(
      "SELECT unspent_stat_points FROM character WHERE id = ?;",
      [characterId],
    );
    if (!row || row.unspent_stat_points < 1) {
      throw new Error("스탯 포인트가 부족합니다");
    }
    db.runSync(
      `UPDATE character
         SET ${stat} = ${stat} + 1,
             unspent_stat_points = unspent_stat_points - 1
       WHERE id = ?;`,
      [characterId],
    );
  });
  const refreshed = db.getFirstSync<Character>(
    "SELECT * FROM character WHERE id = ?;",
    [characterId],
  );
  if (!refreshed) {
    throw new Error("Character disappeared after stat update");
  }
  return refreshed;
}

export function deleteCharacter(id: number): void {
  const db = getDb();
  db.runSync("DELETE FROM character WHERE id = ?;", [id]);
}
