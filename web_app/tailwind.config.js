/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#07090e',
          800: '#0f172a',
          700: '#1e293b',
          600: '#334155'
        },
        brand: {
          cyan: '#38bdf8',
          gold: '#fbbf24',
          purple: '#c084fc',
          emerald: '#34d399'
        }
      }
    },
  },
  plugins: [],
}
