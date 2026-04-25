import Svg, { Rect } from "react-native-svg";

type Props = {
  size?: number;
};

/** Generated from design_handoff_lifequest/sprites.svg.html (#icon-book) */
export function BookIcon({ size = 16 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16">
      <Rect x={2} y={2} width={12} height={1} fill="#3A2E1F" />
      <Rect x={2} y={13} width={12} height={1} fill="#3A2E1F" />
      <Rect x={1} y={3} width={1} height={10} fill="#3A2E1F" />
      <Rect x={14} y={3} width={1} height={10} fill="#3A2E1F" />
      <Rect x={7} y={3} width={2} height={10} fill="#3A2E1F" />
      <Rect x={2} y={3} width={5} height={10} fill="#FFFDF5" />
      <Rect x={3} y={5} width={3} height={1} fill="#D4C19A" />
      <Rect x={3} y={7} width={4} height={1} fill="#D4C19A" />
      <Rect x={3} y={9} width={3} height={1} fill="#D4C19A" />
      <Rect x={9} y={3} width={5} height={10} fill="#FFFDF5" />
      <Rect x={10} y={5} width={3} height={1} fill="#D4C19A" />
      <Rect x={10} y={7} width={4} height={1} fill="#D4C19A" />
      <Rect x={10} y={9} width={3} height={1} fill="#D4C19A" />
      <Rect x={11} y={2} width={1} height={5} fill="#FF7B7B" />
      <Rect x={11} y={7} width={1} height={1} fill="#E85A5A" />
    </Svg>
  );
}
