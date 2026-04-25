import Svg, { Rect } from "react-native-svg";

type Props = {
  size?: number;
};

/** Generated from design_handoff_lifequest/sprites.svg.html (#char-slime) */
export function SlimeSprite({ size = 64 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x={8} y={10} width={8} height={1} fill="#7EC96A" />
      <Rect x={6} y={11} width={12} height={1} fill="#7EC96A" />
      <Rect x={5} y={12} width={14} height={6} fill="#7EC96A" />
      <Rect x={4} y={15} width={16} height={4} fill="#7EC96A" />
      <Rect x={5} y={19} width={14} height={1} fill="#5A8A3A" />
      <Rect x={4} y={18} width={1} height={1} fill="#5A8A3A" />
      <Rect x={19} y={18} width={1} height={1} fill="#5A8A3A" />
      <Rect x={7} y={12} width={2} height={2} fill="#C5E8B8" />
      <Rect x={6} y={13} width={1} height={2} fill="#C5E8B8" />
      <Rect x={9} y={14} width={2} height={2} fill="#3A2E1F" />
      <Rect x={13} y={14} width={2} height={2} fill="#3A2E1F" />
      <Rect x={9} y={14} width={1} height={1} fill="#FFFFFF" />
      <Rect x={13} y={14} width={1} height={1} fill="#FFFFFF" />
      <Rect x={10} y={17} width={4} height={1} fill="#3A2E1F" />
      <Rect x={11} y={18} width={2} height={1} fill="#FFB5B5" />
    </Svg>
  );
}
