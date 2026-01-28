/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Outfit"', 'sans-serif'],
        serif: ['"Instrument Serif"', 'serif'],
      },
      colors: {
        peach: '#FFDFCC',
        'peach-light': '#fff0e6',
      },
      animation: {
        'fade-in-up': 'fadeInUp 1s ease-out forwards',
        'marquee': 'marquee 20s linear infinite',
        'float': 'float 4s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 3s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
        'wave-bar': 'wave 1.2s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
           '0%': { transform: 'translateX(0%)' },
           '100%': { transform: 'translateX(-100%)' },
        },
        float: {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-ring': {
            '0%': { transform: 'scale(0.8)', opacity: '0.5' },
            '100%': { transform: 'scale(1.3)', opacity: '0' },
        },
        wave: {
            '0%, 100%': { height: '10%' },
            '50%': { height: '100%' },
        }
      }
    },
  },
  plugins: [
    function({ addUtilities }) {
        const rotateXUtilities = {};
        const rotateYUtilities = {};
        const rotateZUtilities = {};
        const rotateValues = [0, 5, 10, 15, 20, 25, 30, 45, 75];
        
        rotateValues.forEach((value) => {
            rotateXUtilities[`.rotate-x-${value}`] = { transform: `perspective(1000px) rotateX(${value}deg)` };
            rotateXUtilities[`.-rotate-x-${value}`] = { transform: `perspective(1000px) rotateX(-${value}deg)` };
            rotateYUtilities[`.rotate-y-${value}`] = { transform: `perspective(1000px) rotateY(${value}deg)` };
            rotateYUtilities[`.-rotate-y-${value}`] = { transform: `perspective(1000px) rotateY(-${value}deg)` };
        });

        addUtilities({
            ...rotateXUtilities,
            ...rotateYUtilities,
            ...rotateZUtilities,
            '.transform-style-preserve-3d': { 'transform-style': 'preserve-3d' },
            '.backface-hidden': { 'backface-visibility': 'hidden' },
            '.perspective-1000': { 'perspective': '1000px' },
        });
    }
  ],
}
