import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { STRINGS } from "@/constants/strings.ko";

export default function Quests() {
  return (
    <SafeAreaView className="flex-1 bg-bg">
      <View className="flex-1 px-6 pt-6">
        <Text className="text-2xl font-bold text-gold">
          {STRINGS.tabs.quests}
        </Text>
        <Text className="mt-2 text-text-muted">
          [Phase 5에서 일일/주간/커스텀 탭 구현]
        </Text>
      </View>
    </SafeAreaView>
  );
}
