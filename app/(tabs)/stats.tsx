import { useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton } from "@/components/PrimaryButton";
import { RadarChart } from "@/components/RadarChart";
import { StatAllocatorRow } from "@/components/StatAllocatorRow";
import { STRINGS } from "@/constants/strings.ko";
import { type StatKey } from "@/constants/theme";
import { useCharacterStore } from "@/store/useCharacterStore";

const STAT_KEYS: readonly StatKey[] = [
  "str",
  "int",
  "wis",
  "dex",
  "con",
  "cha",
] as const;

type Pending = Record<StatKey, number>;

const EMPTY_PENDING: Pending = {
  str: 0,
  int: 0,
  wis: 0,
  dex: 0,
  con: 0,
  cha: 0,
};

export default function Stats() {
  const character = useCharacterStore((s) => s.character);
  const allocate = useCharacterStore((s) => s.allocateStatPoints);

  const [pending, setPending] = useState<Pending>(EMPTY_PENDING);

  const baseStats: Record<StatKey, number> = useMemo(() => {
    if (!character) {
      return { str: 0, int: 0, wis: 0, dex: 0, con: 0, cha: 0 };
    }
    return {
      str: character.str,
      int: character.int,
      wis: character.wis,
      dex: character.dex,
      con: character.con,
      cha: character.cha,
    };
  }, [character]);

  const totalPending = STAT_KEYS.reduce<number>(
    (sum, k) => sum + pending[k],
    0,
  );
  const available = character
    ? character.unspent_stat_points - totalPending
    : 0;

  const inc = (k: StatKey) => {
    if (available <= 0) return;
    setPending((p) => ({ ...p, [k]: p[k] + 1 }));
  };
  const dec = (k: StatKey) => {
    setPending((p) => (p[k] <= 0 ? p : { ...p, [k]: p[k] - 1 }));
  };
  const reset = () => setPending(EMPTY_PENDING);
  const confirm = () => {
    if (totalPending === 0 || !character) return;
    allocate(pending);
    setPending(EMPTY_PENDING);
  };

  if (!character) {
    return (
      <SafeAreaView className="flex-1 bg-bg">
        <View className="flex-1 items-center justify-center">
          <Text className="text-text-muted">캐릭터를 불러오는 중…</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top", "left", "right"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      >
        <Text className="mb-2 text-2xl font-bold text-gold">
          {STRINGS.stats.title}
        </Text>

        <View className="mb-4 rounded-2xl border border-bg-softer bg-bg-soft p-4">
          <RadarChart stats={baseStats} pending={pending} />
        </View>

        <View className="mb-3 flex-row items-center justify-between rounded-2xl border border-bg-softer bg-bg-soft p-3">
          <Text className="text-sm text-text-muted">
            {STRINGS.stats.unspentPoints(character.unspent_stat_points)}
          </Text>
          <Text className="text-sm font-semibold text-gold">
            사용 가능 {available}
          </Text>
        </View>

        {STAT_KEYS.map((k) => (
          <StatAllocatorRow
            key={k}
            stat={k}
            base={baseStats[k]}
            pending={pending[k]}
            canIncrement={available > 0}
            onIncrement={() => inc(k)}
            onDecrement={() => dec(k)}
          />
        ))}

        <View className="mt-4 flex-row">
          <View className="mr-2 flex-1">
            <PrimaryButton
              label={STRINGS.common.cancel}
              variant="secondary"
              disabled={totalPending === 0}
              onPress={reset}
            />
          </View>
          <View className="flex-1">
            <PrimaryButton
              label={`${STRINGS.common.confirm} (+${totalPending})`}
              disabled={totalPending === 0}
              onPress={confirm}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
