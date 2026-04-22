import { Text as RNText, View } from "react-native";
import Svg, {
  Circle,
  Line,
  Polygon,
  Text as SvgText,
} from "react-native-svg";
import { STAT_LABELS_KO } from "@/constants/classes";
import { COLORS, type StatKey } from "@/constants/theme";

const STAT_ORDER: readonly StatKey[] = [
  "str",
  "int",
  "wis",
  "dex",
  "con",
  "cha",
] as const;

type Props = {
  stats: Record<StatKey, number>;
  pending?: Partial<Record<StatKey, number>>;
  size?: number;
};

/** 각도를 라디안으로 변환 (top 기준). */
function angleRad(index: number, total: number): number {
  return ((index / total) * 2 * Math.PI) - Math.PI / 2;
}

export function RadarChart({ stats, pending, size = 260 }: Props) {
  const padding = 36;
  const radius = size / 2 - padding;
  const cx = size / 2;
  const cy = size / 2;
  const total = STAT_ORDER.length;

  const maxStat = Math.max(
    30,
    ...STAT_ORDER.map(
      (k) => (stats[k] ?? 0) + (pending?.[k] ?? 0),
    ),
  );

  const ringFractions = [0.25, 0.5, 0.75, 1];

  const axisEndpoints = STAT_ORDER.map((_, i) => {
    const a = angleRad(i, total);
    return { x: cx + radius * Math.cos(a), y: cy + radius * Math.sin(a) };
  });

  const ringPolygons = ringFractions.map((frac) => {
    const points = STAT_ORDER.map((_, i) => {
      const a = angleRad(i, total);
      const r = radius * frac;
      return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
    }).join(" ");
    return points;
  });

  const basePolygonPoints = STAT_ORDER.map((key, i) => {
    const a = angleRad(i, total);
    const value = stats[key] ?? 0;
    const r = (Math.min(value, maxStat) / maxStat) * radius;
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(" ");

  const showPending =
    pending &&
    STAT_ORDER.some((key) => (pending[key] ?? 0) > 0);

  const pendingPolygonPoints = showPending
    ? STAT_ORDER.map((key, i) => {
        const a = angleRad(i, total);
        const value = (stats[key] ?? 0) + (pending?.[key] ?? 0);
        const r = (Math.min(value, maxStat) / maxStat) * radius;
        return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
      }).join(" ")
    : null;

  const labelPositions = STAT_ORDER.map((key, i) => {
    const a = angleRad(i, total);
    const lr = radius + 18;
    return {
      key,
      x: cx + lr * Math.cos(a),
      y: cy + lr * Math.sin(a),
    };
  });

  return (
    <View className="items-center">
      <Svg width={size} height={size}>
        {ringPolygons.map((points, idx) => (
          <Polygon
            key={idx}
            points={points}
            fill="none"
            stroke={COLORS.bgSofter}
            strokeWidth={1}
          />
        ))}

        {axisEndpoints.map((p, idx) => (
          <Line
            key={idx}
            x1={cx}
            y1={cy}
            x2={p.x}
            y2={p.y}
            stroke={COLORS.bgSofter}
            strokeWidth={1}
          />
        ))}

        <Polygon
          points={basePolygonPoints}
          fill={`${COLORS.gold}33`}
          stroke={COLORS.gold}
          strokeWidth={2}
        />

        {pendingPolygonPoints ? (
          <Polygon
            points={pendingPolygonPoints}
            fill="none"
            stroke={COLORS.gold}
            strokeWidth={1.5}
            strokeDasharray="4 4"
          />
        ) : null}

        {STAT_ORDER.map((key, i) => {
          const a = angleRad(i, total);
          const value = stats[key] ?? 0;
          const r = (Math.min(value, maxStat) / maxStat) * radius;
          return (
            <Circle
              key={key}
              cx={cx + r * Math.cos(a)}
              cy={cy + r * Math.sin(a)}
              r={3}
              fill={COLORS.stat[key]}
            />
          );
        })}

        {labelPositions.map(({ key, x, y }) => (
          <SvgText
            key={key}
            x={x}
            y={y}
            fill={COLORS.stat[key]}
            fontSize={12}
            fontWeight="bold"
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            {STAT_LABELS_KO[key]}
          </SvgText>
        ))}
      </Svg>

      <RNText className="mt-2 text-[10px] text-text-muted">
        최대 기준: {maxStat}
      </RNText>
    </View>
  );
}
