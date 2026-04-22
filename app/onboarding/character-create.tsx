import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { STRINGS } from "@/constants/strings.ko";

export default function CharacterCreate() {
  return (
    <SafeAreaView className="flex-1 bg-bg">
      <View className="flex-1 px-6 pt-8">
        <Text className="text-2xl font-bold text-text">
          {STRINGS.onboarding.nameInputTitle}
        </Text>
        <View className="mt-8 items-center">
          <Text className="text-text-muted">
            [Phase 3에서 이름 입력 + 캐릭터 INSERT 구현]
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
