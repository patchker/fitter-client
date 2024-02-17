/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Roboto', 'sans-serif'],
        'masque': ['Masque', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
        'bungee': ['Bungee', 'sans-serif'],

      }
    }
  },
  plugins: [],
}