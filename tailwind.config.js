/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0F172A",
          soft: "#1E293B",
          softer: "#334155",
        },
        gold: {
          DEFAULT: "#FCD34D",
          dark: "#B45309",
        },
        text: {
          DEFAULT: "#F8FAFC",
          muted: "#94A3B8",
        },
        danger: "#EF4444",
        category: {
          exercise: "#EF4444",
          study: "#3B82F6",
          creative: "#A855F7",
          productivity: "#10B981",
        },
      },
      fontFamily: {
        title: ["System"],
      },
    },
  },
  plugins: [],
};
