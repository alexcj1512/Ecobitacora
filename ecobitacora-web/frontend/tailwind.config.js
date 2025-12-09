/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6B9080',
          dark: '#5A7A6B',
        },
        accent: '#8FAA96',
        bg: {
          main: '#F5F1E8',
          card: '#D4E7DD',
        },
        text: {
          primary: '#2D3B2D',
          secondary: '#6B7B6B',
        },
        transport: '#4A90E2',
        recycle: '#7CB342',
        energy: '#FFB74D',
        water: '#29B6F6',
        streak: '#FF6B35',
        success: '#66BB6A',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
}
