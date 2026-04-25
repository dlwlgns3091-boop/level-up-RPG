# Pixel Fonts

Phase 12.A에서 픽셀 비주얼을 활성화하려면 이 폴더에 다음 5개 파일을 두세요. 파일명은 정확히 일치해야 합니다 (대소문자 포함).

| 파일명 | 출처 | 라이선스 |
|---|---|---|
| `Galmuri11.ttf` | https://github.com/quiple/galmuri/releases | OFL |
| `Galmuri11-Bold.ttf` | https://github.com/quiple/galmuri/releases | OFL |
| `DungGeunMo.ttf` | https://cactus.tistory.com/193 | 무료 배포 |
| `Pretendard-Regular.otf` | https://github.com/orioncactus/pretendard/releases | OFL |
| `Pretendard-Bold.otf` | https://github.com/orioncactus/pretendard/releases | OFL |

## 활성화 절차

1. 위 5개 파일을 이 디렉토리(`assets/fonts/`)에 그대로 둔다.
2. `lib/fonts.ts`를 열어 `useFonts({...})` 안의 `require()` 5줄의 주석을 해제한다.
3. `npx expo start --clear` (Metro 캐시 비움)
4. 폰트 로딩 동안 짧은 빈 화면이 보인 뒤 픽셀 텍스트가 적용됨.

## 파일이 없거나 주석을 해제하지 않은 상태

- `useAppFonts()`가 즉시 `true`를 반환 → 앱은 정상 부팅
- `fontFamily: "Galmuri11"` 등은 RN 시스템 폰트로 fallback
- 픽셀 룩만 안 보일 뿐, 기능은 그대로

## 용량 팁

Galmuri/Pretendard 한글 풀셋은 수 MB. 한국어 KS완성형 서브셋 버전이 가능하면 그게 더 가볍습니다 (배포 시 앱 크기 절감).
