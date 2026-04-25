import Svg, { Rect } from "react-native-svg";

type Props = {
  size?: number;
};

/** Generated from design_handoff_lifequest/sprites.svg.html (#icon-sword) */
export function SwordIcon({ size = 16 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16">
      <Rect x={7} y={1} width={2} height={1} fill="#3A2E1F" />
      <Rect x={6} y={2} width={1} height={8} fill="#3A2E1F" />
      <Rect x={9} y={2} width={1} height={8} fill="#3A2E1F" />
      <Rect x={7} y={2} width={2} height={8} fill="#E8E8E8" />
      <Rect x={7} y={2} width={1} height={7} fill="#FFFFFF" />
      <Rect x={3} y={10} width={10} height={1} fill="#3A2E1F" />
      <Rect x={3} y={11} width={10} height={1} fill="#FFD66B" />
      <Rect x={3} y={12} width={10} height={1} fill="#3A2E1F" />
      <Rect x={7} y={13} width={2} height={2} fill="#8B5E3C" />
      <Rect x={6} y={13} width={1} height={2} fill="#3A2E1F" />
      <Rect x={9} y={13} width={1} height={2} fill="#3A2E1F" />
    </Svg>
  );
}
