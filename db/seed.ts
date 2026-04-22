import type { CategoryKey } from "@/constants/categories";
import { getDb } from "./client";
import type { NewQuestTemplateInput } from "./types";

type SeedQuest = Omit<NewQuestTemplateInput, "is_custom" | "quest_type"> & {
  quest_type: "daily" | "weekly";
};

const DAILY_BY_CATEGORY: Record<CategoryKey, SeedQuest[]> = {
  exercise: [
    { title: "운동 30분 이상 하기", description: "강도 무관, 꾸준함이 핵심", quest_type: "daily", category: "exercise", xp_reward: 30, repeat_pattern: "daily" },
    { title: "만 보 걷기", description: "오늘 누적 1만보", quest_type: "daily", category: "exercise", xp_reward: 25, repeat_pattern: "daily" },
    { title: "스트레칭 10분", description: "취침 전 또는 기상 직후", quest_type: "daily", category: "exercise", xp_reward: 15, repeat_pattern: "daily" },
    { title: "근력 운동", description: "푸시업·스쿼트·기구 등", quest_type: "daily", category: "exercise", xp_reward: 30, repeat_pattern: "daily" },
    { title: "유산소 운동", description: "런닝·자전거·줄넘기 등", quest_type: "daily", category: "exercise", xp_reward: 25, repeat_pattern: "daily" },
    { title: "계단 이용하기", description: "엘리베이터 대신 한 번이라도", quest_type: "daily", category: "exercise", xp_reward: 10, repeat_pattern: "daily" },
    { title: "가벼운 산책", description: "20분 이상", quest_type: "daily", category: "exercise", xp_reward: 15, repeat_pattern: "daily" },
    { title: "충분한 수면 (7시간+)", description: "건강의 기본", quest_type: "daily", category: "exercise", xp_reward: 20, repeat_pattern: "daily" },
  ],
  study: [
    { title: "책 30분 읽기", description: "장르 무관", quest_type: "daily", category: "study", xp_reward: 30, repeat_pattern: "daily" },
    { title: "강의 1강 수강", description: "유데미·인프런·MOOC 등", quest_type: "daily", category: "study", xp_reward: 30, repeat_pattern: "daily" },
    { title: "새로운 것 하나 배우기", description: "작은 지식 한 조각", quest_type: "daily", category: "study", xp_reward: 20, repeat_pattern: "daily" },
    { title: "노트 정리", description: "오늘 배운 내용 요약", quest_type: "daily", category: "study", xp_reward: 15, repeat_pattern: "daily" },
    { title: "언어 학습 15분", description: "단어·회화·작문 무관", quest_type: "daily", category: "study", xp_reward: 20, repeat_pattern: "daily" },
    { title: "전문 기사/논문 읽기", description: "관심 분야 깊이 있게", quest_type: "daily", category: "study", xp_reward: 25, repeat_pattern: "daily" },
    { title: "오늘 배운 것 회고", description: "5분 메모 또는 일지", quest_type: "daily", category: "study", xp_reward: 15, repeat_pattern: "daily" },
    { title: "문제집/연습 문제 풀기", description: "코딩 테스트도 포함", quest_type: "daily", category: "study", xp_reward: 25, repeat_pattern: "daily" },
  ],
  creative: [
    { title: "글쓰기", description: "블로그·일기·SNS 어디든", quest_type: "daily", category: "creative", xp_reward: 30, repeat_pattern: "daily" },
    { title: "그림/디자인 작업", description: "스케치·UI·캘리 등", quest_type: "daily", category: "creative", xp_reward: 30, repeat_pattern: "daily" },
    { title: "음악/영상 제작", description: "작곡·연주·편집", quest_type: "daily", category: "creative", xp_reward: 30, repeat_pattern: "daily" },
    { title: "코드 작성", description: "사이드 프로젝트 또는 학습용", quest_type: "daily", category: "creative", xp_reward: 30, repeat_pattern: "daily" },
    { title: "아이디어 브레인스토밍", description: "메모로라도 5개 적기", quest_type: "daily", category: "creative", xp_reward: 15, repeat_pattern: "daily" },
    { title: "무언가 만들기", description: "요리·DIY·공예", quest_type: "daily", category: "creative", xp_reward: 25, repeat_pattern: "daily" },
    { title: "사진 촬영/편집", description: "한 장이라도 의도적으로", quest_type: "daily", category: "creative", xp_reward: 20, repeat_pattern: "daily" },
    { title: "일기 쓰기", description: "오늘의 내 기록", quest_type: "daily", category: "creative", xp_reward: 15, repeat_pattern: "daily" },
  ],
  productivity: [
    { title: "오늘 할 일 3개 완료", description: "우선순위 상위 3개", quest_type: "daily", category: "productivity", xp_reward: 30, repeat_pattern: "daily" },
    { title: "포모도로 2세션 이상", description: "25분 x 2", quest_type: "daily", category: "productivity", xp_reward: 25, repeat_pattern: "daily" },
    { title: "이메일/메시지 정리", description: "받은편지함 비우기", quest_type: "daily", category: "productivity", xp_reward: 15, repeat_pattern: "daily" },
    { title: "책상/공간 정리", description: "5분 정리정돈", quest_type: "daily", category: "productivity", xp_reward: 15, repeat_pattern: "daily" },
    { title: "내일 계획 세우기", description: "취침 전 5분", quest_type: "daily", category: "productivity", xp_reward: 20, repeat_pattern: "daily" },
    { title: "미뤄둔 일 하나 처리", description: "작은 것이라도", quest_type: "daily", category: "productivity", xp_reward: 25, repeat_pattern: "daily" },
    { title: "집중 작업 1시간", description: "방해 차단 모드", quest_type: "daily", category: "productivity", xp_reward: 30, repeat_pattern: "daily" },
    { title: "업무/과제 진행", description: "주된 일감 한 단계", quest_type: "daily", category: "productivity", xp_reward: 25, repeat_pattern: "daily" },
  ],
};

const WEEKLY_QUESTS: SeedQuest[] = [
  { title: "이번 주 운동 4회", description: "주간 도전: 운동 누적 4회", quest_type: "weekly", category: "exercise", xp_reward: 120, repeat_pattern: "weekly" },
  { title: "이번 주 책 1권 완독", description: "주간 도전: 한 권 끝내기", quest_type: "weekly", category: "study", xp_reward: 150, repeat_pattern: "weekly" },
  { title: "이번 주 창작물 3개 발행", description: "주간 도전: 결과물 3개", quest_type: "weekly", category: "creative", xp_reward: 130, repeat_pattern: "weekly" },
  { title: "이번 주 딥워크 10시간", description: "주간 도전: 집중 시간 누적", quest_type: "weekly", category: "productivity", xp_reward: 140, repeat_pattern: "weekly" },
];

export function seedDefaultTemplatesIfNeeded(): void {
  const db = getDb();
  const existing = db.getFirstSync<{ n: number }>(
    "SELECT COUNT(*) AS n FROM quest_template WHERE is_custom = 0;",
  );
  if ((existing?.n ?? 0) > 0) return;

  const insert = db.prepareSync(
    `INSERT INTO quest_template
       (title, description, quest_type, category, xp_reward, repeat_pattern, is_custom, is_active)
     VALUES ($title, $description, $quest_type, $category, $xp_reward, $repeat_pattern, 0, 1);`,
  );
  try {
    db.withTransactionSync(() => {
      const allDailies = (Object.values(DAILY_BY_CATEGORY) as SeedQuest[][]).flat();
      for (const q of [...allDailies, ...WEEKLY_QUESTS]) {
        insert.executeSync({
          $title: q.title,
          $description: q.description ?? null,
          $quest_type: q.quest_type,
          $category: q.category,
          $xp_reward: q.xp_reward,
          $repeat_pattern: q.repeat_pattern ?? null,
        });
      }
    });
  } finally {
    insert.finalizeSync();
  }
}
