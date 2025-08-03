/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FFEDD5',    // Peach
        secondary: '#FFD6E8',  // Candy pink
        accent1: '#AEEEEE',    // Soft blue
        accent2: '#FDF6E3',    // Light cream
        textPrimary: '#1F2937', // Dark gray
        textBody: '#4B5563',   // Medium gray
        magic: {
          pink: '#F472B6',
          purple: '#A855F7',
          orange: '#F97316',
        }
      },
      fontFamily: {
        'fredoka': ['Fredoka One', 'cursive'],
        'poppins': ['Poppins', 'sans-serif'],
      },
      animation: {
        'bounce-gentle': 'bounce-gentle 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'wiggle': 'wiggle 0.5s ease-in-out',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-10px) rotate(1deg)' },
          '66%': { transform: 'translateY(-5px) rotate(-1deg)' },
        },
        'wiggle': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-3deg)' },
          '75%': { transform: 'rotate(3deg)' },
        },
        'sparkle': {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.7, transform: 'scale(1.2)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(244, 114, 182, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(244, 114, 182, 0.8)' },
        },
      },
    },
  },
  plugins: [],
};