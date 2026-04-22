import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CLASSES } from "@/constants/classes";
import { STRINGS } from "@/constants/strings.ko";
import { useCharacterStore } from "@/store/useCharacterStore";

export default function Home() {
  const character = useCharacterStore((s) => s.character);

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <View className="flex-1 px-6 pt-6">
        <Text className="text-2xl font-bold text-gold">
          {STRINGS.tabs.home}
        </Text>

        {character ? (
          <View className="mt-6 rounded-2xl border border-bg-softer bg-bg-soft p-4">
            <Text className="text-lg font-semibold text-text">
              {character.name}
              <Text className="text-text-muted">
                {" the "}
                {CLASSES.find((c) => c.key === character.class)?.nameKo ?? ""}
              </Text>
            </Text>
            <Text className="mt-1 text-sm text-text-muted">
              Lv.{character.level} · {character.current_xp} XP
            </Text>
          </View>
        ) : null}

        <Text className="mt-6 text-text-muted">
          [Phase 4에서 캐릭터 카드 + {STRINGS.home.todaysQuests} 구현]
        </Text>
      </View>
    </SafeAreaView>
  );
}
