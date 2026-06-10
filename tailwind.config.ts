import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        night: {
          950: '#06050A',
          900: '#0B0810',
          800: '#11101A',
          700: '#1A1A28',
          500: '#2E2D40',
        },
        starlight: '#F4D58D',
        teal: { 300: '#7FB3D5' },
        rose: { 300: '#E8B4B8' },
        amber: { 300: '#D4B26A' },
        ivory: '#F4EEE3',
        gold: {
          900: '#5C4416',
          700: '#8B6A20',
          500: '#C4A661',
          300: '#E4D2A6',
        },
        burgundy: '#5C2A2A',
      },
      fontFamily: {
        sans: ['Pretendard', 'system-ui', 'sans-serif'],
        serif: ['"Cormorant Garamond"', '"Noto Serif KR"', 'serif'],
        display: ['Cinzel', '"Cormorant Garamond"', 'serif'],
      },
      letterSpacing: {
        wider2: '0.18em',
        widest2: '0.32em',
        widest3: '0.5em',
      },
      animation: {
        'pulse-soft': 'pulseSoft 3.2s ease-in-out infinite',
        twinkle: 'twinkle 4s ease-in-out infinite',
      },
      keyframes: {
        pulseSoft: {
          '0%,100%': { opacity: '0.85' },
          '50%': { opacity: '1' },
        },
        twinkle: {
          '0%,100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.15)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
