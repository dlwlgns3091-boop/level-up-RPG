import Svg, { Rect } from "react-native-svg";

type Props = {
  size?: number;
};

/** Generated from design_handoff_lifequest/sprites.svg.html (#icon-flag) */
export function FlagIcon({ size = 16 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16">
      <Rect x={4} y={2} width={1} height={12} fill="#3A2E1F" />
      <Rect x={5} y={2} width={7} height={1} fill="#3A2E1F" />
      <Rect x={12} y={3} width={1} height={5} fill="#3A2E1F" />
      <Rect x={5} y={8} width={7} height={1} fill="#3A2E1F" />
      <Rect x={5} y={3} width={7} height={5} fill="#FF7B7B" />
      <Rect x={6} y={4} width={2} height={1} fill="#FFB5B5" />
      <Rect x={9} y={5} width={2} height={2} fill="#FFD66B" />
      <Rect x={3} y={14} width={3} height={1} fill="#3A2E1F" />
    </Svg>
  );
}
