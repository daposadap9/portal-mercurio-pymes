// Hola! Espero que tengas un buen día.
// Hola, ¿cómo estás?
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  output: 'export',
  theme: {
    extend: {
      colors: {
        white: "var(--bg-white)",
        black: "var(--text-black)",
        "white/30": "var(--border-white-30)",
        "teal-600": "var(--text-teal-600)",
        "teal-500": "var(--text-teal-500)",
        "teal-700": "var(--text-teal-700)",
        "teal-50": "var(--teal-50)",
        "teal-100": "var(--teal-100)",
        "teal-200": "var(--teal-200)",
        gray: {
          50: "var(--gray-50)",
          100: "var(--gray-100)",
          200: "var(--gray-200)",
          300: "var(--gray-300)",
          400: "var(--gray-400)",
          500: "var(--gray-500)",
          600: "var(--gray-600)",
          700: "var(--gray-700)",
          800: "var(--gray-800)",
          900: "var(--gray-900)",
        },
        "blue-500": "var(--blue-500)",
        "blue-600": "var(--blue-600)",
        "purple-500": "var(--purple-500)",
        "purple-600": "var(--purple-600)",
        "amber-500": "var(--amber-500)",
        "amber-600": "var(--amber-600)",
        "yellow-500": "var(--yellow-500)",
        "yellow-600": "var(--yellow-600)",
        "red-500": "var(--red-500)",
        "red-600": "var(--red-600)",
        'custom-dark-1': '#0b0d0f',
        'custom-dark-2': '#1a1d21',
        'custom-dark-3': '#292e36',
      },
      boxShadow: {
        'inset-sm': 'inset 0px 0px 2px 1px rgba(0, 0, 0, 0.13)',
      },
      backgroundColor: {
        background: "var(--bg-white)",
      },
      backdropBlur: {
        xl: '10px',
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(-10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      backgroundImage:{
        'custom-gradient': 'linear-gradient(130deg, #0b0d0f 20%, #292e36 100%)',
        'custom-gradient2': 'linear-gradient(130deg, #013A63, #14274E);',
        'custom-gradient3': 'linear-gradient(240deg, #F6F0F0, #FBFBFB,  #F6F0F0)',
      }
    },
  },
  plugins: [],
};
