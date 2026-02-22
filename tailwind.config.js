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
      fontFamily: {
        sans: ['Space Grotesk', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      animation: {
        'spin': 'spin 1s linear infinite',
        'fadeIn': 'fadeIn 0.5s ease-out forwards',
        'fadeInScale': 'fadeInScale 0.4s ease-out forwards',
        'slideInRight': 'slideInRight 0.5s ease-out forwards',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'neon': 'neon-border 3s ease-in-out infinite',
      },
      colors: {
        dark: {
          900: '#03030a',
          800: '#08080f',
          700: '#0e0e1a',
          600: '#151525',
        },
        purple: {
          950: '#1a0040',
          900: '#2d0080',
          800: '#4a00cc',
          700: '#6a00ff',
          600: '#8b2fff',
          500: '#a855f7',
          400: '#c65eff',
          300: '#d48aff',
          200: '#e8b4ff',
          100: '#f5d9ff',
        },
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(106, 0, 255, 0.18) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 80% 80%, rgba(198, 94, 255, 0.08) 0%, transparent 50%)',
        'purple-gradient': 'linear-gradient(135deg, #6a00ff, #c65eff)',
        'card-gradient': 'linear-gradient(135deg, rgba(106,0,255,0.08), rgba(198,94,255,0.04))',
      },
      boxShadow: {
        'glow-sm': '0 4px 24px rgba(198, 94, 255, 0.2)',
        'glow': '0 8px 40px rgba(198, 94, 255, 0.25)',
        'glow-lg': '0 16px 64px rgba(198, 94, 255, 0.35)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.4)',
      },
      borderColor: {
        'purple-glow': 'rgba(198, 94, 255, 0.35)',
      },
    },
  },
  plugins: [],
}
