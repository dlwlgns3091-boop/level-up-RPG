import Svg, { Rect } from "react-native-svg";

type Props = {
  size?: number;
};

/** Generated from design_handoff_lifequest/sprites.svg.html (#icon-trophy) */
export function TrophyIcon({ size = 16 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16">
      <Rect x={4} y={2} width={8} height={1} fill="#3A2E1F" />
      <Rect x={3} y={3} width={10} height={1} fill="#3A2E1F" />
      <Rect x={4} y={3} width={8} height={1} fill="#FFD66B" />
      <Rect x={3} y={4} width={1} height={4} fill="#3A2E1F" />
      <Rect x={12} y={4} width={1} height={4} fill="#3A2E1F" />
      <Rect x={4} y={4} width={8} height={4} fill="#FFD66B" />
      <Rect x={4} y={5} width={2} height={2} fill="#FFE4A0" />
      <Rect x={1} y={5} width={2} height={3} fill="#3A2E1F" />
      <Rect x={13} y={5} width={2} height={3} fill="#3A2E1F" />
      <Rect x={2} y={6} width={1} height={1} fill="#FFD66B" />
      <Rect x={13} y={6} width={1} height={1} fill="#FFD66B" />
      <Rect x={4} y={8} width={8} height={1} fill="#E8A83C" />
      <Rect x={3} y={8} width={1} height={1} fill="#3A2E1F" />
      <Rect x={12} y={8} width={1} height={1} fill="#3A2E1F" />
      <Rect x={5} y={9} width={6} height={1} fill="#3A2E1F" />
      <Rect x={6} y={9} width={4} height={1} fill="#E8A83C" />
      <Rect x={7} y={10} width={2} height={2} fill="#3A2E1F" />
      <Rect x={4} y={12} width={8} height={1} fill="#3A2E1F" />
      <Rect x={4} y={12} width={8} height={1} fill="#8B5E3C" />
      <Rect x={3} y={13} width={10} height={1} fill="#3A2E1F" />
    </Svg>
  );
}
