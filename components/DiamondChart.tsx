import { View } from "react-native";
import Svg, { Circle, Line, Polygon, Text as SvgText } from "react-native-svg";
import { CATEGORIES } from "@/constants/categories";
import { COLORS } from "@/constants/theme";
import { PIXEL_FONT } from "@/components/pixelStyles";
import type { CategoryXP } from "@/types/category";

type Props = {
  stats: CategoryXP;
  size?: number;
};

const VERTEX_ORDER = ["exercise", "study", "creative", "productivity"] as const;
//  운동(top), 공부(right), 창작(bottom), 생산성(left)

const ANGLES_DEG = [-90, 0, 90, 180] as const;

function angleRad(idx: number): number {
  const deg = ANGLES_DEG[idx] ?? 0;
  return (deg * Math.PI) / 180;
}

export function DiamondChart({ stats, size = 240 }: Props) {
  const padding = 36;
  const radius = size / 2 - padding;
  const cx = size / 2;
  const cy = size / 2;

  const maxStat = Math.max(
    30,
    ...VERTEX_ORDER.map((k) => stats[k]),
  );

  const ringFractions = [0.25, 0.5, 0.75, 1];

  const ringPolygons = ringFractions.map((frac) =>
    VERTEX_ORDER.map((_, i) => {
      const a = angleRad(i);
      const r = radius * frac;
      return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
    }).join(" "),
  );

  const dataPolygonPoints = VERTEX_ORDER.map((key, i) => {
    const a = angleRad(i);
    const value = stats[key];
    const r = (Math.min(value, maxStat) / maxStat) * radius;
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(" ");

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

        {VERTEX_ORDER.map((_, i) => {
          const a = angleRad(i);
          return (
            <Line
              key={i}
              x1={cx}
              y1={cy}
              x2={cx + radius * Math.cos(a)}
              y2={cy + radius * Math.sin(a)}
              stroke={COLORS.ink}
              strokeWidth={1}
            />
          );
        })}

        <Polygon
          points={dataPolygonPoints}
          fill={`${COLORS.gold}33`}
          stroke={COLORS.gold}
          strokeWidth={2}
        />

        {VERTEX_ORDER.map((key, i) => {
          const a = angleRad(i);
          const value = stats[key];
          const r = (Math.min(value, maxStat) / maxStat) * radius;
          return (
            <Circle
              key={`dot-${key}`}
              cx={cx + r * Math.cos(a)}
              cy={cy + r * Math.sin(a)}
              r={4}
              fill={COLORS.category[key]}
            />
          );
        })}

        {VERTEX_ORDER.map((key, i) => {
          const a = angleRad(i);
          const lr = radius + 20;
          const def = CATEGORIES.find((c) => c.key === key);
          return (
            <SvgText
              key={`label-${key}`}
              x={cx + lr * Math.cos(a)}
              y={cy + lr * Math.sin(a)}
              fill={COLORS.category[key]}
              fontSize={12}
              fontFamily={PIXEL_FONT.uiBold}
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {`${def?.emoji ?? ""} ${def?.nameKo ?? key}`}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
}
