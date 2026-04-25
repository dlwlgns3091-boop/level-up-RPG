import Svg, { Rect } from "react-native-svg";

type Props = {
  size?: number;
};

/** Generated from design_handoff_lifequest/sprites.svg.html (#icon-coin) */
export function CoinIcon({ size = 16 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16">
      <Rect x={5} y={3} width={6} height={1} fill="#3A2E1F" />
      <Rect x={4} y={4} width={1} height={1} fill="#3A2E1F" />
      <Rect x={11} y={4} width={1} height={1} fill="#3A2E1F" />
      <Rect x={3} y={5} width={1} height={6} fill="#3A2E1F" />
      <Rect x={12} y={5} width={1} height={6} fill="#3A2E1F" />
      <Rect x={4} y={11} width={1} height={1} fill="#3A2E1F" />
      <Rect x={11} y={11} width={1} height={1} fill="#3A2E1F" />
      <Rect x={5} y={12} width={6} height={1} fill="#3A2E1F" />
      <Rect x={5} y={4} width={6} height={1} fill="#FFD66B" />
      <Rect x={4} y={5} width={8} height={6} fill="#FFD66B" />
      <Rect x={5} y={11} width={6} height={1} fill="#E8A83C" />
      <Rect x={5} y={5} width={2} height={1} fill="#FFE4A0" />
      <Rect x={5} y={6} width={1} height={2} fill="#FFE4A0" />
      <Rect x={7} y={6} width={2} height={1} fill="#3A2E1F" />
      <Rect x={6} y={7} width={1} height={1} fill="#3A2E1F" />
      <Rect x={7} y={8} width={2} height={1} fill="#3A2E1F" />
      <Rect x={9} y={9} width={1} height={1} fill="#3A2E1F" />
      <Rect x={7} y={10} width={2} height={1} fill="#3A2E1F" />
    </Svg>
  );
}
