import Svg, { Rect } from "react-native-svg";

type Props = {
  size?: number;
};

/** Generated from design_handoff_lifequest/sprites.svg.html (#icon-potion) */
export function PotionIcon({ size = 16 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16">
      <Rect x={6} y={2} width={4} height={1} fill="#3A2E1F" />
      <Rect x={6} y={3} width={4} height={1} fill="#8B5E3C" />
      <Rect x={6} y={4} width={1} height={2} fill="#3A2E1F" />
      <Rect x={9} y={4} width={1} height={2} fill="#3A2E1F" />
      <Rect x={7} y={4} width={2} height={2} fill="#C8E2F5" />
      <Rect x={5} y={6} width={1} height={1} fill="#3A2E1F" />
      <Rect x={10} y={6} width={1} height={1} fill="#3A2E1F" />
      <Rect x={4} y={7} width={1} height={1} fill="#3A2E1F" />
      <Rect x={11} y={7} width={1} height={1} fill="#3A2E1F" />
      <Rect x={3} y={8} width={1} height={5} fill="#3A2E1F" />
      <Rect x={12} y={8} width={1} height={5} fill="#3A2E1F" />
      <Rect x={4} y={13} width={1} height={1} fill="#3A2E1F" />
      <Rect x={11} y={13} width={1} height={1} fill="#3A2E1F" />
      <Rect x={5} y={14} width={6} height={1} fill="#3A2E1F" />
      <Rect x={6} y={6} width={4} height={1} fill="#6BAEE8" />
      <Rect x={5} y={7} width={6} height={1} fill="#6BAEE8" />
      <Rect x={4} y={8} width={8} height={5} fill="#6BAEE8" />
      <Rect x={5} y={13} width={6} height={1} fill="#6BAEE8" />
      <Rect x={5} y={8} width={1} height={3} fill="#8FCFFF" />
      <Rect x={6} y={8} width={1} height={1} fill="#8FCFFF" />
    </Svg>
  );
}
