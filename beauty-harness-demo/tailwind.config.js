/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#000000',
        surface: '#0a0a0a',
        's2': '#141414',
        's3': '#1c1c1e',
        's4': '#2c2c2e',
        accent: '#6c5ce7',
        'accent-2': '#a29bfe',
        green: '#30d158',
        red: '#ff453a',
        orange: '#ff9f0a',
        pink: '#ff375f',
        blue: '#0a84ff',
        teal: '#64d2ff',
        't1': '#f5f5f7',
        't2': '#98989f',
        't3': '#48484a',
      },
    },
  },
  plugins: [],
}
