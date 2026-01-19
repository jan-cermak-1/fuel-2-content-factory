/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Butler brand colors
        butler: {
          primary: '#14B8A6', // Teal-500 for AI features
          secondary: '#0D9488', // Teal-600
          accent: '#5EEAD4', // Teal-300
        },
        // Status colors
        status: {
          draft: '#38BDF8', // Sky-400
          'in-review': '#FBBF24', // Amber-400
          approved: '#60A5FA', // Blue-400
          released: '#34D399', // Emerald-400
          deprecated: '#FB7185', // Rose-400
        },
        // Impact colors
        impact: {
          high: '#F97316', // Orange-500
          growing: '#22C55E', // Green-500
          low: '#FBBF24', // Amber-500
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'panel': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      }
    },
  },
  plugins: [],
}
