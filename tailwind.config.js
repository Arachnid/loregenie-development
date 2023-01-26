/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'lore-beige': '#E7E3DA',
        'lore-light-beige': '#F3F1EC',
        'lore-red': '#DA5D49',
        'lore-blue': '#445761',
      },
    },
    fontFamily: {
      sans: ['"Helvetica Neue"'],
    },
  },
  darkMode: 'class',
  plugins: [],
};
