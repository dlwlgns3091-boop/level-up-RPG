import Svg, { Rect } from "react-native-svg";

type Props = {
  size?: number;
};

/** Generated from design_handoff_lifequest/sprites.svg.html (#icon-check) */
export function CheckIcon({ size = 16 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16">
      <Rect x={11} y={3} width={3} height={1} fill="#3A2E1F" />
      <Rect x={10} y={4} width={3} height={2} fill="#3A2E1F" />
      <Rect x={9} y={5} width={3} height={2} fill="#3A2E1F" />
      <Rect x={8} y={6} width={3} height={2} fill="#3A2E1F" />
      <Rect x={7} y={7} width={3} height={2} fill="#3A2E1F" />
      <Rect x={6} y={8} width={3} height={2} fill="#3A2E1F" />
      <Rect x={5} y={9} width={2} height={2} fill="#3A2E1F" />
      <Rect x={2} y={7} width={2} height={1} fill="#3A2E1F" />
      <Rect x={2} y={8} width={3} height={2} fill="#3A2E1F" />
      <Rect x={3} y={9} width={3} height={2} fill="#3A2E1F" />
      <Rect x={4} y={10} width={2} height={1} fill="#3A2E1F" />
      <Rect x={11} y={4} width={2} height={1} fill="#7EC96A" />
      <Rect x={10} y={5} width={2} height={1} fill="#7EC96A" />
      <Rect x={9} y={6} width={2} height={1} fill="#7EC96A" />
      <Rect x={8} y={7} width={2} height={1} fill="#7EC96A" />
      <Rect x={7} y={8} width={2} height={1} fill="#7EC96A" />
      <Rect x={6} y={9} width={2} height={1} fill="#7EC96A" />
      <Rect x={3} y={8} width={2} height={1} fill="#7EC96A" />
      <Rect x={4} y={9} width={2} height={1} fill="#7EC96A" />
    </Svg>
  );
}
