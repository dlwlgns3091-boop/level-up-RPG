import Svg, { Rect } from "react-native-svg";

type Props = {
  size?: number;
};

/** Generated from design_handoff_lifequest/sprites.svg.html (#char-knight) */
export function KnightSprite({ size = 64 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x={8} y={2} width={8} height={2} fill="#D4D4D4" />
      <Rect x={7} y={4} width={10} height={6} fill="#D4D4D4" />
      <Rect x={8} y={3} width={1} height={1} fill="#FFFFFF" />
      <Rect x={9} y={2} width={1} height={1} fill="#FFFFFF" />
      <Rect x={11} y={0} width={2} height={2} fill="#FF7B7B" />
      <Rect x={11} y={2} width={2} height={1} fill="#E85A5A" />
      <Rect x={9} y={7} width={6} height={1} fill="#3A2E1F" />
      <Rect x={10} y={7} width={1} height={1} fill="#FFFFFF" />
      <Rect x={13} y={7} width={1} height={1} fill="#FFFFFF" />
      <Rect x={6} y={10} width={12} height={2} fill="#B8B8B8" />
      <Rect x={5} y={10} width={1} height={3} fill="#B8B8B8" />
      <Rect x={18} y={10} width={1} height={3} fill="#B8B8B8" />
      <Rect x={7} y={12} width={10} height={7} fill="#D4D4D4" />
      <Rect x={3} y={13} width={4} height={6} fill="#6BAEE8" />
      <Rect x={4} y={12} width={2} height={1} fill="#6BAEE8" />
      <Rect x={4} y={19} width={2} height={1} fill="#6BAEE8" />
      <Rect x={4} y={15} width={1} height={2} fill="#FFD66B" />
      <Rect x={5} y={14} width={1} height={4} fill="#FFD66B" />
      <Rect x={18} y={11} width={1} height={8} fill="#E8E8E8" />
      <Rect x={17} y={19} width={3} height={1} fill="#8B5E3C" />
      <Rect x={8} y={21} width={3} height={2} fill="#5A3A2A" />
      <Rect x={13} y={21} width={3} height={2} fill="#5A3A2A" />
    </Svg>
  );
}
