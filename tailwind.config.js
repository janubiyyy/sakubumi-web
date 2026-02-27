/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6B4F3B", // Coklat tua
          light: "#8B6F5B",
          dark: "#4B2F1B",
        },
        cream: {
          DEFAULT: "#F5EBDD",
          light: "#FFFDF9",
          dark: "#E5DBCD",
        },
        sage: {
          DEFAULT: "#A3B18A",
          light: "#C3D1AA",
          dark: "#83916A",
        },
        accent: {
          orange: "#D4A373", // Soft orange
          brown: "#3E2C23", // Dark brown
        },
        background: "#F9F8F6", // Super light earthy bg
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '24px',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(107, 79, 59, 0.08)',
        'card': '0 8px 30px -4px rgba(107, 79, 59, 0.05)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
