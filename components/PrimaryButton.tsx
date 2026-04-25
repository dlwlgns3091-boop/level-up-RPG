import { type ReactNode, useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { COLORS } from "@/constants/theme";
import {
  PIXEL_BORDER_WIDTH,
  PIXEL_FONT,
  PIXEL_RADIUS,
  steppedShadow,
} from "./pixelStyles";

type Variant = "primary" | "secondary" | "ghost";

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  leftIcon?: ReactNode;
};

type VariantStyle = {
  bg: string;
  label: string;
  border: string;
};

const VARIANT_STYLE: Record<Variant, VariantStyle> = {
  primary: {
    bg: COLORS.gold,
    label: COLORS.ink,
    border: COLORS.ink,
  },
  secondary: {
    bg: COLORS.bgSoft,
    label: COLORS.text,
    border: COLORS.ink,
  },
  ghost: {
    bg: "transparent",
    label: COLORS.textMuted,
    border: "transparent",
  },
};

const PRESS_TRANSLATE = 3;
const PRESS_DURATION = 80;

export function PrimaryButton({
  label,
  onPress,
  variant = "primary",
  disabled = false,
  leftIcon,
}: Props) {
  const v = VARIANT_STYLE[variant];
  const translateY = useRef(new Animated.Value(0)).current;

  const animatePress = (toValue: number) =>
    Animated.timing(translateY, {
      toValue,
      duration: PRESS_DURATION,
      useNativeDriver: true,
    }).start();

  const isGhost = variant === "ghost";
  const showShadow = !isGhost && !disabled;

  return (
    <Animated.View style={{ transform: [{ translateY }] }}>
      <Pressable
        onPress={disabled ? undefined : onPress}
        onPressIn={disabled ? undefined : () => animatePress(PRESS_TRANSLATE)}
        onPressOut={disabled ? undefined : () => animatePress(0)}
        style={{
          backgroundColor: disabled ? COLORS.bgSofter : v.bg,
          borderWidth: isGhost ? 0 : PIXEL_BORDER_WIDTH,
          borderColor: v.border,
          borderRadius: PIXEL_RADIUS.md,
          paddingHorizontal: 20,
          paddingVertical: 14,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          opacity: disabled ? 0.6 : 1,
          ...(showShadow ? steppedShadow(4) : null),
        }}
      >
        {leftIcon ? <View style={{ marginRight: 8 }}>{leftIcon}</View> : null}
        <Text
          style={{
            fontFamily: PIXEL_FONT.uiBold,
            fontSize: 16,
            color: disabled ? COLORS.textMuted : v.label,
            letterSpacing: 0.5,
          }}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
