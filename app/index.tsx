import { Redirect } from "expo-router";

/**
 * Phase 1 placeholder: 무조건 온보딩으로 보냅니다.
 * Phase 3에서 캐릭터 존재 여부에 따라 (tabs)/home 으로 분기합니다.
 */
export default function Index() {
  return <Redirect href="/onboarding/welcome" />;
}
