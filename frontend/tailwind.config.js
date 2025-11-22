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
        // Notion-inspired color palette
        notion: {
          bg: {
            light: '#FFFFFF',
            dark: '#191919',
          },
          sidebar: {
            light: '#F7F6F3',
            dark: '#2E2E2E',
          },
          text: {
            light: '#37352F',
            dark: '#FFFFFF',
          },
          accent: '#2383E2',
          border: {
            light: '#E9E9E7',
            dark: '#3D3D3D',
          },
          hover: {
            light: '#F1F1EF',
            dark: '#373737',
          },
          error: '#E16259',
          warning: '#F7B731',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

