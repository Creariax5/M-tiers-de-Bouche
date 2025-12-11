/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'night-bordeaux': '#49111C',
        'stone-brown': '#5D4D3D',
        'dusty-taupe': '#A48C78',
        'white-smoke': '#EAE9E8',
        'black': '#0D0909',
      },
      fontFamily: {
        'primary': ['"Libre Baskerville"', 'serif'],
        'secondary': ['"Raleway"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
