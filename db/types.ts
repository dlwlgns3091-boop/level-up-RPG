import type { ClassKey, StatKey } from "@/constants/theme";

export type QuestType = "daily" | "weekly" | "custom";

export type Character = {
  id: number;
  name: string;
  class: ClassKey;
  level: number;
  current_xp: number;
  gold: number;
  str: number;
  int: number;
  wis: number;
  dex: number;
  con: number;
  cha: number;
  unspent_stat_points: number;
  created_at: string;
};

export type QuestTemplate = {
  id: number;
  title: string;
  description: string | null;
  quest_type: QuestType;
  target_stat: StatKey;
  xp_reward: number;
  repeat_pattern: string | null;
  is_custom: 0 | 1;
  is_active: 0 | 1;
};

export type QuestLog = {
  id: number;
  template_id: number;
  completed_at: string;
  xp_gained: number;
  stat_gained: StatKey;
  streak_multiplier: number;
};

export type Streak = {
  id: number;
  current_streak: number;
  longest_streak: number;
  last_completed_date: string | null;
};

export type Title = {
  id: number;
  name: string;
  description: string | null;
  unlocked_at: string;
  is_equipped: 0 | 1;
};

export type NewCharacterInput = {
  name: string;
  class: ClassKey;
};

export type NewQuestTemplateInput = {
  title: string;
  description?: string | null;
  quest_type: QuestType;
  target_stat: StatKey;
  xp_reward: number;
  repeat_pattern?: string | null;
  is_custom?: boolean;
};
