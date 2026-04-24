# LifeQuest

자기계발 활동을 RPG 퀘스트로 변환해 캐릭터를 성장시키는 모바일 앱. Expo (React Native) + TypeScript + SQLite 기반 로컬 전용 MVP.

제품 스펙은 [`CLAUDE.md`](./CLAUDE.md) 참고. Phase 8.5 리팩토링 스펙은 별도 문서.

## 시스템 개요 (Phase 8.5)

### 4개 카테고리
모든 활동은 4개 카테고리 중 하나로 분류된다.

| 키 | 한글 | 색상 | 예시 |
|---|---|---|---|
| `exercise` | 운동 🏋️ | 빨강 | 헬스, 런닝, 스트레칭, 충분한 수면 |
| `study` | 공부 📚 | 파랑 | 독서, 강의, 언어 학습, 회고 |
| `creative` | 창작 🎨 | 보라 | 글·그림·코드·음악 작업, 일기 |
| `productivity` | 생산성 ⚡ | 초록 | 할 일 처리, 포모도로, 정리 |

### 자동 직업 시스템
직업은 **선택하지 않는다**. 누적 카테고리 XP의 비율을 기준으로 자동 결정되며, 매 레벨업마다 재평가된다. 16개 직업: 수련생(초기) / 4 순수형 / 6 2중조합 / 4 3중조합 / 퍼펙트 휴먼.

판정 임계값:
- `total < 50`: 수련생
- 활동 카테고리 `< 2`: 수련생
- 1위 비율 `>= 60%`: 해당 카테고리 순수형 (아이언 하트, 도서관의 마왕, 픽셀 마스터, 타임 해커)
- 4위 비율 `>= 18%`: 퍼펙트 휴먼
- 3위 `>= 20%` 그리고 4위 `< 12%`: 3중 조합 (르네상스인, 갓생 헌터, 스트리트 아티스트, 디지털 위자드)
- 그 외: 상위 2개로 2중 조합 결정

전직 시 직전 직업의 주력 카테고리에 5% 보너스를 줘 다시 판정 (Hysteresis) → 경계 근처에서 직업이 자주 바뀌지 않음.

### 일일 퀘스트 자동 생성
캐릭터의 카테고리 XP 비율을 기준으로 매일 4개를 뽑는다.
- 비율 1·2위 카테고리에서 각 1개 (주력 강화)
- 비율 4위 카테고리에서 1개 (약점 보완)
- 임의 카테고리에서 1개 (다양성)


## 실행 (Windows PowerShell 기준)

### 사전 준비 (한 번만)

- Node.js 20 LTS
- Git
- 폰에 **Expo Go** 앱 설치
- Windows: 방화벽 프롬프트가 뜨면 "허용"

### 개발 서버

```powershell
git clone https://github.com/dlwlgns3091-boop/level-up-rpg.git
cd level-up-rpg
git checkout claude/lifequest-rpg-app-cRIgE
npm install --legacy-peer-deps
npx expo start --clear
```

`--legacy-peer-deps`는 NativeWind ↔ expo-router peer dep 충돌 회피용. 필수.

Metro가 QR을 띄우면 폰과 PC가 **같은 Wi-Fi**에 있어야 접속 가능.

| 상황 | 해결 |
|---|---|
| 같은 Wi-Fi 불가 (회사 네트워크 등) | `npx expo start --tunnel` |
| 빌드/스타일 이상 동작 | `.expo/`·`node_modules/` 날리고 `npm install --legacy-peer-deps` |
| Babel 관련 캐시 문제 | `npx expo start --clear` |

## Dev Build (알림 실배달 확인용)

Android Expo Go는 SDK 53+부터 일부 푸시/로컬 알림을 차단하므로, 실제 배달 확인은 dev client 빌드가 필요하다. iOS Expo Go는 로컬 알림 대부분 동작.

```powershell
npm install -g eas-cli
eas login
eas build --profile development --platform android   # 또는 ios
```

빌드가 끝나면 `.apk`/`.ipa`를 기기에 설치한 뒤:

```powershell
npx expo start --dev-client
```

기기에서 dev client 앱을 열고 해당 번들을 로드.

## 디렉토리 구조

```
app/               expo-router 화면
  index.tsx          스플래시 → 캐릭터 유무로 분기
  onboarding/        welcome → character-create → intro
  (tabs)/            home, quests, stats, profile
  modals/            quest-detail, quest-create, level-up, class-change

components/        재사용 UI
  PrimaryButton, SegmentedTabs
  CharacterCard, XpBar, StreakBadge
  QuestRow, WeeklyQuestRow
  DiamondChart      4축 카테고리 차트 (Phase 8.5)

constants/
  categories.ts     4개 카테고리 메타 (Phase 8.5)
  classes.ts        16개 직업 메타 (Phase 8.5)
  theme.ts          COLORS — Tailwind 토큰과 동기화
  strings.ko.ts     한국어 문자열 단일 소스

types/
  category.ts       CategoryKey, CategoryXP, pickCategoryXp()

db/                SQLite (expo-sqlite)
  client, schema (v2)
  character, quest, daily, streak, classHistory  CRUD
  leveling          xpForNextLevel + applyXpGain
  seed              32 daily + 4 weekly 시드
  init              migrate + resetAllData

lib/
  classDeterminer.ts  determineClass() with hysteresis (Phase 8.5)
  notifications.ts    expo-notifications 래퍼
  haptic.ts           expo-haptics + Vibration 폴백

store/
  useCharacterStore.ts  Zustand (캐릭터, 스트릭, 오늘의 퀘스트, 직업변경 이벤트)
```

## 테마 교체 (디자인 Phase 대비)

- 색상: `constants/theme.ts` (`COLORS`) + `tailwind.config.js` (`theme.extend.colors`) 두 파일만 수정
- 문자열: `constants/strings.ko.ts`
- 폰트: `tailwind.config.js`의 `fontFamily`에 커스텀 폰트 등록 후 `expo-font`로 로드

## 데이터

개인 데이터(레벨·퀘스트·스탯·스트릭)는 전부 기기 로컬 SQLite(`expo-sqlite`). 프로필 탭 "모든 데이터 초기화"로 전체 리셋 가능.

커플 공유 데이터(사진·일정)만 Supabase를 사용 — 아래 Phase 11 섹션 참고. Supabase 환경 변수가 없으면 "우리" 탭이 비활성화될 뿐, 기존 기능은 그대로 동작.

## Phase 11 — 커플 공유 (Supabase)

둘이 공유하는 사진 라이브러리 + 일정은 Supabase 백엔드에 저장된다. 개인 데이터는 여전히 로컬이므로, Supabase를 설정하지 않아도 앱 전체가 동작한다.

### Supabase 프로젝트 1회 세팅

1. [supabase.com](https://supabase.com) 가입 → **New project**
   - Region: 한국에서 가까운 `ap-northeast-1`(도쿄) 권장
   - DB password는 안전한 곳에 보관 (관리 콘솔 접근에만 필요, 앱에선 안 씀)
2. 좌측 메뉴 **SQL Editor** → [`supabase/schema.sql`](./supabase/schema.sql) 내용을 전체 복사해서 붙여넣고 **Run**
3. 좌측 **Storage** → **New bucket**
   - 이름: `couple-photos`
   - **Public bucket 체크 해제** (Private로 유지)
4. 좌측 **Project Settings** → **API**
   - `Project URL` 복사
   - `anon public` 키 복사 (⚠️ `service_role` 아님)
5. 프로젝트 루트의 `.env.example`을 복사해 `.env` 생성:
   ```bash
   cp .env.example .env
   ```
   그리고 `.env`에 복사한 값 붙여넣기:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```
6. Expo 개발 서버 재시작: `npx expo start --clear`

### 왜 anon key를 클라이언트에 노출해도 안전한가

모든 테이블이 Row-Level Security로 잠겨 있어서, anon key는 "인증된 사용자 본인의 커플 데이터"에만 접근할 수 있다. `service_role` 키는 절대로 앱에 넣지 말 것 — 그건 모든 RLS를 우회한다.

### 환경 변수가 없을 때

`EXPO_PUBLIC_SUPABASE_URL` 또는 `EXPO_PUBLIC_SUPABASE_ANON_KEY`가 비어 있으면 `lib/supabase.ts`의 `supabase` export가 `null`이 되고, `SUPABASE_CONFIGURED`가 `false`가 된다. UI는 이 플래그를 보고 "우리" 탭을 비활성화하거나 세팅 안내를 표시한다. 기존 로컬 기능(홈/퀘스트/스탯/나)은 영향 없이 동작.
