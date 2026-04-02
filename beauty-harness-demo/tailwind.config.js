/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0f',
        surface: '#13131a',
        'surface-2': '#1a1a24',
        'surface-3': '#22222e',
        accent: '#6c5ce7',
        'accent-light': '#a29bfe',
        success: '#00d2a0',
        warning: '#ffb347',
        danger: '#ff6b6b',
        pink: '#fd79a8',
        'text-primary': '#e8e8ed',
        'text-secondary': '#8b8b9e',
        'text-tertiary': '#55556a',
      },
    },
  },
  plugins: [],
}
