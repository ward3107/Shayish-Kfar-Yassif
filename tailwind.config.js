/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.tsx",
    "./*.ts",
    "./components/**/*.tsx",
    "./pages/**/*.tsx",
    "./contexts/**/*.tsx",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        light: 'var(--color-text-main)',
        surface: 'var(--color-surface)',
        muted: 'var(--color-text-muted)',
      },
      fontFamily: {
        sans: ['Heebo', 'Assistant', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        arabic: ['Tajawal', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.25em',
      }
    },
  },
  plugins: [],
}
