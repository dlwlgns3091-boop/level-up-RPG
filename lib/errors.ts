/**
 * 잡다한 소스(PostgrestError, AuthError, Error, plain string, 기타 객체)에서
 * 사람이 읽을 수 있는 메시지 하나를 뽑는다.
 *
 * `String(e)`가 `"[object Object]"`를 돌려주는 문제를 이 한 곳에서 해결한다.
 */
export function normalizeErrorMessage(e: unknown): string {
  if (e == null) return "알 수 없는 오류";
  if (typeof e === "string") return e;
  if (e instanceof Error) return e.message;

  if (typeof e === "object") {
    const obj = e as Record<string, unknown>;

    const direct = [
      obj.message,
      obj.error_description,
      obj.description,
      obj.error,
      obj.statusText,
    ];
    for (const c of direct) {
      if (typeof c === "string" && c.length > 0) return c;
    }

    // Supabase의 {error: {message}} 중첩 케이스
    if (obj.error && typeof obj.error === "object") {
      const inner = obj.error as Record<string, unknown>;
      if (typeof inner.message === "string" && inner.message.length > 0) {
        return inner.message;
      }
    }

    const supplemental = [obj.details, obj.hint, obj.code];
    for (const c of supplemental) {
      if (typeof c === "string" && c.length > 0) return c;
    }

    try {
      const json = JSON.stringify(e);
      if (json && json !== "{}") return json;
    } catch {
      // JSON.stringify 실패 시 아래 fallback
    }
  }

  try {
    return String(e);
  } catch {
    return "알 수 없는 오류";
  }
}
