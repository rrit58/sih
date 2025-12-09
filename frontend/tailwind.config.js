/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#2552d9',
        brandDark: '#1e3aa6',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(16, 24, 40, 0.05)',
      },
      borderRadius: {
        xl: '12px',
      },
    },
  },
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true,
  },
}