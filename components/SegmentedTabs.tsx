import { Pressable, Text, View } from "react-native";

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
    <View className="flex-row rounded-2xl border border-bg-softer bg-bg-soft p-1">
      {options.map((opt) => {
        const active = opt.key === value;
        return (
          <Pressable
            key={opt.key}
            onPress={() => onChange(opt.key)}
            className={`flex-1 items-center justify-center rounded-xl px-3 py-2 ${
              active ? "bg-gold" : "bg-transparent active:opacity-70"
            }`}
          >
            <Text
              className={`text-sm font-semibold ${
                active ? "text-bg" : "text-text-muted"
              }`}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
