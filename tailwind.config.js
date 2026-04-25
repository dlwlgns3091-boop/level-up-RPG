/** @type {import('tailwindcss').Config} */
//
// Midnight Arcade 팔레트 (Phase 12.A).
// 값은 constants/theme.ts의 COLORS와 1:1 동기화. 둘 중 한 곳만 바뀌지 않도록 함께 수정.
//
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Surfaces
        bg: {
          DEFAULT: "#1E1A2E",
          soft: "#2B2640",
          softer: "#3A3352",
          sunken: "#141020",
        },
        // Text
        text: {
          DEFAULT: "#F5F0FF",
          muted: "#A89EC8",
          subtle: "#6B6288",
        },
        // Brand
        gold: {
          DEFAULT: "#FFD66B",
          dark: "#FFB84D",
          soft: "#4A3A00",
        },
        // Border + shadow 공용
        ink: {
          DEFAULT: "#0F0A1A",
          shadow: "#0A0614",
        },
        // Game stats
        hp: "#FF8FA8",
        mp: "#8FCFFF",
        xp: "#FFD66B",
        stamina: "#8EE4A8",
        // Semantic
        success: "#8EE4A8",
        warning: "#FFB84D",
        danger: "#FF8FA8",
        info: "#8FCFFF",
        // Rarity
        rarity: {
          common: "#A89EC8",
          uncommon: "#8EE4A8",
          rare: "#8FCFFF",
          epic: "#D4A8F5",
          legendary: "#FFB84D",
        },
        // Category
        category: {
          exercise: "#FF8FA8",
          study: "#8FCFFF",
          creative: "#D4A8F5",
          productivity: "#8EE4A8",
        },
      },
      borderRadius: {
        "pixel-sm": "4px",
        pixel: "8px",
        "pixel-lg": "12px",
        "pixel-xl": "16px",
      },
      borderWidth: {
        pixel: "2px",
      },
      // Phase 12.A에서 폰트 패밀리 토큰만 등록.
      // 실제 .ttf는 사용자가 assets/fonts/에 드롭한 뒤 lib/fonts.ts의 require()를 활성화해야 적용됨.
      // 미적용 상태에서는 RN이 system 폰트로 fallback (앱 크래시 없음).
      fontFamily: {
        "pixel-display": ["DungGeunMo", "monospace"],
        "pixel-ui": ["Galmuri11", "monospace"],
        "pixel-ui-bold": ["Galmuri11-Bold", "monospace"],
        body: ["Pretendard", "System"],
        "body-bold": ["Pretendard-Bold", "System"],
      },
    },
  },
  plugins: [],
};
