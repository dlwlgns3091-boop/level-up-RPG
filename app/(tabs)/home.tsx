import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { STRINGS } from "@/constants/strings.ko";

export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-bg">
      <View className="flex-1 px-6 pt-6">
        <Text className="text-2xl font-bold text-gold">
          {STRINGS.tabs.home}
        </Text>
        <Text className="mt-2 text-text-muted">
          [Phase 4에서 캐릭터 카드 + {STRINGS.home.todaysQuests} 구현]
        </Text>
      </View>
    </SafeAreaView>
  );
}
