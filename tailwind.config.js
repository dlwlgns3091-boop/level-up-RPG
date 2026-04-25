/** @type {import('tailwindcss').Config} */
//
// Phase 12.A 기본 색은 Midnight Arcade. Phase 12.F (테마 토글) 도입 후
// 모든 색을 CSS 변수 var(--color-X)로 참조한다 — 루트 View에 `paletteToVars(palette)`를
// 깔면 var()가 런타임 팔레트로 해석되어 `bg-bg`, `text-gold` 같은 클래스가 자동으로
// 테마에 따라 갈아탄다.
//
// 변수 이름 ↔ JS 키 매핑:
//   --color-bg            <-> palette.bg
//   --color-bg-soft       <-> palette.bgSoft
//   --color-bg-softer     <-> palette.bgSofter
//   --color-text          <-> palette.text
//   --color-text-muted    <-> palette.textMuted
//   --color-gold          <-> palette.gold
//   --color-ink           <-> palette.ink
//   ...
// (lib/themeVars.ts의 paletteToVars()와 함께 수정할 것)
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
          DEFAULT: "var(--color-bg)",
          soft: "var(--color-bg-soft)",
          softer: "var(--color-bg-softer)",
          sunken: "var(--color-bg-sunken)",
        },
        // Text
        text: {
          DEFAULT: "var(--color-text)",
          muted: "var(--color-text-muted)",
          subtle: "var(--color-text-subtle)",
        },
        // Brand
        gold: {
          DEFAULT: "var(--color-gold)",
          dark: "var(--color-gold-dark)",
          soft: "var(--color-gold-soft)",
        },
        // Border + shadow 공용
        ink: {
          DEFAULT: "var(--color-ink)",
          shadow: "var(--color-ink-shadow)",
        },
        // Game stats
        hp: "var(--color-hp)",
        mp: "var(--color-mp)",
        xp: "var(--color-xp)",
        stamina: "var(--color-stamina)",
        // Semantic
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        danger: "var(--color-danger)",
        info: "var(--color-info)",
        // Rarity
        rarity: {
          common: "var(--color-rarity-common)",
          uncommon: "var(--color-rarity-uncommon)",
          rare: "var(--color-rarity-rare)",
          epic: "var(--color-rarity-epic)",
          legendary: "var(--color-rarity-legendary)",
        },
        // Category
        category: {
          exercise: "var(--color-category-exercise)",
          study: "var(--color-category-study)",
          creative: "var(--color-category-creative)",
          productivity: "var(--color-category-productivity)",
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
