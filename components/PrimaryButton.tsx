import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

type Variant = "primary" | "secondary" | "ghost";

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  leftIcon?: ReactNode;
};

const VARIANT_CLASSES: Record<
  Variant,
  { container: string; label: string; disabled: string }
> = {
  primary: {
    container: "bg-gold",
    label: "text-bg",
    disabled: "bg-bg-softer",
  },
  secondary: {
    container: "bg-bg-soft border border-bg-softer",
    label: "text-text",
    disabled: "opacity-50",
  },
  ghost: {
    container: "bg-transparent",
    label: "text-text-muted",
    disabled: "opacity-50",
  },
};

export function PrimaryButton({
  label,
  onPress,
  variant = "primary",
  disabled = false,
  leftIcon,
}: Props) {
  const v = VARIANT_CLASSES[variant];
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      className={`flex-row items-center justify-center rounded-2xl px-6 py-4 active:opacity-80 ${v.container} ${disabled ? v.disabled : ""}`}
    >
      {leftIcon ? <View className="mr-2">{leftIcon}</View> : null}
      <Text className={`text-base font-bold ${v.label}`}>{label}</Text>
    </Pressable>
  );
}
