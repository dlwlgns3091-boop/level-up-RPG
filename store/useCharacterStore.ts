import { create } from "zustand";
import type { CategoryKey } from "@/constants/categories";
import { type ClassId } from "@/constants/classes";
import {
  createCharacter as dbCreateCharacter,
  getCharacter as dbGetCharacter,
  incrementCategoryXp as dbIncrementCategoryXp,
  setCurrentClass as dbSetCurrentClass,
  updateCharacterProgress as dbUpdateCharacterProgress,
} from "@/db/character";
import { insertClassHistory } from "@/db/classHistory";
import {
  ensureTodaySelection,
  listTodayQuests,
  type TodayQuest,
} from "@/db/daily";
import { initDb, resetAllData } from "@/db/init";
import { applyXpGain, xpForNextLevel } from "@/db/leveling";
import {
  deactivateTemplate,
  getTemplate,
  hasAnyLogForTemplate,
  insertQuestLog,
  purgeTemplateFromDailyQueue,
} from "@/db/quest";
import {
  bumpStreakForToday,
  calculateStreakBonus,
  getStreak,
  reconcileStreak,
} from "@/db/streak";
import type { Character, Streak } from "@/db/types";
import { determineClass } from "@/lib/classDeterminer";
import { pickCategoryXp } from "@/types/category";

export type ClassChangeEvent = {
  previous: ClassId;
  next: ClassId;
  isAwakening: boolean;
  level: number;
};

export type CompleteQuestResult = {
  xpGained: number;
  category: CategoryKey;
  levelsGained: number;
  newLevel: number;
  streakMultiplier: number;
  classChange: ClassChangeEvent | null;
};

export type DeactivateResult =
  | { ok: true }
  | { ok: false; reason: "completed_in_past" | "not_found" };

type CharacterState = {
  character: Character | null;
  streak: Streak | null;
  todayQuests: TodayQuest[];
  /** 직업이 막 바뀌었을 때 UI가 모달을 띄우도록 임시 보관. 표시 후 clear 호출. */
  pendingClassChange: ClassChangeEvent | null;
  isReady: boolean;
  lastError: string | null;

  hydrate: () => void;
  createCharacter: (input: { name: string }) => Character;
  completeQuest: (templateId: number) => CompleteQuestResult | null;
  deactivateQuestTemplate: (templateId: number) => DeactivateResult;
  refresh: () => void;
  refreshToday: () => void;
  refreshForNewDay: () => void;
  clearPendingClassChange: () => void;
  resetAll: () => void;
};

export const useCharacterStore = create<CharacterState>((set, get) => ({
  character: null,
  streak: null,
  todayQuests: [],
  pendingClassChange: null,
  isReady: false,
  lastError: null,

  hydrate: () => {
    try {
      initDb();
      const character = dbGetCharacter();
      const streak = reconcileStreak();
      if (character) {
        ensureTodaySelection(character);
      }
      const todayQuests = character ? listTodayQuests() : [];
      set({
        character,
        streak,
        todayQuests,
        isReady: true,
        lastError: null,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      set({ isReady: true, lastError: msg });
    }
  },

  createCharacter: (input) => {
    const character = dbCreateCharacter(input);
    insertClassHistory({
      class_id: "apprentice",
      level_at_change: character.level,
      reason: "initial",
    });
    ensureTodaySelection(character);
    const todayQuests = listTodayQuests();
    set({ character, todayQuests });
    return character;
  },

  refresh: () => {
    const character = dbGetCharacter();
    const streak = getStreak();
    set({ character, streak });
  },

  refreshToday: () => {
    const character = get().character;
    if (!character) return;
    ensureTodaySelection(character);
    set({ todayQuests: listTodayQuests() });
  },

  /**
   * 퀘스트 템플릿 비활성화 (소프트 삭제).
   * - 한 번이라도 완료된 적 있으면 차단 (XP 기록 보존 정책).
   * - daily_quest 큐에서 즉시 제거 → 오늘의 퀘스트 목록에서 사라짐.
   * - quest_template은 is_active=0으로 마킹만 함 → quest_log FK는 유지.
   */
  deactivateQuestTemplate: (templateId) => {
    const template = getTemplate(templateId);
    if (!template) {
      return { ok: false, reason: "not_found" };
    }
    if (hasAnyLogForTemplate(templateId)) {
      return { ok: false, reason: "completed_in_past" };
    }
    deactivateTemplate(templateId);
    purgeTemplateFromDailyQueue(templateId);

    // 오늘의 퀘스트 목록 즉시 갱신. 빈 슬롯이 생겨도 다음날 자동 채워짐.
    const character = get().character;
    if (character) {
      set({ todayQuests: listTodayQuests() });
    }
    return { ok: true };
  },

  refreshForNewDay: () => {
    const character = get().character;
    const streak = reconcileStreak();
    if (character) {
      ensureTodaySelection(character);
      set({ streak, todayQuests: listTodayQuests() });
    } else {
      set({ streak });
    }
  },

  completeQuest: (templateId) => {
    const character = get().character;
    if (!character) return null;
    const template = getTemplate(templateId);
    if (!template) return null;

    const streakBefore = getStreak();
    const streakMultiplier = calculateStreakBonus(streakBefore);
    const xpGained = Math.floor(template.xp_reward * streakMultiplier);

    const next = applyXpGain({
      level: character.level,
      current_xp: character.current_xp,
      xp_to_add: xpGained,
    });

    dbUpdateCharacterProgress({
      id: character.id,
      level: next.level,
      current_xp: next.current_xp,
      gold: character.gold,
    });
    dbIncrementCategoryXp(character.id, template.category, xpGained);
    insertQuestLog({
      template_id: template.id,
      xp_gained: xpGained,
      category_gained: template.category,
      streak_multiplier: streakMultiplier,
    });
    const newStreak = bumpStreakForToday();

    // 직업 재판정 — 매번. 상태 안정성은 hysteresis가 담당.
    const refreshedAfterUpdate = dbGetCharacter();
    let classChange: ClassChangeEvent | null = null;
    if (refreshedAfterUpdate) {
      const newClass = determineClass(
        pickCategoryXp(refreshedAfterUpdate),
        refreshedAfterUpdate.current_class_id,
      );
      if (newClass !== refreshedAfterUpdate.current_class_id) {
        const previous = refreshedAfterUpdate.current_class_id;
        dbSetCurrentClass(refreshedAfterUpdate.id, newClass);
        const reason: "awakening" | "transition" =
          previous === "apprentice" ? "awakening" : "transition";
        insertClassHistory({
          class_id: newClass,
          level_at_change: refreshedAfterUpdate.level,
          reason,
        });
        classChange = {
          previous,
          next: newClass,
          isAwakening: reason === "awakening",
          level: refreshedAfterUpdate.level,
        };
      }
    }

    const finalCharacter = dbGetCharacter();
    const todayQuests = listTodayQuests();
    set({
      character: finalCharacter,
      streak: newStreak,
      todayQuests,
      pendingClassChange: classChange ?? get().pendingClassChange,
    });

    return {
      xpGained,
      category: template.category,
      levelsGained: next.levels_gained,
      newLevel: next.level,
      streakMultiplier,
      classChange,
    };
  },

  clearPendingClassChange: () => set({ pendingClassChange: null }),

  resetAll: () => {
    resetAllData();
    set({
      character: null,
      streak: getStreak(),
      todayQuests: [],
      pendingClassChange: null,
      lastError: null,
    });
  },
}));

export const selectXpProgress = (s: CharacterState) => {
  if (!s.character) return null;
  const need = xpForNextLevel(s.character.level);
  return {
    current: s.character.current_xp,
    need,
    ratio: Math.min(1, s.character.current_xp / need),
  };
};
