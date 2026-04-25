import { Text, View } from "react-native";
import { ClassSprite } from "@/components/sprites";
import { getClass } from "@/constants/classes";
import { useColors } from "@/constants/theme";
import { xpForNextLevel } from "@/db/leveling";
import type { Character } from "@/db/types";
import { PIXEL_FONT, PIXEL_RADIUS, pixelCard } from "./pixelStyles";
import { XpBar } from "./XpBar";

type Props = {
  character: Character;
};

export function CharacterCard({ character }: Props) {
  const COLORS = useColors();
  const def = getClass(character.current_class_id);
  const need = xpForNextLevel(character.level);
  const ratio = Math.min(1, character.current_xp / need);

  return (
    <View
      style={{
        backgroundColor: COLORS.bgSoft,
        padding: 20,
        ...pixelCard(COLORS.ink, PIXEL_RADIUS.lg, 4),
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View
          style={{
            marginRight: 16,
            width: 72,
            height: 72,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: PIXEL_RADIUS.lg,
            backgroundColor: COLORS.bgSofter,
            borderWidth: 2,
            borderColor: COLORS.ink,
          }}
        >
          <ClassSprite classId={character.current_class_id} size={56} />
        </View>

        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: PIXEL_FONT.uiBold,
              fontSize: 18,
              color: COLORS.text,
            }}
          >
            {character.name}
          </Text>
          <Text
            style={{
              marginTop: 2,
              fontFamily: PIXEL_FONT.uiBold,
              fontSize: 13,
              color: COLORS.gold,
            }}
          >
            {def.nameKo}
          </Text>
          <Text
            style={{
              marginTop: 2,
              fontFamily: PIXEL_FONT.ui,
              fontSize: 11,
              color: COLORS.textMuted,
            }}
          >
            Lv.{character.level} · {def.flavor}
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 16 }}>
        <XpBar current={character.current_xp} need={need} ratio={ratio} />
      </View>
    </View>
  );
}
