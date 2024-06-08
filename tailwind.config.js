/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/*"
  ],
  theme: {
    screens:{
    },
    extend: {
      animation: {
        fade: 'fadeOut 1s ease-in-out',
      },
      bounce:{
        animation:`bounce 1s ease-in-out`  
      },
      container:{
        padding: '2rem',
      }
    },
  },
  plugins: [],
}