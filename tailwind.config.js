/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Roboto', 'sans-serif'], // Ustawienie Roboto jako głównej czcionki sans-serif
        'masque': ['Masque', 'sans-serif'], // Zaktualizuj nazwę rodziny czcionek, aby odpowiadała nazwie używanej w definicji @font-face
        'poppins': ['Poppins', 'sans-serif'], // Zaktualizuj nazwę rodziny czcionek, aby odpowiadała nazwie używanej w definicji @font-face
        'protector': ['Protector', 'sans-serif'], // Zaktualizuj nazwę rodziny czcionek, aby odpowiadała nazwie używanej w definicji @font-face

      }
    }
  },
  plugins: [],
}