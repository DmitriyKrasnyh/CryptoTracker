/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#e6f1fe',
          100: '#cce3fd',
          200: '#99c7fb',
          300: '#66abf9',
          400: '#338ff7',
          500: '#0073f5',
          600: '#005cc4',
          700: '#004593',
          800: '#002e62',
          900: '#001731',
        },
        secondary: {
          50: '#e6fff8',
          100: '#ccfff1',
          200: '#99ffe3',
          300: '#66ffd5',
          400: '#33ffc7',
          500: '#00ffb9',
          600: '#00cc94',
          700: '#00996f',
          800: '#00664a',
          900: '#003325',
        },
        dark: {
          50: '#eaeaec',
          100: '#d5d5d9',
          200: '#ababb3',
          300: '#80818d',
          400: '#565766',
          500: '#2b2d40',
          600: '#222433',
          700: '#1a1b26',
          800: '#11121a',
          900: '#09090d',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'neon-primary': '0 0 5px theme("colors.primary.500"), 0 0 20px theme("colors.primary.500")',
        'neon-secondary': '0 0 5px theme("colors.secondary.500"), 0 0 20px theme("colors.secondary.500")',
      },
    },
  },
  plugins: [],
};