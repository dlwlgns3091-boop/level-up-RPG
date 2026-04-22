import type { CategoryKey } from "@/constants/categories";
import type { ClassId } from "@/constants/classes";
import { getDb } from "./client";
import type { Character, NewCharacterInput } from "./types";

const CATEGORY_COLUMN: Readonly<Record<CategoryKey, keyof Character>> = {
  exercise: "exercise_xp",
  study: "study_xp",
  creative: "creative_xp",
  productivity: "productivity_xp",
};

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
    `INSERT INTO character (name, current_class_id, created_at)
     VALUES (?, 'apprentice', ?);`,
    [input.name, createdAt],
  );
  const id = Number(result.lastInsertRowId);
  const row = db.getFirstSync<Character>(
    "SELECT * FROM character WHERE id = ?;",
    [id],
  );
  if (!row) throw new Error("Failed to create character");
  return row;
}

export function updateCharacterProgress(params: {
  id: number;
  level: number;
  current_xp: number;
  gold: number;
}): void {
  const db = getDb();
  db.runSync(
    `UPDATE character
       SET level = ?, current_xp = ?, gold = ?
     WHERE id = ?;`,
    [params.level, params.current_xp, params.gold, params.id],
  );
}

export function incrementCategoryXp(
  characterId: number,
  category: CategoryKey,
  delta: number,
): void {
  const column = CATEGORY_COLUMN[category];
  const db = getDb();
  db.runSync(
    `UPDATE character SET ${column} = ${column} + ? WHERE id = ?;`,
    [delta, characterId],
  );
}

export function setCurrentClass(characterId: number, classId: ClassId): void {
  const db = getDb();
  db.runSync(
    "UPDATE character SET current_class_id = ? WHERE id = ?;",
    [classId, characterId],
  );
}

export function deleteCharacter(id: number): void {
  const db = getDb();
  db.runSync("DELETE FROM character WHERE id = ?;", [id]);
}
