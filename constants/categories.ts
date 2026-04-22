export type CategoryKey = "exercise" | "study" | "creative" | "productivity";

export type CategoryDef = {
  key: CategoryKey;
  nameKo: string;
  emoji: string;
  /** Tailwind 토큰과 동기화되는 hex */
  color: string;
  /** @expo/vector-icons Ionicons glyph name */
  icon: string;
};

export const CATEGORIES: readonly CategoryDef[] = [
  { key: "exercise", nameKo: "운동", emoji: "🏋️", color: "#EF4444", icon: "barbell" },
  { key: "study", nameKo: "공부", emoji: "📚", color: "#3B82F6", icon: "book" },
  { key: "creative", nameKo: "창작", emoji: "🎨", color: "#A855F7", icon: "color-palette" },
  { key: "productivity", nameKo: "생산성", emoji: "⚡", color: "#10B981", icon: "flash" },
] as const;

export const CATEGORY_BY_KEY: Readonly<Record<CategoryKey, CategoryDef>> =
  CATEGORIES.reduce<Record<CategoryKey, CategoryDef>>((acc, def) => {
    acc[def.key] = def;
    return acc;
  }, {} as Record<CategoryKey, CategoryDef>);

export const CATEGORY_LABELS_KO: Readonly<Record<CategoryKey, string>> = {
  exercise: "운동",
  study: "공부",
  creative: "창작",
  productivity: "생산성",
};
