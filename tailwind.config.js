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
        'lore-beige': {
          300: '#FBFAF9',
          400: '#F3F1EC',
          500: '#E7E3DA',
        },
        'lore-red': {
          400: '#DA5D49',
          500: '#C74225',
        },
        'lore-blue': {
          400: '#445761',
          500: '#303E45',
        },
        'lore-gray': {
          100: '#D9D9D9',
        },
      },
    },
    fontFamily: {
      sans: ['"Helvetica Neue"'],
      cinzel: ['Cinzel'],
    },
  },
  darkMode: 'class',
  plugins: [require('tailwind-scrollbar-hide')],
};
