import { create } from "zustand";
import type { ClassKey, StatKey } from "@/constants/theme";
import {
  allocateStatPoints as dbAllocateStatPoints,
  createCharacter as dbCreateCharacter,
  getCharacter as dbGetCharacter,
  incrementStat as dbIncrementStat,
  spendStatPoint as dbSpendStatPoint,
  updateCharacterProgress as dbUpdateCharacterProgress,
} from "@/db/character";
import {
  ensureTodaySelection,
  listTodayQuests,
  type TodayQuest,
} from "@/db/daily";
import { initDb, resetAllData } from "@/db/init";
import {
  applyXpGain,
  isClassSpecialty,
  xpForNextLevel,
} from "@/db/leveling";
import { getTemplate, insertQuestLog } from "@/db/quest";
import {
  bumpStreakForToday,
  calculateStreakBonus,
  getStreak,
  reconcileStreak,
} from "@/db/streak";
import type { Character, Streak } from "@/db/types";

export type CompleteQuestResult = {
  xpGained: number;
  statGained: StatKey;
  levelsGained: number;
  newLevel: number;
  streakMultiplier: number;
  classBonus: number;
};

type CharacterState = {
  character: Character | null;
  streak: Streak | null;
  todayQuests: TodayQuest[];
  isReady: boolean;
  lastError: string | null;

  hydrate: () => void;
  createCharacter: (input: { name: string; class: ClassKey }) => Character;
  completeQuest: (templateId: number) => CompleteQuestResult | null;
  spendStatPoint: (stat: StatKey) => void;
  allocateStatPoints: (allocations: Partial<Record<StatKey, number>>) => void;
  refresh: () => void;
  refreshToday: () => void;
  refreshForNewDay: () => void;
  resetAll: () => void;
};

export const useCharacterStore = create<CharacterState>((set, get) => ({
  character: null,
  streak: null,
  todayQuests: [],
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
   * 앱이 열린 채로 자정을 넘긴 경우에 호출. 오늘의 퀘스트를 재계산하고
   * 스트릭이 끊어졌다면 current_streak을 0으로 리셋한다.
   */
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
    const classBonus = isClassSpecialty(character.class, template.target_stat)
      ? 1.5
      : 1.0;
    const xpGained = Math.floor(
      template.xp_reward * streakMultiplier * classBonus,
    );
    const statDelta = Math.max(1, Math.floor(xpGained * 0.1));

    const next = applyXpGain({
      level: character.level,
      current_xp: character.current_xp,
      unspent_stat_points: character.unspent_stat_points,
      xp_to_add: xpGained,
    });

    dbUpdateCharacterProgress({
      id: character.id,
      level: next.level,
      current_xp: next.current_xp,
      unspent_stat_points: next.unspent_stat_points,
      gold: character.gold,
    });
    dbIncrementStat(character.id, template.target_stat, statDelta);
    insertQuestLog({
      template_id: template.id,
      xp_gained: xpGained,
      stat_gained: template.target_stat,
      streak_multiplier: streakMultiplier,
    });
    const newStreak = bumpStreakForToday();

    const refreshed = dbGetCharacter();
    const todayQuests = listTodayQuests();
    set({ character: refreshed, streak: newStreak, todayQuests });

    return {
      xpGained,
      statGained: template.target_stat,
      levelsGained: next.levels_gained,
      newLevel: next.level,
      streakMultiplier,
      classBonus,
    };
  },

  spendStatPoint: (stat) => {
    const character = get().character;
    if (!character) return;
    const updated = dbSpendStatPoint(character.id, stat);
    set({ character: updated });
  },

  allocateStatPoints: (allocations) => {
    const character = get().character;
    if (!character) return;
    const updated = dbAllocateStatPoints(character.id, allocations);
    set({ character: updated });
  },

  resetAll: () => {
    resetAllData();
    set({
      character: null,
      streak: getStreak(),
      todayQuests: [],
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
