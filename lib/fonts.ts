import { useFonts } from "expo-font";

/**
 * 픽셀 폰트 로더 (Phase 12.A).
 *
 * 기본 상태(폰트 파일 없음)에서는 빈 객체를 넘겨 즉시 `loaded = true`를 반환한다.
 * 이때 `fontFamily: "Galmuri11"` 등 참조는 RN 시스템 폰트로 fallback되므로
 * 앱은 정상 부팅된다 (단, 픽셀 룩은 안 보임).
 *
 * ─────────────────────────────────────────────────────────────────
 * 폰트 파일을 받은 뒤 활성화하는 법:
 *   1. `assets/fonts/`에 다음 파일을 둔다 (정확한 파일명):
 *        - Galmuri11.ttf
 *        - Galmuri11-Bold.ttf
 *        - DungGeunMo.ttf
 *        - Pretendard-Regular.otf
 *        - Pretendard-Bold.otf
 *   2. 아래 객체에서 해당 require() 줄들의 주석을 해제한다.
 *   3. `npx expo start --clear`로 캐시 비우고 재시작.
 *
 * 폰트 출처:
 *   - Galmuri:    https://github.com/quiple/galmuri              (OFL)
 *   - DungGeunMo: https://cactus.tistory.com/193                 (무료 배포)
 *   - Pretendard: https://github.com/orioncactus/pretendard      (OFL)
 * ─────────────────────────────────────────────────────────────────
 *
 * @returns 폰트 로딩 완료 여부. 항상 boolean.
 */
export function useAppFonts(): boolean {
  const [loaded] = useFonts({
    // Galmuri11: require("../assets/fonts/Galmuri11.ttf"),
    // "Galmuri11-Bold": require("../assets/fonts/Galmuri11-Bold.ttf"),
    // DungGeunMo: require("../assets/fonts/DungGeunMo.ttf"),
    // Pretendard: require("../assets/fonts/Pretendard-Regular.otf"),
    // "Pretendard-Bold": require("../assets/fonts/Pretendard-Bold.otf"),
  });
  return loaded;
}
