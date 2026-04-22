# LifeQuest

자기계발 활동을 RPG 퀘스트로 변환해 캐릭터를 성장시키는 모바일 앱. Expo (React Native) + TypeScript + SQLite 기반 로컬 전용 MVP.

제품 스펙은 [`CLAUDE.md`](./CLAUDE.md) 참고.

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
app/               expo-router 화면 (index / onboarding / (tabs) / modals)
components/        재사용 UI (PrimaryButton, ClassCard, RadarChart, ...)
constants/         theme.ts, strings.ko.ts, classes.ts — 테마·문자열 상수
db/                SQLite 클라이언트, 스키마, CRUD, 일일 선정, 레벨링 로직
lib/               notifications.ts — expo-notifications 래퍼
store/             Zustand 스토어 (캐릭터, 스트릭, 오늘의 퀘스트)
```

## 테마 교체 (디자인 Phase 대비)

- 색상: `constants/theme.ts` (`COLORS`) + `tailwind.config.js` (`theme.extend.colors`) 두 파일만 수정
- 문자열: `constants/strings.ko.ts`
- 폰트: `tailwind.config.js`의 `fontFamily`에 커스텀 폰트 등록 후 `expo-font`로 로드

## 데이터

모든 데이터는 기기 로컬 SQLite (`expo-sqlite`)에 저장. 클라우드 싱크 없음. 프로필 탭의 "모든 데이터 초기화" 버튼으로 전체 리셋 가능.
