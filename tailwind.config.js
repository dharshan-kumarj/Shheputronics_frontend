/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6B46C1',
          dark: '#553C9A',
          light: '#9F7AEA',
        },
        dark: {
          DEFAULT: '#1A1A1A',
          light: '#2D2D2D',
          lighter: '#3D3D3D',
        }
      },
    },
  },
  plugins: [],
}