import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase는 옵션이다. env 변수가 비어 있으면 클라이언트는 null로 유지되고
 * 기존 로컬 전용 모드가 그대로 작동한다. 모든 호출부는 SUPABASE_CONFIGURED 또는
 * supabase 존재 여부를 먼저 체크할 것.
 *
 * Phase 11.2에서 auth 세션 저장을 SecureStore로 바꿀지 여부를 재평가.
 * 현재는 Supabase 공식 React Native 가이드를 따라 AsyncStorage 사용.
 */

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const SUPABASE_CONFIGURED = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

let _client: SupabaseClient | null = null;

if (SUPABASE_CONFIGURED && SUPABASE_URL && SUPABASE_ANON_KEY) {
  try {
    _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
  } catch (e) {
    if (__DEV__) {
      console.log("[supabase] createClient failed:", e);
    }
    _client = null;
  }
}

/** `null`이면 env 미설정 또는 초기화 실패. 호출부에서 반드시 체크. */
export const supabase: SupabaseClient | null = _client;

/** 명시적으로 호출부에서 에러를 원할 때 사용. */
export function requireSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      "Supabase가 설정되지 않았습니다. .env에 EXPO_PUBLIC_SUPABASE_URL과 EXPO_PUBLIC_SUPABASE_ANON_KEY를 설정하고 개발 서버를 재시작하세요.",
    );
  }
  return supabase;
}
