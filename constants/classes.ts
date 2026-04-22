import type { ClassKey, StatKey } from "./theme";

export type ClassDef = {
  key: ClassKey;
  nameKo: string;
  mainStat: StatKey;
  concept: string;
  specialtyActivities: string;
};

export const CLASSES: readonly ClassDef[] = [
  {
    key: "warrior",
    nameKo: "전사",
    mainStat: "str",
    concept: "몸을 단련하는 자",
    specialtyActivities: "운동, 근력 트레이닝",
  },
  {
    key: "sage",
    nameKo: "현자",
    mainStat: "int",
    concept: "지식을 쌓는 자",
    specialtyActivities: "독서, 공부, 학습",
  },
  {
    key: "monk",
    nameKo: "수도자",
    mainStat: "wis",
    concept: "내면을 닦는 자",
    specialtyActivities: "명상, 일기, 마음챙김",
  },
  {
    key: "bard",
    nameKo: "음유시인",
    mainStat: "cha",
    concept: "세상과 연결되는 자",
    specialtyActivities: "창작, 예술, 소셜 활동",
  },
  {
    key: "rogue",
    nameKo: "도적",
    mainStat: "dex",
    concept: "효율을 추구하는 자",
    specialtyActivities: "생산성, 작업 완료, 시간관리",
  },
  {
    key: "cleric",
    nameKo: "성직자",
    mainStat: "con",
    concept: "몸과 마음을 돌보는 자",
    specialtyActivities: "수면, 식단, 건강 관리",
  },
] as const;

export const STAT_LABELS_KO: Record<StatKey, string> = {
  str: "근력",
  int: "지능",
  wis: "지혜",
  dex: "민첩",
  con: "체력",
  cha: "매력",
};
