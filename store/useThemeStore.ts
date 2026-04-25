import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import {
  MIDNIGHT_PALETTE,
  PALETTES,
  type Palette,
  type ThemeId,
} from "@/constants/themes";

const STORAGE_KEY = "lifequest:theme";

type ThemeState = {
  themeId: ThemeId;
  palette: Palette;
  isReady: boolean;

  hydrate: () => Promise<void>;
  setTheme: (id: ThemeId) => Promise<void>;
};

function isValidId(value: unknown): value is ThemeId {
  return value === "midnight" || value === "butter";
}

export const useThemeStore = create<ThemeState>((set) => ({
  themeId: "midnight",
  palette: MIDNIGHT_PALETTE,
  isReady: false,

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const id: ThemeId = isValidId(raw) ? raw : "midnight";
      set({ themeId: id, palette: PALETTES[id], isReady: true });
    } catch (e) {
      console.error("[theme] hydrate error:", e);
      set({ isReady: true });
    }
  },

  setTheme: async (id) => {
    set({ themeId: id, palette: PALETTES[id] });
    try {
      await AsyncStorage.setItem(STORAGE_KEY, id);
    } catch (e) {
      console.error("[theme] persist error:", e);
    }
  },
}));
