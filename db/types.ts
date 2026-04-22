import type { CategoryKey } from "@/constants/categories";
import type { ClassId } from "@/constants/classes";

export type QuestType = "daily" | "weekly" | "custom";

export type Character = {
  id: number;
  name: string;
  current_class_id: ClassId;
  level: number;
  current_xp: number;
  gold: number;
  exercise_xp: number;
  study_xp: number;
  creative_xp: number;
  productivity_xp: number;
  created_at: string;
};

export type QuestTemplate = {
  id: number;
  title: string;
  description: string | null;
  quest_type: QuestType;
  category: CategoryKey;
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
  category_gained: CategoryKey;
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

export type ClassHistoryEntry = {
  id: number;
  class_id: ClassId;
  changed_at: string;
  level_at_change: number;
  reason: "initial" | "awakening" | "transition";
};

export type Achievement = {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  unlocked_at: string | null;
  progress: number;
  target: number | null;
};

export type NewCharacterInput = {
  name: string;
};

export type NewQuestTemplateInput = {
  title: string;
  description?: string | null;
  quest_type: QuestType;
  category: CategoryKey;
  xp_reward: number;
  repeat_pattern?: string | null;
  is_custom?: boolean;
};
