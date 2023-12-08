const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    fontFamily: {
      sans: [
        "var(--font-sans)",
        '"Helvetica Neue"',
        ...defaultTheme.fontFamily.sans,
      ],
      cinzel: ["Cinzel"],
    },
    screens: {
      xs: "475px",
      ...defaultTheme.screens,
    },
    extend: {
      colors: {
        "lore-beige": {
          100: "#FAF9F7",
          300: "#FBFAF9",
          400: "#F3F1EC",
          500: "#E7E3DA",
        },
        "lore-red": {
          400: "#DA5D49",
          500: "#C74225",
        },
        "lore-blue": {
          200: "#4C7F8F",
          300: "#2D6172",
          400: "#445761",
          500: "#303E45",
        },
        "lore-gray": {
          100: "#D9D9D9",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("tailwindcss-animate")],
};
