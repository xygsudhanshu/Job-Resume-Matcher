/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0F1F3D",
          light: "#1B3159",
          dark: "#091428",
        },
        amber: {
          DEFAULT: "#E8A33D",
          light: "#F3C583",
          dark: "#C4841F",
        },
        cream: "#FAF9F6",
        ink: "#1D2939",
        muted: "#475467",
        line: "#E4E2DC",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 31, 61, 0.06), 0 4px 12px rgba(15, 31, 61, 0.06)",
        cardHover: "0 2px 4px rgba(15, 31, 61, 0.08), 0 8px 24px rgba(15, 31, 61, 0.1)",
      },
    },
  },
  plugins: [],
}
