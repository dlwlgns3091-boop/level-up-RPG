import type { StatKey } from "@/constants/theme";
import { getDb } from "./client";
import type { NewQuestTemplateInput } from "./types";

type SeedQuest = Omit<NewQuestTemplateInput, "is_custom" | "quest_type"> & {
  quest_type: "daily" | "weekly";
};

const DAILY_BY_STAT: Record<StatKey, SeedQuest[]> = {
  str: [
    { title: "30분 유산소 운동", description: "런닝, 자전거, 줄넘기 등", quest_type: "daily", target_stat: "str", xp_reward: 30, repeat_pattern: "daily" },
    { title: "푸시업 30개", description: "한 번에 못해도 OK, 나눠서라도", quest_type: "daily", target_stat: "str", xp_reward: 20, repeat_pattern: "daily" },
    { title: "스쿼트 50개", description: "허벅지에 자극 느낌이 올 때까지", quest_type: "daily", target_stat: "str", xp_reward: 20, repeat_pattern: "daily" },
    { title: "10,000보 걷기", description: "오늘 하루 누적 1만보", quest_type: "daily", target_stat: "str", xp_reward: 25, repeat_pattern: "daily" },
    { title: "스트레칭 15분", description: "취침 전 전신 스트레칭", quest_type: "daily", target_stat: "str", xp_reward: 15, repeat_pattern: "daily" },
  ],
  int: [
    { title: "책 20페이지 읽기", description: "장르 무관, 끝까지 읽기보다 매일 읽기", quest_type: "daily", target_stat: "int", xp_reward: 30, repeat_pattern: "daily" },
    { title: "온라인 강의 1강", description: "유데미·인프런·MOOC 등", quest_type: "daily", target_stat: "int", xp_reward: 35, repeat_pattern: "daily" },
    { title: "외국어 단어 20개", description: "단어장 앱 또는 직접 정리", quest_type: "daily", target_stat: "int", xp_reward: 20, repeat_pattern: "daily" },
    { title: "기술 블로그 1편 정독", description: "관심 분야 글을 진지하게 읽기", quest_type: "daily", target_stat: "int", xp_reward: 15, repeat_pattern: "daily" },
    { title: "수학·논리 문제 1개", description: "코딩 테스트 또는 퍼즐", quest_type: "daily", target_stat: "int", xp_reward: 25, repeat_pattern: "daily" },
  ],
  wis: [
    { title: "명상 10분", description: "호흡에 집중하는 시간", quest_type: "daily", target_stat: "wis", xp_reward: 25, repeat_pattern: "daily" },
    { title: "감사 일기 3가지", description: "오늘 감사한 일 세 가지 적기", quest_type: "daily", target_stat: "wis", xp_reward: 20, repeat_pattern: "daily" },
    { title: "하루 회고 5분", description: "오늘 잘한 점 / 아쉬운 점", quest_type: "daily", target_stat: "wis", xp_reward: 20, repeat_pattern: "daily" },
    { title: "디지털 디톡스 1시간", description: "휴대폰 없이 보내는 시간", quest_type: "daily", target_stat: "wis", xp_reward: 25, repeat_pattern: "daily" },
    { title: "마음챙김 산책 20분", description: "주변을 천천히 관찰하며 걷기", quest_type: "daily", target_stat: "wis", xp_reward: 20, repeat_pattern: "daily" },
  ],
  dex: [
    { title: "포모도로 4세트 (25분 x 4)", description: "딥 워크 100분", quest_type: "daily", target_stat: "dex", xp_reward: 30, repeat_pattern: "daily" },
    { title: "오늘의 할 일 3개 완료", description: "우선순위 상위 3개", quest_type: "daily", target_stat: "dex", xp_reward: 25, repeat_pattern: "daily" },
    { title: "이메일·메시지 인박스 0", description: "받은편지함 비우기", quest_type: "daily", target_stat: "dex", xp_reward: 15, repeat_pattern: "daily" },
    { title: "내일 할 일 미리 정리", description: "취침 전 5분 플래닝", quest_type: "daily", target_stat: "dex", xp_reward: 15, repeat_pattern: "daily" },
    { title: "책상·작업 공간 정리", description: "5분 정리정돈", quest_type: "daily", target_stat: "dex", xp_reward: 10, repeat_pattern: "daily" },
  ],
  con: [
    { title: "7시간+ 수면", description: "취침 시간 사수", quest_type: "daily", target_stat: "con", xp_reward: 30, repeat_pattern: "daily" },
    { title: "물 2L 마시기", description: "하루 동안 누적", quest_type: "daily", target_stat: "con", xp_reward: 15, repeat_pattern: "daily" },
    { title: "야채·과일 챙겨먹기", description: "끼니에 한 가지 이상", quest_type: "daily", target_stat: "con", xp_reward: 15, repeat_pattern: "daily" },
    { title: "정시에 일어나기", description: "알람 한 번에 기상", quest_type: "daily", target_stat: "con", xp_reward: 20, repeat_pattern: "daily" },
    { title: "야식·과식 안 하기", description: "저녁 8시 이후 절제", quest_type: "daily", target_stat: "con", xp_reward: 20, repeat_pattern: "daily" },
  ],
  cha: [
    { title: "친구·가족에게 안부 연락", description: "전화 또는 메시지", quest_type: "daily", target_stat: "cha", xp_reward: 20, repeat_pattern: "daily" },
    { title: "글 한 편 쓰기", description: "블로그·일기·SNS 어디든", quest_type: "daily", target_stat: "cha", xp_reward: 25, repeat_pattern: "daily" },
    { title: "창작 30분", description: "그림·음악·글·영상 등", quest_type: "daily", target_stat: "cha", xp_reward: 30, repeat_pattern: "daily" },
    { title: "동료·친구 칭찬 1회", description: "구체적으로 진심을 담아", quest_type: "daily", target_stat: "cha", xp_reward: 15, repeat_pattern: "daily" },
    { title: "새로운 사람과 짧은 대화", description: "온·오프 무관", quest_type: "daily", target_stat: "cha", xp_reward: 20, repeat_pattern: "daily" },
  ],
};

const WEEKLY_QUESTS: SeedQuest[] = [
  { title: "이번 주 운동 4회", description: "주간 도전: 운동 누적 4회", quest_type: "weekly", target_stat: "str", xp_reward: 120, repeat_pattern: "weekly" },
  { title: "이번 주 책 1권 완독", description: "주간 도전: 한 권을 끝내기", quest_type: "weekly", target_stat: "int", xp_reward: 150, repeat_pattern: "weekly" },
  { title: "이번 주 명상 5회", description: "주간 도전: 명상 누적 5회", quest_type: "weekly", target_stat: "wis", xp_reward: 120, repeat_pattern: "weekly" },
  { title: "이번 주 딥 워크 10시간", description: "주간 도전: 포모도로 누적", quest_type: "weekly", target_stat: "dex", xp_reward: 140, repeat_pattern: "weekly" },
  { title: "이번 주 7시간+ 수면 5일", description: "주간 도전: 수면 루틴", quest_type: "weekly", target_stat: "con", xp_reward: 130, repeat_pattern: "weekly" },
  { title: "이번 주 글 3편 발행", description: "주간 도전: 창작 누적", quest_type: "weekly", target_stat: "cha", xp_reward: 130, repeat_pattern: "weekly" },
];

export function seedDefaultTemplatesIfNeeded(): void {
  const db = getDb();
  const existing = db.getFirstSync<{ n: number }>(
    "SELECT COUNT(*) AS n FROM quest_template WHERE is_custom = 0;",
  );
  if ((existing?.n ?? 0) > 0) return;

  const insert = db.prepareSync(
    `INSERT INTO quest_template
       (title, description, quest_type, target_stat, xp_reward, repeat_pattern, is_custom, is_active)
     VALUES ($title, $description, $quest_type, $target_stat, $xp_reward, $repeat_pattern, 0, 1);`,
  );
  try {
    db.withTransactionSync(() => {
      const allDailies = (Object.values(DAILY_BY_STAT) as SeedQuest[][]).flat();
      for (const q of [...allDailies, ...WEEKLY_QUESTS]) {
        insert.executeSync({
          $title: q.title,
          $description: q.description ?? null,
          $quest_type: q.quest_type,
          $target_stat: q.target_stat,
          $xp_reward: q.xp_reward,
          $repeat_pattern: q.repeat_pattern ?? null,
        });
      }
    });
  } finally {
    insert.finalizeSync();
  }
}
