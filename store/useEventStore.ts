import { create } from "zustand";
import {
  type CoupleEvent,
  createEvent as apiCreateEvent,
  deleteEvent as apiDeleteEvent,
  type EventWithPhotos,
  getEventWithPhotos as apiGetEventWithPhotos,
  listEvents as apiListEvents,
  type NewEventInput,
  translateEventError,
  updateEvent as apiUpdateEvent,
  type UpdateEventInput,
} from "@/lib/events";

export type EventActionResult<T = void> =
  | { ok: true; value: T }
  | { ok: false; errorMessage: string };

type EventState = {
  events: CoupleEvent[];
  isLoading: boolean;
  busy: boolean;
  lastError: string | null;

  load: (coupleId: string) => Promise<void>;
  fetchOne: (id: string) => Promise<EventWithPhotos | null>;
  create: (input: NewEventInput) => Promise<EventActionResult<EventWithPhotos>>;
  update: (input: UpdateEventInput) => Promise<EventActionResult<CoupleEvent>>;
  remove: (id: string) => Promise<EventActionResult>;
  clear: () => void;
};

export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  isLoading: false,
  busy: false,
  lastError: null,

  load: async (coupleId) => {
    set({ isLoading: true });
    try {
      const events = await apiListEvents(coupleId);
      set({ events, lastError: null });
    } catch (e) {
      console.error("[events] load error:", e);
      set({ lastError: translateEventError(e) });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchOne: async (id) => {
    try {
      return await apiGetEventWithPhotos(id);
    } catch (e) {
      console.error("[events] fetchOne error:", e);
      set({ lastError: translateEventError(e) });
      return null;
    }
  },

  create: async (input) => {
    if (get().busy) {
      return { ok: false, errorMessage: "잠시 후 다시 시도해주세요." };
    }
    set({ busy: true });
    try {
      const created = await apiCreateEvent(input);
      const next = [created, ...get().events].sort((a, b) => {
        if (a.event_date === b.event_date) {
          return b.created_at.localeCompare(a.created_at);
        }
        return b.event_date.localeCompare(a.event_date);
      });
      set({ events: next, lastError: null });
      return { ok: true, value: created };
    } catch (e) {
      console.error("[events] create error:", e);
      const pretty = translateEventError(e);
      set({ lastError: pretty });
      return { ok: false, errorMessage: pretty };
    } finally {
      set({ busy: false });
    }
  },

  update: async (input) => {
    set({ busy: true });
    try {
      const updated = await apiUpdateEvent(input);
      const next = get()
        .events.map((e) => (e.id === input.id ? updated : e))
        .sort((a, b) => {
          if (a.event_date === b.event_date) {
            return b.created_at.localeCompare(a.created_at);
          }
          return b.event_date.localeCompare(a.event_date);
        });
      set({ events: next, lastError: null });
      return { ok: true, value: updated };
    } catch (e) {
      console.error("[events] update error:", e);
      const pretty = translateEventError(e);
      set({ lastError: pretty });
      return { ok: false, errorMessage: pretty };
    } finally {
      set({ busy: false });
    }
  },

  remove: async (id) => {
    set({ busy: true });
    try {
      await apiDeleteEvent(id);
      set({
        events: get().events.filter((e) => e.id !== id),
        lastError: null,
      });
      return { ok: true, value: undefined };
    } catch (e) {
      console.error("[events] remove error:", e);
      const pretty = translateEventError(e);
      set({ lastError: pretty });
      return { ok: false, errorMessage: pretty };
    } finally {
      set({ busy: false });
    }
  },

  clear: () => set({ events: [], lastError: null }),
}));
