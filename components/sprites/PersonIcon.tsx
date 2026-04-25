import Svg, { Rect } from "react-native-svg";

type Props = {
  size?: number;
};

/** Generated from design_handoff_lifequest/sprites.svg.html (#icon-person) */
export function PersonIcon({ size = 16 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16">
      <Rect x={6} y={3} width={4} height={4} fill="#3A2E1F" />
      <Rect x={6} y={3} width={4} height={4} fill="#FFE0C4" />
      <Rect x={5} y={4} width={1} height={2} fill="#3A2E1F" />
      <Rect x={10} y={4} width={1} height={2} fill="#3A2E1F" />
      <Rect x={6} y={3} width={4} height={1} fill="#3A2E1F" />
      <Rect x={6} y={5} width={1} height={1} fill="#3A2E1F" />
      <Rect x={9} y={5} width={1} height={1} fill="#3A2E1F" />
      <Rect x={6} y={3} width={4} height={2} fill="#8B5E3C" />
      <Rect x={5} y={4} width={1} height={1} fill="#8B5E3C" />
      <Rect x={10} y={4} width={1} height={1} fill="#8B5E3C" />
      <Rect x={4} y={8} width={8} height={6} fill="#6BAEE8" />
      <Rect x={3} y={9} width={1} height={5} fill="#3A2E1F" />
      <Rect x={12} y={9} width={1} height={5} fill="#3A2E1F" />
      <Rect x={4} y={8} width={8} height={1} fill="#3A2E1F" />
      <Rect x={4} y={14} width={8} height={1} fill="#3A2E1F" />
    </Svg>
  );
}
