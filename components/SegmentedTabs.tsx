import { Pressable, Text, View } from "react-native";
import { COLORS } from "@/constants/theme";
import {
  PIXEL_BORDER_WIDTH,
  PIXEL_FONT,
  PIXEL_RADIUS,
} from "./pixelStyles";

export type SegmentOption<K extends string> = {
  key: K;
  label: string;
};

type Props<K extends string> = {
  options: readonly SegmentOption<K>[];
  value: K;
  onChange: (next: K) => void;
};

export function SegmentedTabs<K extends string>({
  options,
  value,
  onChange,
}: Props<K>) {
  return (
    <View
      style={{
        flexDirection: "row",
        padding: 4,
        borderRadius: PIXEL_RADIUS.lg,
        borderWidth: PIXEL_BORDER_WIDTH,
        borderColor: COLORS.ink,
        backgroundColor: COLORS.bgSoft,
      }}
    >
      {options.map((opt) => {
        const active = opt.key === value;
        return (
          <Pressable
            key={opt.key}
            onPress={() => onChange(opt.key)}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: PIXEL_RADIUS.md,
              backgroundColor: active ? COLORS.gold : "transparent",
            }}
          >
            <Text
              style={{
                fontFamily: PIXEL_FONT.uiBold,
                fontSize: 12,
                color: active ? COLORS.ink : COLORS.textMuted,
                letterSpacing: 0.3,
              }}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
