import Svg, { Rect } from "react-native-svg";

type Props = {
  size?: number;
};

/** Generated from design_handoff_lifequest/sprites.svg.html (#char-wizard) */
export function WizardSprite({ size = 64 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x={10} y={1} width={4} height={2} fill="#8B5CB0" />
      <Rect x={9} y={3} width={6} height={2} fill="#8B5CB0" />
      <Rect x={8} y={5} width={8} height={2} fill="#8B5CB0" />
      <Rect x={7} y={7} width={10} height={1} fill="#8B5CB0" />
      <Rect x={6} y={8} width={12} height={1} fill="#3A2E1F" />
      <Rect x={12} y={5} width={1} height={1} fill="#FFD66B" />
      <Rect x={11} y={6} width={3} height={1} fill="#FFD66B" />
      <Rect x={8} y={9} width={8} height={6} fill="#FFE0C4" />
      <Rect x={7} y={10} width={1} height={4} fill="#FFE0C4" />
      <Rect x={16} y={10} width={1} height={4} fill="#FFE0C4" />
      <Rect x={8} y={12} width={1} height={1} fill="#FFB5B5" />
      <Rect x={15} y={12} width={1} height={1} fill="#FFB5B5" />
      <Rect x={10} y={11} width={1} height={2} fill="#3A2E1F" />
      <Rect x={13} y={11} width={1} height={2} fill="#3A2E1F" />
      <Rect x={10} y={11} width={1} height={1} fill="#FFFFFF" />
      <Rect x={13} y={11} width={1} height={1} fill="#FFFFFF" />
      <Rect x={11} y={13} width={2} height={1} fill="#3A2E1F" />
      <Rect x={7} y={15} width={10} height={6} fill="#6BAEE8" />
      <Rect x={6} y={16} width={1} height={5} fill="#6BAEE8" />
      <Rect x={17} y={16} width={1} height={5} fill="#6BAEE8" />
      <Rect x={11} y={16} width={2} height={1} fill="#FFD66B" />
      <Rect x={11} y={17} width={2} height={1} fill="#FFD66B" />
      <Rect x={8} y={21} width={3} height={2} fill="#3A2E1F" />
      <Rect x={13} y={21} width={3} height={2} fill="#3A2E1F" />
    </Svg>
  );
}
