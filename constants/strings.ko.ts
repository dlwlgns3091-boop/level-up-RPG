export const STRINGS = {
  app: {
    name: "LifeQuest",
    tagline: "해온 일이 직업이 된다",
  },
  onboarding: {
    welcomeTitle: "모험을 시작하시겠습니까?",
    welcomeBody:
      "운동·공부·창작·생산성 네 영역을 쌓아가면, 당신의 생활 패턴에 맞는 직업이 스스로 각성합니다.",
    welcomeCta: "여정 시작하기",
    nameInputTitle: "이름을 정해주세요",
    nameInputPlaceholder: "캐릭터 이름",
    nameInputCta: "모험 시작",
    intro: {
      title: "당신이 해온 일이 당신을 말해줍니다",
      body:
        "직업은 선택하지 않습니다. 활동이 누적되면 자동으로 각성되고, 생활이 바뀌면 직업도 바뀝니다.\n\n4개 영역을 자유롭게 경험해 보세요.",
      cta: "시작하기",
    },
  },
  tabs: {
    home: "홈",
    quests: "퀘스트",
    stats: "성장",
    profile: "나",
  },
  home: {
    todaysQuests: "오늘의 퀘스트",
    noQuests: "오늘의 퀘스트가 없습니다.",
  },
  quests: {
    daily: "일일",
    weekly: "주간",
    custom: "커스텀",
    addCustom: "커스텀 퀘스트 추가",
  },
  stats: {
    title: "성장",
    totalXpLabel: "누적 XP",
  },
  profile: {
    title: "프로필",
    currentClass: "현재 직업",
    classHistory: "직업 이력",
    settings: "설정",
  },
  levelUp: {
    title: "레벨 업!",
    body: (lv: number) => `Lv.${lv} 달성!`,
    cta: "확인",
  },
  classChange: {
    awakeningTitle: "✨ 각성!",
    transitionTitle: "🎭 새로운 여정의 시작",
    awakeningBody:
      "당신은 더 이상 수련생이 아닙니다. 쌓아온 활동이 당신을 새로운 자리에 올려놓았습니다.",
    transitionBody: "지난 여정을 돌아보니...",
    cta: "계속하기",
  },
  common: {
    cancel: "취소",
    save: "저장",
    confirm: "확인",
    close: "닫기",
  },
} as const;
