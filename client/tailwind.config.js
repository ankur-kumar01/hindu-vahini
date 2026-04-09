/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: '#ff9933',
        saffronLight: '#ffa347',
        dark: '#0a192f',
        light: '#fdfbf7',
        gray: {
          100: '#f8f9fa',
          800: '#1a202c',
          600: '#4a5568'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif']
      },
      boxShadow: {
        'soft': '0 15px 40px rgba(0,0,0,0.04)',
        'img': '0 10px 25px rgba(0,0,0,0.08)'
      }
    },
  },
  plugins: [],
}
