/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{tsx,html}"],
  darkMode: "media",
  prefix: "plasmo-",
  theme: {
    extend: {
      colors: {
        "pewter-orange": "#f4a261",
        "pewter-gray": "#909EAE"
      }
    }
  }
}
