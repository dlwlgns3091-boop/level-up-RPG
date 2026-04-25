import Svg, { Rect } from "react-native-svg";

type Props = {
  size?: number;
};

/** Generated from design_handoff_lifequest/sprites.svg.html (#icon-guild) */
export function GuildIcon({ size = 16 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16">
      <Rect x={2} y={3} width={3} height={3} fill="#3A2E1F" />
      <Rect x={2} y={3} width={3} height={3} fill="#FF9FB5" />
      <Rect x={1} y={4} width={1} height={1} fill="#3A2E1F" />
      <Rect x={5} y={4} width={1} height={1} fill="#3A2E1F" />
      <Rect x={1} y={6} width={5} height={3} fill="#FF7B7B" />
      <Rect x={0} y={7} width={1} height={2} fill="#3A2E1F" />
      <Rect x={6} y={7} width={1} height={2} fill="#3A2E1F" />
      <Rect x={6} y={2} width={4} height={4} fill="#6BAEE8" />
      <Rect x={5} y={3} width={1} height={3} fill="#3A2E1F" />
      <Rect x={10} y={3} width={1} height={3} fill="#3A2E1F" />
      <Rect x={5} y={6} width={6} height={4} fill="#6BAEE8" />
      <Rect x={4} y={7} width={1} height={3} fill="#3A2E1F" />
      <Rect x={11} y={7} width={1} height={3} fill="#3A2E1F" />
      <Rect x={11} y={3} width={3} height={3} fill="#7EC96A" />
      <Rect x={10} y={4} width={1} height={1} fill="#3A2E1F" />
      <Rect x={14} y={4} width={1} height={1} fill="#3A2E1F" />
      <Rect x={10} y={6} width={5} height={3} fill="#5A8A3A" />
      <Rect x={9} y={7} width={1} height={2} fill="#3A2E1F" />
      <Rect x={15} y={7} width={1} height={2} fill="#3A2E1F" />
      <Rect x={0} y={9} width={16} height={1} fill="#3A2E1F" />
    </Svg>
  );
}
