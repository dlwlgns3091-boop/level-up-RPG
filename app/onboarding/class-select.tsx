import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ClassCard } from "@/components/ClassCard";
import { PrimaryButton } from "@/components/PrimaryButton";
import { CLASSES } from "@/constants/classes";
import { STRINGS } from "@/constants/strings.ko";
import type { ClassKey } from "@/constants/theme";

export default function ClassSelect() {
  const router = useRouter();
  const [selected, setSelected] = useState<ClassKey | null>(null);

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <View className="px-6 pt-6 pb-4">
        <Text className="text-2xl font-bold text-text">
          {STRINGS.onboarding.classSelectTitle}
        </Text>
        <Text className="mt-2 text-sm text-text-muted">
          {STRINGS.onboarding.classSelectSubtitle}
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        {CLASSES.map((def) => (
          <ClassCard
            key={def.key}
            def={def}
            selected={selected === def.key}
            onPress={() => setSelected(def.key)}
          />
        ))}
      </ScrollView>

      <View className="border-t border-bg-softer bg-bg px-6 pt-4 pb-6">
        <PrimaryButton
          label="다음"
          disabled={!selected}
          onPress={() => {
            if (!selected) return;
            router.push({
              pathname: "/onboarding/character-create",
              params: { class: selected },
            });
          }}
        />
      </View>
    </SafeAreaView>
  );
}
