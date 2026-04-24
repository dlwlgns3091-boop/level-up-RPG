import type { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";
import { SUPABASE_CONFIGURED, supabase } from "@/lib/supabase";

export type AuthResult =
  | { ok: true }
  | { ok: false; errorMessage: string };

type AuthState = {
  /** 부트스트랩(세션 복원)이 끝났는지. 초기 false. */
  isReady: boolean;
  /** 로그인 상태. null이면 비로그인 또는 Supabase 미설정. */
  session: Session | null;
  user: User | null;
  /** 현재 로그인/회원가입/로그아웃 중인지 (UI disable 용). */
  busy: boolean;

  hydrate: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
};

let subscribed = false;

function translateAuthError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("invalid login credentials")) {
    return "이메일 또는 비밀번호가 올바르지 않습니다.";
  }
  if (lower.includes("email not confirmed")) {
    return "이메일 인증이 완료되지 않았습니다. 받은 편지함을 확인해주세요.";
  }
  if (lower.includes("user already registered")) {
    return "이미 가입된 이메일입니다. 로그인해주세요.";
  }
  if (lower.includes("password should be at least")) {
    return "비밀번호는 6자 이상이어야 합니다.";
  }
  if (lower.includes("unable to validate email") || lower.includes("invalid email")) {
    return "이메일 형식이 올바르지 않습니다.";
  }
  return message;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isReady: false,
  session: null,
  user: null,
  busy: false,

  hydrate: async () => {
    if (!SUPABASE_CONFIGURED || !supabase) {
      set({ isReady: true, session: null, user: null });
      return;
    }
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        if (__DEV__) console.log("[auth] getSession error:", error.message);
      }
      const session = data.session ?? null;
      set({
        isReady: true,
        session,
        user: session?.user ?? null,
      });

      if (!subscribed) {
        subscribed = true;
        supabase.auth.onAuthStateChange((_event, nextSession) => {
          set({
            session: nextSession,
            user: nextSession?.user ?? null,
          });
        });
      }
    } catch (e) {
      if (__DEV__) console.log("[auth] hydrate failed:", e);
      set({ isReady: true, session: null, user: null });
    }
  },

  signIn: async (email, password) => {
    if (!supabase) {
      return { ok: false, errorMessage: "Supabase가 설정되지 않았습니다." };
    }
    if (get().busy) return { ok: false, errorMessage: "잠시 후 다시 시도해주세요." };
    set({ busy: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        return { ok: false, errorMessage: translateAuthError(error.message) };
      }
      set({ session: data.session, user: data.user });
      return { ok: true };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return { ok: false, errorMessage: translateAuthError(msg) };
    } finally {
      set({ busy: false });
    }
  },

  signUp: async (email, password) => {
    if (!supabase) {
      return { ok: false, errorMessage: "Supabase가 설정되지 않았습니다." };
    }
    if (get().busy) return { ok: false, errorMessage: "잠시 후 다시 시도해주세요." };
    set({ busy: true });
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });
      if (error) {
        return { ok: false, errorMessage: translateAuthError(error.message) };
      }
      // Supabase 프로젝트가 이메일 확인을 요구하면 data.session은 null.
      set({ session: data.session ?? null, user: data.user ?? null });
      return { ok: true };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return { ok: false, errorMessage: translateAuthError(msg) };
    } finally {
      set({ busy: false });
    }
  },

  signOut: async () => {
    if (!supabase) return;
    set({ busy: true });
    try {
      await supabase.auth.signOut();
      set({ session: null, user: null });
    } catch (e) {
      if (__DEV__) console.log("[auth] signOut failed:", e);
    } finally {
      set({ busy: false });
    }
  },
}));
