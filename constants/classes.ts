import type { CategoryKey } from "./categories";

export type ClassId =
  | "apprentice"
  | "iron_heart"
  | "librarian_king"
  | "pixel_master"
  | "time_hacker"
  | "sparta_scholar"
  | "physical_artist"
  | "life_athlete"
  | "story_mage"
  | "project_mage"
  | "indie_hacker"
  | "renaissance"
  | "godsaeng_hunter"
  | "street_artist"
  | "digital_wizard"
  | "perfect_human";

export type ClassShape = "initial" | "pure" | "dual" | "triple" | "perfect";

export type ClassDef = {
  id: ClassId;
  nameKo: string;
  flavor: string;
  shape: ClassShape;
  /** 이 직업의 정체성을 구성하는 주력 카테고리들 (Hysteresis 계산용) */
  primary: readonly CategoryKey[];
};

export const CLASSES: readonly ClassDef[] = [
  { id: "apprentice",       nameKo: "수련생",             flavor: "아직 길을 찾는 중",                   shape: "initial", primary: [] },
  { id: "iron_heart",       nameKo: "아이언 하트",        flavor: "강철 같은 몸, 뜨거운 심장",           shape: "pure",    primary: ["exercise"] },
  { id: "librarian_king",   nameKo: "도서관의 마왕",      flavor: "책 속에서 세상을 지배하는 자",         shape: "pure",    primary: ["study"] },
  { id: "pixel_master",     nameKo: "픽셀 마스터",        flavor: "무에서 유를 빚어내는 장인",           shape: "pure",    primary: ["creative"] },
  { id: "time_hacker",      nameKo: "타임 해커",          flavor: "시간을 해킹하는 자",                  shape: "pure",    primary: ["productivity"] },
  { id: "sparta_scholar",   nameKo: "스파르타 스콜라",    flavor: "검과 책을 함께 드는 자",              shape: "dual",    primary: ["exercise", "study"] },
  { id: "physical_artist",  nameKo: "피지컬 아티스트",    flavor: "움직임이 곧 예술인 자",               shape: "dual",    primary: ["exercise", "creative"] },
  { id: "life_athlete",     nameKo: "라이프 애슬리트",    flavor: "삶 자체를 훈련하는 자",               shape: "dual",    primary: ["exercise", "productivity"] },
  { id: "story_mage",       nameKo: "스토리 메이지",      flavor: "탐구가 창조로 이어지는 자",           shape: "dual",    primary: ["study", "creative"] },
  { id: "project_mage",     nameKo: "프로젝트 메이지",    flavor: "배움을 실행으로 옮기는 자",           shape: "dual",    primary: ["study", "productivity"] },
  { id: "indie_hacker",     nameKo: "인디 해커",          flavor: "만들고 완성하고 출시하는 자",         shape: "dual",    primary: ["creative", "productivity"] },
  { id: "renaissance",      nameKo: "르네상스인",         flavor: "몸·앎·창작으로 충만한 자",           shape: "triple",  primary: ["exercise", "study", "creative"] },
  { id: "godsaeng_hunter",  nameKo: "갓생 헌터",          flavor: "강하고 지혜롭게 실행하는 자",         shape: "triple",  primary: ["exercise", "study", "productivity"] },
  { id: "street_artist",    nameKo: "스트리트 아티스트",  flavor: "행동과 창의로 세상을 누비는 자",       shape: "triple",  primary: ["exercise", "creative", "productivity"] },
  { id: "digital_wizard",   nameKo: "디지털 위자드",      flavor: "지성·창의·실행의 삼위일체",          shape: "triple",  primary: ["study", "creative", "productivity"] },
  { id: "perfect_human",    nameKo: "퍼펙트 휴먼",        flavor: "완벽한 균형을 이룬 자",               shape: "perfect", primary: ["exercise", "study", "creative", "productivity"] },
];

export const CLASS_BY_ID: Readonly<Record<ClassId, ClassDef>> =
  CLASSES.reduce<Record<ClassId, ClassDef>>((acc, def) => {
    acc[def.id] = def;
    return acc;
  }, {} as Record<ClassId, ClassDef>);

export function getClass(id: ClassId | string): ClassDef {
  return CLASS_BY_ID[id as ClassId] ?? CLASS_BY_ID.apprentice;
}
