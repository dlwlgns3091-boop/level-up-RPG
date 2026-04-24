import { create } from "zustand";
import {
  cancelPendingInvite,
  type Couple,
  createCoupleInvite,
  fetchMyCouple,
  redeemInvite,
  translateCoupleError,
} from "@/lib/couples";
import { SUPABASE_CONFIGURED, supabase } from "@/lib/supabase";

export type CoupleActionResult =
  | { ok: true }
  | { ok: false; errorMessage: string };

type CoupleState = {
  couple: Couple | null;
  isLoading: boolean;
  busy: boolean;
  lastError: string | null;

  loadCouple: () => Promise<void>;
  createInvite: () => Promise<CoupleActionResult>;
  redeem: (code: string) => Promise<CoupleActionResult>;
  cancelInvite: () => Promise<void>;
  clear: () => void;
};

export const useCoupleStore = create<CoupleState>((set, get) => ({
  couple: null,
  isLoading: false,
  busy: false,
  lastError: null,

  loadCouple: async () => {
    if (!SUPABASE_CONFIGURED || !supabase) {
      set({ couple: null });
      return;
    }
    set({ isLoading: true });
    try {
      const couple = await fetchMyCouple();
      set({ couple, lastError: null });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      set({ lastError: translateCoupleError(msg) });
    } finally {
      set({ isLoading: false });
    }
  },

  createInvite: async () => {
    if (get().busy) {
      return { ok: false, errorMessage: "잠시 후 다시 시도해주세요." };
    }
    set({ busy: true });
    try {
      const couple = await createCoupleInvite();
      set({ couple, lastError: null });
      return { ok: true };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      const pretty = translateCoupleError(msg);
      set({ lastError: pretty });
      return { ok: false, errorMessage: pretty };
    } finally {
      set({ busy: false });
    }
  },

  redeem: async (code) => {
    if (get().busy) {
      return { ok: false, errorMessage: "잠시 후 다시 시도해주세요." };
    }
    set({ busy: true });
    try {
      await redeemInvite(code);
      const couple = await fetchMyCouple();
      set({ couple, lastError: null });
      return { ok: true };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      const pretty = translateCoupleError(msg);
      set({ lastError: pretty });
      return { ok: false, errorMessage: pretty };
    } finally {
      set({ busy: false });
    }
  },

  cancelInvite: async () => {
    const current = get().couple;
    if (!current || current.user_b) return;
    set({ busy: true });
    try {
      await cancelPendingInvite(current.id);
      set({ couple: null, lastError: null });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      set({ lastError: translateCoupleError(msg) });
    } finally {
      set({ busy: false });
    }
  },

  clear: () => set({ couple: null, lastError: null }),
}));
