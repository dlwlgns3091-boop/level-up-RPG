import { ActivityIndicator, Text, View } from "react-native";
import { COLORS } from "@/constants/theme";

type Props = {
  /** "small" | "large" — RN ActivityIndicator. */
  size?: "small" | "large";
  label?: string;
};

export function Spinner({ size = "small", label }: Props) {
  return (
    <View className="flex-row items-center justify-center">
      <ActivityIndicator size={size} color={COLORS.gold} />
      {label ? (
        <Text className="ml-2 text-sm text-text-muted">{label}</Text>
      ) : null}
    </View>
  );
}

export function CenteredSpinner({ size = "large", label }: Props) {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size={size} color={COLORS.gold} />
      {label ? (
        <Text className="mt-3 text-sm text-text-muted">{label}</Text>
      ) : null}
    </View>
  );
}
