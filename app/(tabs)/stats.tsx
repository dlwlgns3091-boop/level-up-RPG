import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { STRINGS } from "@/constants/strings.ko";

export default function Stats() {
  return (
    <SafeAreaView className="flex-1 bg-bg">
      <View className="flex-1 px-6 pt-6">
        <Text className="text-2xl font-bold text-gold">
          {STRINGS.stats.title}
        </Text>
        <Text className="mt-2 text-text-muted">
          [Phase 6에서 6각형 레이더 차트 + 포인트 분배 UI 구현]
        </Text>
      </View>
    </SafeAreaView>
  );
}
