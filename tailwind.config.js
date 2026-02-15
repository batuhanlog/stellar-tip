/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'spin': 'spin 1s linear infinite',
        'fadeIn': 'fadeIn 0.5s ease-out forwards',
        'fadeInScale': 'fadeInScale 0.4s ease-out forwards',
        'slideInRight': 'slideInRight 0.5s ease-out forwards',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      colors: {
        tip: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
      },
      backgroundImage: {
        'warm-radial': 'radial-gradient(ellipse at top, rgba(139, 92, 246, 0.15), transparent 50%)',
      },
    },
  },
  plugins: [],
}
