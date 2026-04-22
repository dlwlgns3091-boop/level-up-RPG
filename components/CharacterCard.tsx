import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { getClass } from "@/constants/classes";
import { COLORS } from "@/constants/theme";
import { xpForNextLevel } from "@/db/leveling";
import type { Character } from "@/db/types";
import { XpBar } from "./XpBar";

type Props = {
  character: Character;
};

export function CharacterCard({ character }: Props) {
  const def = getClass(character.current_class_id);
  const need = xpForNextLevel(character.level);
  const ratio = Math.min(1, character.current_xp / need);

  return (
    <View className="rounded-3xl border border-bg-softer bg-bg-soft p-5">
      <View className="flex-row items-center">
        <View
          className="mr-4 h-16 w-16 items-center justify-center rounded-2xl"
          style={{ backgroundColor: `${COLORS.gold}33` }}
        >
          <Ionicons name="person" size={32} color={COLORS.gold} />
        </View>

        <View className="flex-1">
          <Text className="text-lg font-bold text-text">
            {character.name}
          </Text>
          <Text className="mt-0.5 text-sm font-semibold text-gold">
            {def.nameKo}
          </Text>
          <Text className="mt-0.5 text-xs text-text-muted">
            Lv.{character.level} · {def.flavor}
          </Text>
        </View>
      </View>

      <View className="mt-4">
        <XpBar current={character.current_xp} need={need} ratio={ratio} />
      </View>
    </View>
  );
}
