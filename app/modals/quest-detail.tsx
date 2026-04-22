import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function QuestDetail() {
  return (
    <SafeAreaView className="flex-1 bg-bg">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-xl font-bold text-text">퀘스트 상세</Text>
        <Text className="mt-2 text-text-muted">
          [Phase 4에서 상세/완료 UI 구현]
        </Text>
      </View>
    </SafeAreaView>
  );
}
