import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { STAT_LABELS_KO } from "@/constants/classes";
import { COLORS, type StatKey } from "@/constants/theme";

type Props = {
  stat: StatKey;
  base: number;
  pending: number;
  canIncrement: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
};

export function StatAllocatorRow({
  stat,
  base,
  pending,
  canIncrement,
  onIncrement,
  onDecrement,
}: Props) {
  const color = COLORS.stat[stat];
  const total = base + pending;

  return (
    <View className="mb-2 flex-row items-center rounded-2xl border border-bg-softer bg-bg-soft p-3">
      <View
        className="mr-3 h-9 w-9 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${color}33` }}
      >
        <Text className="text-sm font-bold" style={{ color }}>
          {stat.toUpperCase()}
        </Text>
      </View>

      <View className="flex-1">
        <Text className="text-sm text-text-muted">
          {STAT_LABELS_KO[stat]}
        </Text>
        <Text className="text-lg font-bold text-text">
          {total}
          {pending > 0 ? (
            <Text className="text-sm font-semibold text-gold">
              {" "}
              (+{pending})
            </Text>
          ) : null}
        </Text>
      </View>

      <View className="flex-row items-center">
        <IconButton
          icon="remove"
          disabled={pending <= 0}
          onPress={onDecrement}
        />
        <View className="w-2" />
        <IconButton
          icon="add"
          disabled={!canIncrement}
          onPress={onIncrement}
        />
      </View>
    </View>
  );
}

function IconButton({
  icon,
  disabled,
  onPress,
}: {
  icon: "add" | "remove";
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      className={`h-10 w-10 items-center justify-center rounded-xl ${
        disabled ? "bg-bg-softer" : "bg-gold active:opacity-80"
      }`}
    >
      <Ionicons
        name={icon}
        size={20}
        color={disabled ? COLORS.textMuted : COLORS.bg}
      />
    </Pressable>
  );
}
