/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#040B15',
          900: '#071426',
          850: '#0A1B33',
          800: '#0E2445',
          700: '#153664',
          600: '#1E4985',
        },
        brand: {
          blue: '#2563EB',
          'blue-light': '#3B82F6',
          'blue-dark': '#1D4ED8',
          cyan: '#06B6D4',
          'cyan-light': '#22D3EE',
          'cyan-dark': '#0891B2',
          bg: '#071426',
          surface: '#0E2445',
          'surface-light': '#153664',
          card: '#0B1C36',
          border: 'rgba(37, 99, 235, 0.18)',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(37, 99, 235, 0.25)',
        'glow-md': '0 0 25px rgba(6, 182, 212, 0.25)',
        'glow-blue': '0 0 30px rgba(37, 99, 235, 0.35)',
        'card-hover': '0 10px 30px -10px rgba(0, 0, 0, 0.5), 0 0 20px rgba(37, 99, 235, 0.15)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}


