import Svg, { Rect } from "react-native-svg";

type Props = {
  size?: number;
};

/** Generated from design_handoff_lifequest/sprites.svg.html (#icon-sun) */
export function SunIcon({ size = 16 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16">
      <Rect x={6} y={4} width={4} height={1} fill="#3A2E1F" />
      <Rect x={5} y={5} width={6} height={1} fill="#3A2E1F" />
      <Rect x={4} y={6} width={8} height={4} fill="#3A2E1F" />
      <Rect x={5} y={10} width={6} height={1} fill="#3A2E1F" />
      <Rect x={6} y={11} width={4} height={1} fill="#3A2E1F" />
      <Rect x={6} y={5} width={4} height={1} fill="#FFD66B" />
      <Rect x={5} y={6} width={6} height={4} fill="#FFD66B" />
      <Rect x={6} y={10} width={4} height={1} fill="#FFD66B" />
      <Rect x={6} y={6} width={2} height={2} fill="#FFE4A0" />
      <Rect x={7} y={1} width={2} height={2} fill="#FFD66B" />
      <Rect x={7} y={13} width={2} height={2} fill="#FFD66B" />
      <Rect x={1} y={7} width={2} height={2} fill="#FFD66B" />
      <Rect x={13} y={7} width={2} height={2} fill="#FFD66B" />
      <Rect x={2} y={2} width={2} height={2} fill="#FFD66B" />
      <Rect x={12} y={2} width={2} height={2} fill="#FFD66B" />
      <Rect x={2} y={12} width={2} height={2} fill="#FFD66B" />
      <Rect x={12} y={12} width={2} height={2} fill="#FFD66B" />
    </Svg>
  );
}
