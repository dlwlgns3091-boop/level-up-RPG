import Svg, { Rect } from "react-native-svg";

type Props = {
  size?: number;
};

/** Generated from design_handoff_lifequest/sprites.svg.html (#icon-home) */
export function HomeIcon({ size = 16 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16">
      <Rect x={7} y={2} width={2} height={1} fill="#3A2E1F" />
      <Rect x={6} y={3} width={4} height={1} fill="#3A2E1F" />
      <Rect x={5} y={4} width={6} height={1} fill="#3A2E1F" />
      <Rect x={4} y={5} width={8} height={1} fill="#3A2E1F" />
      <Rect x={3} y={6} width={10} height={1} fill="#3A2E1F" />
      <Rect x={7} y={3} width={2} height={1} fill="#FF7B7B" />
      <Rect x={6} y={4} width={4} height={1} fill="#FF7B7B" />
      <Rect x={5} y={5} width={6} height={1} fill="#FF7B7B" />
      <Rect x={4} y={6} width={8} height={1} fill="#FF7B7B" />
      <Rect x={4} y={7} width={1} height={7} fill="#3A2E1F" />
      <Rect x={11} y={7} width={1} height={7} fill="#3A2E1F" />
      <Rect x={4} y={13} width={8} height={1} fill="#3A2E1F" />
      <Rect x={5} y={7} width={6} height={6} fill="#FFE0C4" />
      <Rect x={7} y={9} width={2} height={4} fill="#8B5E3C" />
      <Rect x={8} y={11} width={1} height={1} fill="#FFD66B" />
    </Svg>
  );
}
