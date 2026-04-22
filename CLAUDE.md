# LifeQuest - 자기계발 RPG 모바일 앱

> Claude Code 전용 프로젝트 명세서
> 이 문서를 프로젝트 루트에 `CLAUDE.md`로 두면 Claude Code가 이 스펙을 기준으로 작업합니다.

---

## 📌 프로젝트 한 줄 요약

**현실의 자기계발 활동을 RPG 퀘스트로 변환해, 캐릭터를 성장시키며 꾸준한 습관을 만드는 모바일 앱.**

---

## 🎯 핵심 컨셉

사용자는 앱 시작 시 RPG 직업(전사, 현자, 수도자, 음유시인, 도적, 성직자 중 하나)을 선택합니다. 현실에서 운동·독서·명상·공부 같은 자기계발 활동을 퀘스트 완료로 기록하면, 활동 종류에 따라 캐릭터 스탯(근력·지능·지혜 등)이 오르고 경험치가 쌓여 레벨업합니다. 앱은 사용자의 직업과 현재 상태에 맞춰 매일 퀘스트를 추천해 동기부여를 합니다.

---

## 🛠 기술 스택

| 분류 | 선택 | 선택 이유 |
|---|---|---|
| 프레임워크 | **Expo (React Native) + TypeScript** | iOS/Android 동시 지원, QR 코드로 실기기 즉시 테스트, EAS Build로 앱스토어 배포 가능 |
| 상태 관리 | **Zustand** | Redux보다 가벼움, 보일러플레이트 최소 |
| 로컬 저장 | **expo-sqlite** | 퀘스트 이력·캐릭터 데이터 구조화 저장. AsyncStorage보다 쿼리 유연함 |
| 알림 | **expo-notifications** | 일일 퀘스트 리마인더 |
| 네비게이션 | **expo-router** (file-based) | Next.js 스타일 라우팅, 러닝 커브 낮음 |
| UI | **NativeWind (Tailwind for RN)** + **react-native-reanimated** | 빠른 스타일링 + 부드러운 레벨업/경험치 애니메이션 |
| 아이콘 | **@expo/vector-icons** | Expo 기본 포함 |

**의도적으로 제외한 것:** 백엔드/로그인. MVP는 완전 로컬 앱으로 시작. 추후 클라우드 싱크가 필요해지면 Supabase 추가.

---

## 🎮 게임 시스템 설계

### 직업 (Class)

각 직업은 주력 스탯과 경험치 배율(특정 활동에서 XP 보너스)이 다릅니다.

| 직업 | 주력 스탯 | 특화 활동 (XP 1.5배) | 컨셉 |
|---|---|---|---|
| **전사 (Warrior)** | STR | 운동, 근력 트레이닝 | 몸을 단련하는 자 |
| **현자 (Sage)** | INT | 독서, 공부, 학습 | 지식을 쌓는 자 |
| **수도자 (Monk)** | WIS | 명상, 일기, 마음챙김 | 내면을 닦는 자 |
| **음유시인 (Bard)** | CHA | 창작, 예술, 소셜 활동 | 세상과 연결되는 자 |
| **도적 (Rogue)** | DEX | 생산성, 작업 완료, 시간관리 | 효율을 추구하는 자 |
| **성직자 (Cleric)** | CON | 수면, 식단, 건강 관리 | 몸과 마음을 돌보는 자 |

### 스탯 (6대 스탯 - D&D 차용)

| 스탯 | 한글 | 올라가는 활동 예시 |
|---|---|---|
| STR | 근력 | 헬스, 런닝, 홈트, 등산 |
| INT | 지능 | 책 1챕터, 강의 수강, 문제 풀이 |
| WIS | 지혜 | 명상 10분, 감사 일기, 회고 |
| DEX | 민첩 | 할 일 N개 완료, 포모도로 세션 |
| CON | 체력 | 7시간+ 수면, 물 2L, 건강식 |
| CHA | 매력 | 친구·가족 연락, 발표, 글쓰기 |

**레벨업 공식:** 다음 레벨까지 필요 XP = `100 * (현재 레벨)^1.5`
레벨업 시 **스탯 포인트 3개** 획득 → 사용자가 직접 분배 (RPG 재미 요소).

### 퀘스트 시스템

3가지 퀘스트 타입:

1. **일일 퀘스트 (Daily)** — 매일 자정 리셋. 앱이 사용자 직업/스탯 기반으로 3~5개 자동 생성. 예: "책 20페이지 읽기 (+30 INT XP)"
2. **주간 도전 (Weekly Boss)** — 7일 동안 누적 달성. 예: "이번 주 운동 4회" → 클리어 시 희귀 보상.
3. **커스텀 퀘스트 (Custom)** — 사용자가 직접 등록. 반복 주기·보상 XP·스탯 선택 가능.

**연속 달성 (Streak) 보너스:** N일 연속 퀘스트 완료 시 `1 + (streak * 0.05)` 배율 XP. 최대 2배.

### 보상

- **XP** (경험치)
- **골드** (인게임 화폐, 추후 장비·코스튬 구매용 — MVP 이후)
- **칭호** (예: "7일 연속 달성의 전사")

---

## 📱 화면 구성 (MVP 기준 5개)

```
expo-router 기반 파일 구조
app/
├── index.tsx                  # 스플래시 / 온보딩 분기
├── onboarding/
│   ├── welcome.tsx            # 앱 소개
│   ├── class-select.tsx       # 직업 선택
│   └── character-create.tsx   # 이름 입력
├── (tabs)/
│   ├── _layout.tsx            # 하단 탭 네비게이션
│   ├── home.tsx               # [메인] 캐릭터 + 오늘의 퀘스트
│   ├── quests.tsx             # 퀘스트 목록 (일일/주간/커스텀 탭)
│   ├── stats.tsx              # 스탯 상세 + 레벨업 시 포인트 분배
│   └── profile.tsx            # 칭호·이력·설정
└── modals/
    ├── quest-detail.tsx       # 퀘스트 상세/완료
    ├── quest-create.tsx       # 커스텀 퀘스트 추가
    └── level-up.tsx           # 레벨업 연출 모달
```

### 메인 홈 화면 (가장 중요)

```
┌─────────────────────────────────┐
│  [캐릭터 일러스트/아바타]        │
│  김철수 the 현자 · Lv.12        │
│  ━━━━━━━━━━░░░░░  340/800 XP    │
├─────────────────────────────────┤
│  오늘의 퀘스트                   │
│  ☐ 책 20페이지 읽기    +30 INT  │
│  ☐ 명상 10분           +20 WIS  │
│  ☑ 물 2L 마시기        +15 CON  │
├─────────────────────────────────┤
│  🔥 연속 5일 달성 중 (1.25x XP) │
└─────────────────────────────────┘
        [홈] [퀘스트] [스탯] [나]
```

---

## 🗄 데이터 모델 (SQLite 스키마)

```sql
-- 캐릭터 (1인 1캐릭터 가정)
CREATE TABLE character (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  class TEXT NOT NULL,        -- 'warrior' | 'sage' | 'monk' | ...
  level INTEGER DEFAULT 1,
  current_xp INTEGER DEFAULT 0,
  gold INTEGER DEFAULT 0,
  str INTEGER DEFAULT 10,
  int INTEGER DEFAULT 10,
  wis INTEGER DEFAULT 10,
  dex INTEGER DEFAULT 10,
  con INTEGER DEFAULT 10,
  cha INTEGER DEFAULT 10,
  unspent_stat_points INTEGER DEFAULT 0,
  created_at TEXT NOT NULL
);

-- 퀘스트 템플릿 (반복 가능한 퀘스트 정의)
CREATE TABLE quest_template (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  quest_type TEXT NOT NULL,       -- 'daily' | 'weekly' | 'custom'
  target_stat TEXT NOT NULL,      -- 'str' | 'int' | ...
  xp_reward INTEGER NOT NULL,
  repeat_pattern TEXT,            -- 'daily' | 'weekly' | 'mon,wed,fri' | null
  is_custom INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1
);

-- 퀘스트 완료 이력
CREATE TABLE quest_log (
  id INTEGER PRIMARY KEY,
  template_id INTEGER NOT NULL,
  completed_at TEXT NOT NULL,
  xp_gained INTEGER NOT NULL,
  stat_gained TEXT NOT NULL,
  streak_multiplier REAL DEFAULT 1.0,
  FOREIGN KEY (template_id) REFERENCES quest_template(id)
);

-- 연속 달성 추적
CREATE TABLE streak (
  id INTEGER PRIMARY KEY,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_completed_date TEXT
);

-- 획득 칭호
CREATE TABLE title (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  unlocked_at TEXT NOT NULL,
  is_equipped INTEGER DEFAULT 0
);
```

---

## 🧩 핵심 로직 (의사코드)

### 퀘스트 완료 처리
```typescript
function completeQuest(templateId: number) {
  const template = db.getQuestTemplate(templateId);
  const character = db.getCharacter();
  const streakMultiplier = calculateStreakBonus(); // 최대 2.0

  // 직업 보너스 (특화 스탯이면 1.5배)
  const classBonus = isClassSpecialty(character.class, template.target_stat) ? 1.5 : 1.0;

  const finalXp = Math.floor(template.xp_reward * streakMultiplier * classBonus);

  // 1. XP 추가
  character.current_xp += finalXp;
  // 2. 스탯 소폭 상승 (XP의 10%)
  character[template.target_stat] += Math.floor(finalXp * 0.1);
  // 3. 레벨업 체크 (여러 레벨 연속 업 가능)
  while (character.current_xp >= xpForNextLevel(character.level)) {
    character.current_xp -= xpForNextLevel(character.level);
    character.level += 1;
    character.unspent_stat_points += 3;
    triggerLevelUpModal();
  }
  // 4. 스트릭 갱신
  updateStreak();
  // 5. 칭호 언락 체크
  checkTitleUnlocks();

  db.saveCharacter(character);
  db.insertQuestLog({ templateId, xpGained: finalXp, ... });
}

function xpForNextLevel(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.5));
}
```

### 일일 퀘스트 자동 생성 (동기부여 로직)
```typescript
// 매일 00:00에 실행 (혹은 앱 실행 시 마지막 생성일 체크)
function generateDailyQuests(character: Character): Quest[] {
  const quests: Quest[] = [];
  // 규칙 1: 주력 스탯 퀘스트 2개 보장 (직업 정체성 강화)
  quests.push(...pickFromPool(character.class_main_stat, 2));
  // 규칙 2: 가장 낮은 스탯 퀘스트 1개 (약점 보완 동기부여)
  const weakestStat = findLowestStat(character);
  quests.push(...pickFromPool(weakestStat, 1));
  // 규칙 3: 랜덤 1개 (다양성)
  quests.push(pickRandomQuest());
  return quests;
}
```

---

## 🚀 개발 단계 (Claude Code 작업 순서)

Claude Code에게 **단계별로** 지시하세요. 한 번에 전부 시키면 맥락이 터집니다.

### Phase 1: 프로젝트 세팅 (30분)
```bash
npx create-expo-app@latest lifequest --template blank-typescript
cd lifequest
npx expo install expo-router expo-sqlite expo-notifications react-native-reanimated
npm install zustand nativewind
npm install -D tailwindcss
```
→ expo-router 설정, NativeWind 설정, 디렉토리 구조 생성

### Phase 2: 데이터 계층 (1시간)
- `db/schema.ts` — SQLite 테이블 생성
- `db/character.ts`, `db/quest.ts` — CRUD 함수
- `store/useCharacterStore.ts` — Zustand 스토어
- 시드 데이터: 직업별 기본 퀘스트 템플릿 30개

### Phase 3: 온보딩 플로우 (1시간)
- 직업 선택 카드 UI
- 캐릭터 이름 입력
- 완료 시 character 테이블에 INSERT

### Phase 4: 메인 홈 + 퀘스트 완료 (2시간) ⭐ **MVP 코어**
- 캐릭터 정보 카드 (레벨, XP 바)
- 오늘의 퀘스트 리스트
- 체크박스 탭 → `completeQuest()` 호출
- XP 바 애니메이션, 레벨업 모달 연출

### Phase 5: 퀘스트 관리 화면 (1.5시간)
- 일일/주간/커스텀 탭
- 커스텀 퀘스트 생성 모달

### Phase 6: 스탯 화면 + 레벨업 포인트 분배 (1시간)
- 6각형 레이더 차트 (react-native-svg)
- 남은 스탯 포인트 +/- UI

### Phase 7: 알림 + 스트릭 (1시간)
- expo-notifications로 오전 9시 리마인더
- 스트릭 뱃지 UI

### Phase 8: 폴리싱 + 실기기 테스트
- `npx expo start` → Expo Go 앱에서 QR 스캔
- 실기기에서 UX 다듬기

**예상 총 개발 시간:** 8~10시간 (Claude Code와 협업 시)

---

## 📲 휴대폰에서 실행하는 법

### 개발 중 (가장 쉬움)
1. 내 폰에 **Expo Go** 앱 설치 (iOS/Android 모두 있음)
2. 프로젝트 루트에서 `npx expo start`
3. 터미널에 뜬 QR 코드를 폰으로 스캔 → 즉시 앱 실행

### 앱스토어 배포 (나중에)
```bash
npm install -g eas-cli
eas login
eas build --platform ios      # 또는 android
eas submit                    # 스토어 제출
```

---

## ✅ MVP 체크리스트 (이것만 되면 쓸 수 있음)

- [ ] 직업 선택 후 캐릭터 생성
- [ ] 오늘의 퀘스트 3~5개 자동 표시
- [ ] 퀘스트 체크 → XP 증가 애니메이션
- [ ] 레벨업 시 모달 + 스탯 포인트 획득
- [ ] 커스텀 퀘스트 추가
- [ ] 6대 스탯 시각화
- [ ] 데이터 로컬 저장 (앱 재시작해도 유지)

---

## 🎨 디자인 톤

- **다크 모드 기본** — 판타지/RPG 분위기
- 주조색: 딥 네이비 (#0F172A) + 골드 액센트 (#FCD34D)
- 폰트: 시스템 폰트 + 제목에 **Cinzel** 또는 **NanumBarunGothic Bold** (한글 지원)
- 레벨업 연출은 과감하게 (파티클, 진동, 사운드) — 이게 앱의 재미 포인트

---

## 🔮 MVP 이후 로드맵 (선택)

- **인벤토리/장비 시스템** — 골드로 코스튬 구매 (캐릭터 커스터마이징)
- **Supabase 연동** — 클라우드 싱크, 친구와 레벨 비교
- **파티 시스템** — 친구와 같은 퀘스트 공유
- **월간 보스 레이드** — 커뮤니티 이벤트
- **AI 퀘스트 생성** — Claude API로 사용자 상태 기반 퀘스트 자동 생성

---

## 💡 Claude Code에 주는 규칙

1. **절대 백엔드 서버를 만들지 말 것.** 모든 데이터는 expo-sqlite에 로컬 저장.
2. **한 번에 한 Phase씩만 작업할 것.** Phase 완료 시 사용자 확인 후 다음 진행.
3. **UI 컴포넌트는 작게 쪼갤 것.** `components/` 디렉토리에 분리.
4. **타입은 엄격하게.** `any` 금지, 모든 함수/props에 타입 명시.
5. **한국어 UI 우선.** 문자열은 `constants/strings.ko.ts`에 모아두기 (나중에 다국어 확장 대비).
6. **실기기 테스트 안 된 기능은 "완료"로 표시하지 말 것.**
