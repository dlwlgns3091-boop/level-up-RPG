import { create } from "zustand";
import {
  type CouplePhoto,
  deletePhoto as apiDeletePhoto,
  listPhotos as apiListPhotos,
  signUrls as apiSignUrls,
  translatePhotoError,
  updateCaption as apiUpdateCaption,
  uploadPhoto as apiUploadPhoto,
  type UploadInput,
} from "@/lib/photos";

export type PhotoActionResult =
  | { ok: true }
  | { ok: false; errorMessage: string };

type PhotoState = {
  photos: CouplePhoto[];
  /** storage_path -> signed URL (1시간 유효) */
  signedUrls: Record<string, string>;
  isLoading: boolean;
  busy: boolean;
  lastError: string | null;

  load: (coupleId: string) => Promise<void>;
  upload: (input: UploadInput) => Promise<PhotoActionResult>;
  remove: (photo: CouplePhoto) => Promise<PhotoActionResult>;
  editCaption: (photoId: string, caption: string | null) => Promise<PhotoActionResult>;
  /** 수동으로 signed URL 재발급 (만료·UI 갱신용) */
  refreshUrls: () => Promise<void>;
  clear: () => void;
};

export const usePhotoStore = create<PhotoState>((set, get) => ({
  photos: [],
  signedUrls: {},
  isLoading: false,
  busy: false,
  lastError: null,

  load: async (coupleId) => {
    set({ isLoading: true });
    try {
      const photos = await apiListPhotos(coupleId);
      const paths = photos.map((p) => p.storage_path);
      const signedUrls = paths.length > 0 ? await apiSignUrls(paths) : {};
      set({ photos, signedUrls, lastError: null });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      set({ lastError: translatePhotoError(msg) });
    } finally {
      set({ isLoading: false });
    }
  },

  upload: async (input) => {
    if (get().busy) {
      return { ok: false, errorMessage: "잠시 후 다시 시도해주세요." };
    }
    set({ busy: true });
    try {
      const row = await apiUploadPhoto(input);
      const [currentPhotos] = [get().photos];
      const nextPhotos = [row, ...currentPhotos].sort((a, b) => {
        if (a.taken_at === b.taken_at) {
          return b.uploaded_at.localeCompare(a.uploaded_at);
        }
        return b.taken_at.localeCompare(a.taken_at);
      });
      const signed = await apiSignUrls([row.storage_path]);
      set({
        photos: nextPhotos,
        signedUrls: { ...get().signedUrls, ...signed },
        lastError: null,
      });
      return { ok: true };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      const pretty = translatePhotoError(msg);
      set({ lastError: pretty });
      return { ok: false, errorMessage: pretty };
    } finally {
      set({ busy: false });
    }
  },

  remove: async (photo) => {
    set({ busy: true });
    try {
      await apiDeletePhoto(photo);
      const nextPhotos = get().photos.filter((p) => p.id !== photo.id);
      const urls = { ...get().signedUrls };
      delete urls[photo.storage_path];
      set({ photos: nextPhotos, signedUrls: urls, lastError: null });
      return { ok: true };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      const pretty = translatePhotoError(msg);
      set({ lastError: pretty });
      return { ok: false, errorMessage: pretty };
    } finally {
      set({ busy: false });
    }
  },

  editCaption: async (photoId, caption) => {
    set({ busy: true });
    try {
      const updated = await apiUpdateCaption(photoId, caption);
      const nextPhotos = get().photos.map((p) =>
        p.id === photoId ? updated : p,
      );
      set({ photos: nextPhotos, lastError: null });
      return { ok: true };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      const pretty = translatePhotoError(msg);
      set({ lastError: pretty });
      return { ok: false, errorMessage: pretty };
    } finally {
      set({ busy: false });
    }
  },

  refreshUrls: async () => {
    const paths = get().photos.map((p) => p.storage_path);
    if (paths.length === 0) return;
    try {
      const signed = await apiSignUrls(paths);
      set({ signedUrls: signed });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      set({ lastError: translatePhotoError(msg) });
    }
  },

  clear: () => set({ photos: [], signedUrls: {}, lastError: null }),
}));
