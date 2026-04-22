import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { STRINGS } from "@/constants/strings.ko";

export default function ClassSelect() {
  return (
    <SafeAreaView className="flex-1 bg-bg">
      <View className="flex-1 px-6 pt-8">
        <Text className="text-2xl font-bold text-text">
          {STRINGS.onboarding.classSelectTitle}
        </Text>
        <Text className="mt-2 text-sm text-text-muted">
          {STRINGS.onboarding.classSelectSubtitle}
        </Text>
        <View className="mt-8 items-center">
          <Text className="text-text-muted">[Phase 3에서 직업 카드 UI 구현]</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
