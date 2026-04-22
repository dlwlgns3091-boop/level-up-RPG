import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import type { ClassDef } from "@/constants/classes";
import { STAT_LABELS_KO } from "@/constants/classes";
import { COLORS } from "@/constants/theme";

type Props = {
  def: ClassDef;
  selected: boolean;
  onPress: () => void;
};

const ICON_BY_CLASS: Record<ClassDef["key"], keyof typeof Ionicons.glyphMap> = {
  warrior: "barbell",
  sage: "book",
  monk: "leaf",
  bard: "musical-notes",
  rogue: "flash",
  cleric: "heart",
};

export function ClassCard({ def, selected, onPress }: Props) {
  const iconName = ICON_BY_CLASS[def.key];
  const accent = COLORS.stat[def.mainStat];

  return (
    <Pressable
      onPress={onPress}
      className={`mb-3 flex-row items-center rounded-2xl border p-4 ${
        selected
          ? "border-gold bg-bg-soft"
          : "border-bg-softer bg-bg-soft active:opacity-80"
      }`}
    >
      <View
        className="mr-4 h-14 w-14 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${accent}33` }}
      >
        <Ionicons name={iconName} size={28} color={accent} />
      </View>

      <View className="flex-1">
        <View className="flex-row items-baseline">
          <Text className="text-lg font-bold text-text">{def.nameKo}</Text>
          <Text className="ml-2 text-xs text-text-muted">
            주 스탯 · {STAT_LABELS_KO[def.mainStat]}
          </Text>
        </View>
        <Text className="mt-1 text-sm text-text-muted">{def.concept}</Text>
        <Text className="mt-1 text-xs text-text-muted">
          1.5x XP · {def.specialtyActivities}
        </Text>
      </View>

      {selected ? (
        <Ionicons name="checkmark-circle" size={24} color={COLORS.gold} />
      ) : null}
    </Pressable>
  );
}
