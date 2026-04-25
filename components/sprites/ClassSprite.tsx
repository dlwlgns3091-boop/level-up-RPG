import { type ClassId } from "@/constants/classes";
import {
  ApprenticeCodex,
  DigitalWizardCodex,
  GodsaengHunterCodex,
  IndieHackerCodex,
  IronHeartCodex,
  LibrarianKingCodex,
  LifeAthleteCodex,
  PerfectHumanCodex,
  PhysicalArtistCodex,
  PixelMasterCodex,
  ProjectMageCodex,
  RenaissanceCodex,
  SpartaScholarCodex,
  StoryMageCodex,
  StreetArtistCodex,
  TimeHackerCodex,
} from "./codex";

/**
 * 16 ClassId → 16 HD 코덱스 스프라이트 1:1 매핑.
 * (이전 4개로 줄여 매핑하던 버전은 폐기됨.)
 *
 * 각 코덱스 스프라이트는 32×32 픽셀 viewBox에 그려져 있으며 정사각형 size 한 값으로 호출.
 */
const CODEX_BY_CLASS = {
  apprentice: ApprenticeCodex,
  iron_heart: IronHeartCodex,
  librarian_king: LibrarianKingCodex,
  pixel_master: PixelMasterCodex,
  time_hacker: TimeHackerCodex,
  sparta_scholar: SpartaScholarCodex,
  physical_artist: PhysicalArtistCodex,
  life_athlete: LifeAthleteCodex,
  story_mage: StoryMageCodex,
  project_mage: ProjectMageCodex,
  indie_hacker: IndieHackerCodex,
  renaissance: RenaissanceCodex,
  godsaeng_hunter: GodsaengHunterCodex,
  street_artist: StreetArtistCodex,
  digital_wizard: DigitalWizardCodex,
  perfect_human: PerfectHumanCodex,
} as const satisfies Record<ClassId, unknown>;

type SpriteComponent = (typeof CODEX_BY_CLASS)[ClassId];

export function classToSprite(classId: ClassId): SpriteComponent {
  return CODEX_BY_CLASS[classId] ?? ApprenticeCodex;
}

type Props = {
  classId: ClassId;
  size?: number;
};

/** 직업 아이디를 받아 해당 HD 코덱스 캐릭터를 그린다. */
export function ClassSprite({ classId, size = 64 }: Props) {
  const Comp = classToSprite(classId);
  return <Comp size={size} />;
}
