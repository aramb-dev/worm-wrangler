/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.{html,js}",
    "./node_modules/flowbite/**/*.js" // Add this line
  ],
  theme: {
    extend: {
      fontFamily: {
        'dm-sans': ['DM Sans', 'sans-serif'],
        'ibm-plex': ['IBM Plex Sans', 'sans-serif'],
      },
      cursor: {
        'custom': 'url("./images/openHand1.png") 25 25, auto',
        'custom-closed': 'url("./images/closeHand1.png") 25 25, auto'
      }
    },
  },
  plugins: [
    require('flowbite/plugin') // Add this line
  ],
}
