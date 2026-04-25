import Svg, { Rect } from "react-native-svg";

type Props = {
  size?: number;
};

/** Generated from design_handoff_lifequest/sprites.svg.html (#icon-key) */
export function KeyIcon({ size = 16 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16">
      <Rect x={3} y={4} width={4} height={1} fill="#3A2E1F" />
      <Rect x={2} y={5} width={1} height={4} fill="#3A2E1F" />
      <Rect x={7} y={5} width={1} height={4} fill="#3A2E1F" />
      <Rect x={3} y={9} width={4} height={1} fill="#3A2E1F" />
      <Rect x={3} y={5} width={4} height={4} fill="#FFD66B" />
      <Rect x={4} y={6} width={2} height={2} fill="#3A2E1F" />
      <Rect x={7} y={6} width={7} height={1} fill="#3A2E1F" />
      <Rect x={7} y={7} width={7} height={1} fill="#FFD66B" />
      <Rect x={7} y={8} width={7} height={1} fill="#3A2E1F" />
      <Rect x={10} y={8} width={1} height={2} fill="#3A2E1F" />
      <Rect x={13} y={8} width={1} height={2} fill="#3A2E1F" />
    </Svg>
  );
}
