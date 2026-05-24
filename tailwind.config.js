/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fdfcf9',
          100: '#f8f5ee',
          200: '#f0ebe0',
          300: '#e6ddd0',
        },
        navy: {
          400: '#6b8cae',
          500: '#4a7096',
          600: '#3a5a7a',
          700: '#2c4660',
          800: '#1e3048',
        },
        macaron: {
          blue:   '#A8C5DA',
          mint:   '#B5D5C5',
          pink:   '#F2C6C2',
          yellow: '#F5E6C8',
          purple: '#C9C0D3',
          olive:  '#C8D5B9',
          peach:  '#F0D5C0',
          sky:    '#B8D8E8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

