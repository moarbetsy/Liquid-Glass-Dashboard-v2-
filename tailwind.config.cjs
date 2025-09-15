/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: '#6ea8ff',
      },
      boxShadow: {
        glass: '0 20px 60px rgba(0,0,0,0.45)'
      },
      animation: {
        fade: 'fade 300ms ease both',
      },
      keyframes: {
        fade: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}

