export const COLORS = {
  bg: "#0F172A",
  bgSoft: "#1E293B",
  bgSofter: "#334155",
  gold: "#FCD34D",
  goldDark: "#B45309",
  text: "#F8FAFC",
  textMuted: "#94A3B8",
  stat: {
    str: "#EF4444",
    int: "#3B82F6",
    wis: "#A855F7",
    dex: "#10B981",
    con: "#F97316",
    cha: "#EC4899",
  },
} as const;

export type StatKey = "str" | "int" | "wis" | "dex" | "con" | "cha";

export type ClassKey =
  | "warrior"
  | "sage"
  | "monk"
  | "bard"
  | "rogue"
  | "cleric";
