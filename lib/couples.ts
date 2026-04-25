import { normalizeErrorMessage } from "./errors";
import { requireSupabase } from "./supabase";

/**
 * 사용자-가독성 우선 코드 알파벳. 0/O, 1/I/L 등 헷갈리는 글자는 제외.
 * 6자 × 31종 ≈ 8.8억 조합 → 충돌 매우 드물지만 INSERT는 UNIQUE 충돌 시 재시도.
 */
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 6;
const MAX_INSERT_ATTEMPTS = 5;

export type Couple = {
  id: string;
  user_a: string;
  user_b: string | null;
  invite_code: string | null;
  anniversary: string | null;
  created_at: string;
  connected_at: string | null;
};

export function generateInviteCode(): string {
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    const idx = Math.floor(Math.random() * CODE_ALPHABET.length);
    code += CODE_ALPHABET[idx];
  }
  return code;
}

export async function fetchMyCouple(): Promise<Couple | null> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("couples")
    .select("*")
    .maybeSingle<Couple>();
  if (error) throw error;
  return data ?? null;
}

export async function createCoupleInvite(): Promise<Couple> {
  const supabase = requireSupabase();
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr) throw userErr;
  const uid = userData.user?.id;
  if (!uid) throw new Error("not_authenticated");

  let lastError: unknown = null;
  for (let attempt = 0; attempt < MAX_INSERT_ATTEMPTS; attempt++) {
    const code = generateInviteCode();
    const { data, error } = await supabase
      .from("couples")
      .insert({ user_a: uid, invite_code: code })
      .select()
      .single<Couple>();

    if (!error && data) return data;

    lastError = error;
    // 23505 = unique_violation (invite_code 충돌이면 재시도)
    if (error && (error.code === "23505" || /duplicate|unique/i.test(error.message))) {
      continue;
    }
    throw error ?? new Error("failed_to_create_couple");
  }
  throw lastError ?? new Error("failed_to_allocate_code");
}

export async function redeemInvite(code: string): Promise<string> {
  const supabase = requireSupabase();
  const trimmed = code.trim().toUpperCase();
  const { data, error } = await supabase.rpc("redeem_invite_code", {
    code: trimmed,
  });
  if (error) {
    console.error("[couple] redeem rpc error:", error);
    throw error;
  }
  if (typeof data !== "string") {
    console.error("[couple] redeem unexpected shape:", data);
    throw new Error("redeem_invite_code_returned_unexpected_shape");
  }
  return data;
}

export async function updateAnniversary(
  coupleId: string,
  anniversary: string | null,
): Promise<Couple> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("couples")
    .update({ anniversary })
    .eq("id", coupleId)
    .select()
    .single<Couple>();
  if (error || !data) throw error ?? new Error("anniversary_update_failed");
  return data;
}

/** 연결 전(user_b가 없는) 자기 초대만 삭제 가능. */
export async function cancelPendingInvite(coupleId: string): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase
    .from("couples")
    .delete()
    .eq("id", coupleId)
    .is("user_b", null);
  if (error) throw error;
}

/**
 * 에러 객체/문자열/태그 어떤 형태든 받아 한국어로 변환.
 * PostgrestError는 `{ message: "not_authenticated", ... }` 형태이므로
 * 메시지를 추출한 뒤 태그 매칭.
 */
export function translateCoupleError(input: unknown): string {
  const raw = normalizeErrorMessage(input);
  const lower = raw.toLowerCase();
  if (lower.includes("not_authenticated")) return "로그인이 필요합니다.";
  if (lower.includes("invalid_code")) return "코드를 입력해주세요.";
  if (lower.includes("invalid_or_used"))
    return "유효하지 않거나 이미 사용된 코드입니다.";
  if (lower.includes("cannot_join_own"))
    return "본인이 생성한 코드는 사용할 수 없습니다.";
  if (lower.includes("already_connected"))
    return "이미 연결되어 있습니다.";
  if (lower.includes("failed_to_allocate_code"))
    return "코드 생성에 실패했습니다. 잠시 후 다시 시도해주세요.";
  if (lower.includes("network") || lower.includes("fetch"))
    return "네트워크 오류입니다. 연결을 확인해주세요.";
  return raw;
}

/** 하루 단위 D+일 계산. anniversary가 null이면 null 반환. */
export function daysSince(anniversary: string | null): number | null {
  if (!anniversary) return null;
  const parts = anniversary.split("-").map((s) => Number(s));
  if (parts.length !== 3) return null;
  const y = parts[0] ?? 0;
  const m = parts[1] ?? 0;
  const d = parts[2] ?? 0;
  if (!y || !m || !d) return null;
  const start = new Date(Date.UTC(y, m - 1, d));
  const now = new Date();
  const nowUtc = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
  const diff = Math.floor(
    (nowUtc.getTime() - start.getTime()) / (24 * 60 * 60 * 1000),
  );
  return diff >= 0 ? diff + 1 : null; // D+1 = 만난 첫째 날
}
