const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
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
    },
    fontFamily: {
      sans: ['"Helvetica Neue"'],
      cinzel: ["Cinzel"],
    },
    screens: {
      xs: "475px",
      ...defaultTheme.screens,
    },
  },
  darkMode: "class",
  plugins: [
    require("tailwind-scrollbar-hide"),
    require("@tailwindcss/line-clamp"),
  ],
};
