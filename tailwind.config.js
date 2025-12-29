/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./App.tsx", 
    "./src/**/*.{js,jsx,ts,tsx}", 
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#252525",
        secondary: "#D9D9D9"
      },
      fontFamily:{
        sans: ["Helvetica", "Arial", "sans-serif"],
        serif: ["Georgia", "serif"],
        mono: ["Menlo", "Monaco", "monospace"],
        anta: ["anta_regular"],
      },
    },
  },
  plugins: [],
}