import Svg, { Rect } from "react-native-svg";

type Props = {
  size?: number;
};

/** Generated from design_handoff_lifequest/sprites.svg.html (#char-archer) */
export function ArcherSprite({ size = 64 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x={9} y={2} width={6} height={2} fill="#7EC96A" />
      <Rect x={8} y={4} width={8} height={4} fill="#7EC96A" />
      <Rect x={7} y={5} width={1} height={3} fill="#7EC96A" />
      <Rect x={16} y={5} width={1} height={3} fill="#7EC96A" />
      <Rect x={9} y={8} width={6} height={4} fill="#FFE0C4" />
      <Rect x={8} y={9} width={1} height={2} fill="#FFE0C4" />
      <Rect x={9} y={10} width={1} height={1} fill="#FFB5B5" />
      <Rect x={14} y={10} width={1} height={1} fill="#FFB5B5" />
      <Rect x={10} y={9} width={1} height={2} fill="#3A2E1F" />
      <Rect x={13} y={9} width={1} height={2} fill="#3A2E1F" />
      <Rect x={10} y={9} width={1} height={1} fill="#FFFFFF" />
      <Rect x={13} y={9} width={1} height={1} fill="#FFFFFF" />
      <Rect x={11} y={11} width={2} height={1} fill="#3A2E1F" />
      <Rect x={8} y={12} width={8} height={7} fill="#7EC96A" />
      <Rect x={11} y={13} width={2} height={4} fill="#5A8A3A" />
      <Rect x={4} y={10} width={1} height={10} fill="#8B5E3C" />
      <Rect x={5} y={10} width={1} height={1} fill="#8B5E3C" />
      <Rect x={5} y={19} width={1} height={1} fill="#8B5E3C" />
      <Rect x={5} y={14} width={3} height={1} fill="#E8E8E8" />
      <Rect x={8} y={21} width={3} height={2} fill="#5A3A2A" />
      <Rect x={13} y={21} width={3} height={2} fill="#5A3A2A" />
    </Svg>
  );
}
