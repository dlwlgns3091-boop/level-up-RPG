import { CLASS_BY_ID, type ClassId } from "@/constants/classes";
import {
  ArcherSprite,
  KnightSprite,
  SlimeSprite,
  WizardSprite,
} from "./index";

/**
 * 16개 자동 직업을 4개 픽셀 캐릭터에 매핑.
 *
 * 매핑 규칙: 각 직업의 primary 카테고리들 중 하나가 어느 캐릭터 톤에 가까운지로 결정.
 *   - exercise (몸)         -> KnightSprite
 *   - study   (지식)         -> WizardSprite
 *   - creative (창작)        -> WizardSprite (마법사가 별 + 보라톤이라 "창작" 비주얼과도 어울림)
 *   - productivity (실행)    -> ArcherSprite
 *   - apprentice / 균형형    -> SlimeSprite
 *
 * 두 카테고리가 충돌할 땐 primary 배열의 첫 번째를 채택.
 */
const PRIMARY_TO_SPRITE = {
  exercise: KnightSprite,
  study: WizardSprite,
  creative: WizardSprite,
  productivity: ArcherSprite,
} as const;

type SpriteComponent = typeof KnightSprite;

export function classToSprite(classId: ClassId): SpriteComponent {
  if (classId === "apprentice" || classId === "perfect_human") {
    return SlimeSprite;
  }
  const def = CLASS_BY_ID[classId];
  const first = def?.primary[0];
  if (!first) return SlimeSprite;
  return PRIMARY_TO_SPRITE[first] ?? SlimeSprite;
}

type Props = {
  classId: ClassId;
  size?: number;
};

/** 직업 아이디를 받아 해당 캐릭터 스프라이트를 그린다. */
export function ClassSprite({ classId, size = 64 }: Props) {
  const Comp = classToSprite(classId);
  return <Comp size={size} />;
}
