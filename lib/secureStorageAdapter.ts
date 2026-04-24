import * as SecureStore from "expo-secure-store";

/**
 * Supabase JWT(특히 refresh token)가 iOS SecureStore의 2KB 값 제한을
 * 넘길 수 있어서 청크 단위로 나눠 저장하는 어댑터.
 *
 * 저장 형식:
 *   `<key>__len`     = 청크 개수 (정수 문자열)
 *   `<key>__0`..N-1  = 각 청크의 문자열
 *
 * 모든 연산은 best-effort. 실패 시 조용히 null을 반환해
 * Supabase가 세션 재구성을 다시 시도하도록 한다.
 */

const CHUNK_SIZE = 1800;

function chunkKey(key: string, index: number): string {
  return `${key}__${index}`;
}

function lenKey(key: string): string {
  return `${key}__len`;
}

async function getItem(key: string): Promise<string | null> {
  try {
    const lenStr = await SecureStore.getItemAsync(lenKey(key));
    if (!lenStr) return null;
    const n = Number(lenStr);
    if (!Number.isInteger(n) || n < 0) return null;
    if (n === 0) return "";
    const parts: string[] = [];
    for (let i = 0; i < n; i++) {
      const piece = await SecureStore.getItemAsync(chunkKey(key, i));
      if (piece == null) return null; // 부분 손상
      parts.push(piece);
    }
    return parts.join("");
  } catch (e) {
    if (__DEV__) console.log("[secureStore] getItem failed:", e);
    return null;
  }
}

async function removeItem(key: string): Promise<void> {
  try {
    const lenStr = await SecureStore.getItemAsync(lenKey(key));
    if (lenStr) {
      const n = Number(lenStr);
      if (Number.isInteger(n) && n > 0) {
        for (let i = 0; i < n; i++) {
          await SecureStore.deleteItemAsync(chunkKey(key, i)).catch(
            () => undefined,
          );
        }
      }
    }
    await SecureStore.deleteItemAsync(lenKey(key)).catch(() => undefined);
  } catch (e) {
    if (__DEV__) console.log("[secureStore] removeItem failed:", e);
  }
}

async function setItem(key: string, value: string): Promise<void> {
  try {
    await removeItem(key);
    if (value.length === 0) {
      await SecureStore.setItemAsync(lenKey(key), "0");
      return;
    }
    const chunks: string[] = [];
    for (let i = 0; i < value.length; i += CHUNK_SIZE) {
      chunks.push(value.slice(i, i + CHUNK_SIZE));
    }
    for (let i = 0; i < chunks.length; i++) {
      const part = chunks[i];
      if (part === undefined) continue;
      await SecureStore.setItemAsync(chunkKey(key, i), part);
    }
    await SecureStore.setItemAsync(lenKey(key), String(chunks.length));
  } catch (e) {
    if (__DEV__) console.log("[secureStore] setItem failed:", e);
  }
}

/** Supabase auth.storage 에 주입할 어댑터. */
export const secureStorageAdapter = {
  getItem,
  setItem,
  removeItem,
};
