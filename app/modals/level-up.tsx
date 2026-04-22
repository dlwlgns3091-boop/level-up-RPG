import { Text, View } from "react-native";

export default function LevelUp() {
  return (
    <View className="flex-1 items-center justify-center bg-black/70">
      <View className="rounded-3xl bg-bg-soft p-8">
        <Text className="text-2xl font-bold text-gold">레벨 업!</Text>
        <Text className="mt-2 text-text-muted">
          [Phase 4에서 연출 + 포인트 안내 구현]
        </Text>
      </View>
    </View>
  );
}
