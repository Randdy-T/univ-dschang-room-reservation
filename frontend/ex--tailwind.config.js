/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'univ-blue': '#003366',
        'univ-green': '#008000',
      },
    },
  },
  plugins: [],
}