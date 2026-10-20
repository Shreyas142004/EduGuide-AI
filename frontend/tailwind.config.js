/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7C3AED',
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        surface: {
          DEFAULT: '#ffffff',
          dark: '#111827',
        },
        border: {
          DEFAULT: '#e2e8f0',
          dark: '#1f2937',
        },
        text: {
          DEFAULT: '#0f172a',
          muted: '#64748b',
        },
        lavender: {
          lightest: '#f8fafc',
          light: '#f1f5f9',
          soft: '#e0e7ff',
          DEFAULT: '#818cf8',
          deep: '#4f46e5',
        },
        darkSurface: {
          DEFAULT: '#090d16',
          bg: '#090d16',
          secondary: '#0f172a',
          card: '#111827',
          cardElevated: '#1f2937',
          elevated: '#1f2937',
          border: '#1f2937',
          text: '#f8fafc',
          muted: '#94a3b8',
        },
        priority: {
          high: '#ef4444',
          medium: '#f59e0b',
          low: '#10b981',
        }
      },
      backgroundImage: {
        'lavender-gradient': 'linear-gradient(135deg, #6366f1, #4f46e5)',
        'lavender-strong': 'linear-gradient(135deg, #818cf8, #4f46e5)',
        'lavender-soft': 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
        'dark-lavender-gradient': 'linear-gradient(135deg, #1f2937, #111827)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
