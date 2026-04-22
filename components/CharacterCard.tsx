import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { CLASSES, STAT_LABELS_KO } from "@/constants/classes";
import { COLORS } from "@/constants/theme";
import { xpForNextLevel } from "@/db/leveling";
import type { Character } from "@/db/types";
import { XpBar } from "./XpBar";

type Props = {
  character: Character;
};

const ICON_BY_CLASS = {
  warrior: "barbell",
  sage: "book",
  monk: "leaf",
  bard: "musical-notes",
  rogue: "flash",
  cleric: "heart",
} as const;

export function CharacterCard({ character }: Props) {
  const def = CLASSES.find((c) => c.key === character.class);
  const mainStat = def?.mainStat ?? "str";
  const accent = COLORS.stat[mainStat];
  const need = xpForNextLevel(character.level);
  const ratio = Math.min(1, character.current_xp / need);

  return (
    <View className="rounded-3xl border border-bg-softer bg-bg-soft p-5">
      <View className="flex-row items-center">
        <View
          className="mr-4 h-16 w-16 items-center justify-center rounded-2xl"
          style={{ backgroundColor: `${accent}33` }}
        >
          <Ionicons
            name={ICON_BY_CLASS[character.class]}
            size={32}
            color={accent}
          />
        </View>

        <View className="flex-1">
          <Text className="text-lg font-bold text-text">
            {character.name}
            <Text className="text-text-muted">
              {" the "}
              {def?.nameKo ?? ""}
            </Text>
          </Text>
          <Text className="text-sm text-text-muted">
            Lv.{character.level} · 주 스탯 {STAT_LABELS_KO[mainStat]}
          </Text>
        </View>
      </View>

      <View className="mt-4">
        <XpBar current={character.current_xp} need={need} ratio={ratio} />
      </View>
    </View>
  );
}
