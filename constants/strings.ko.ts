export const STRINGS = {
  app: {
    name: "LifeQuest",
    tagline: "현실의 자기계발을 RPG로",
  },
  onboarding: {
    welcomeTitle: "모험을 시작하시겠습니까?",
    welcomeBody:
      "현실의 자기계발 활동을 RPG 퀘스트로 변환해, 캐릭터를 성장시키며 꾸준한 습관을 만들어 보세요.",
    welcomeCta: "여정 시작하기",
    classSelectTitle: "직업을 선택하세요",
    classSelectSubtitle: "직업에 따라 특화 활동의 XP 보너스가 달라집니다.",
    nameInputTitle: "이름을 정해주세요",
    nameInputPlaceholder: "캐릭터 이름",
    nameInputCta: "모험 시작",
  },
  tabs: {
    home: "홈",
    quests: "퀘스트",
    stats: "스탯",
    profile: "나",
  },
  home: {
    todaysQuests: "오늘의 퀘스트",
    streakLabel: (days: number, mult: number) =>
      `🔥 연속 ${days}일 달성 중 (${mult.toFixed(2)}x XP)`,
    noQuests: "오늘의 퀘스트가 없습니다.",
  },
  quests: {
    daily: "일일",
    weekly: "주간",
    custom: "커스텀",
    addCustom: "커스텀 퀘스트 추가",
  },
  stats: {
    title: "스탯",
    unspentPoints: (n: number) => `남은 스탯 포인트: ${n}`,
  },
  profile: {
    title: "프로필",
    titles: "획득한 칭호",
    settings: "설정",
  },
  levelUp: {
    title: "레벨 업!",
    body: (lv: number) => `Lv.${lv} 달성! 스탯 포인트 3개를 획득했습니다.`,
    cta: "확인",
  },
  common: {
    cancel: "취소",
    save: "저장",
    confirm: "확인",
    close: "닫기",
  },
} as const;
