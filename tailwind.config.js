/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#000000',
          cardDark: '#181818',
          cardLight: '#F6F6F6',
          cardHover: '#F0F0F0',
          banner: '#211C24',
          grayText: '#909090',
          darkText: '#1D1D1F',
          borderLight: '#EBEBEB',
          borderDark: '#2E2E2E',
        },
        primary: {
          DEFAULT: '#000000',
          hover: '#2D2D2D',
        },
        accent: {
          amber: '#F59E0B',
          emerald: '#10B981',
          rose: '#F43F5E',
          cyan: '#06B6D4',
          purple: '#8B5CF6',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'cyber-sm': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'cyber-md': '0 8px 24px rgba(0, 0, 0, 0.08)',
        'cyber-lg': '0 16px 36px rgba(0, 0, 0, 0.12)',
        'cyber-dark': '0 20px 40px rgba(0, 0, 0, 0.6)',
      }
    },
  },
  plugins: [],
}
