/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Paths to all your React components
    "./public/index.html"         // Add if using vanilla HTML files
  ],
  darkMode: 'class', // Enable class-based dark mode (add 'dark' class to HTML)
  theme: {
    extend: {
      // Custom colors (add to Tailwind's default palette)
      colors: {
        blue: {
          600: '#2A5C9A', // Your logo's primary blue
          400: '#4B8DF8', // Brighter accent blue
        },
        accent: {
          yellow: '#FFD166', // For CTAs (matches your design)
        }
      },
      // Optional: Extend other design tokens
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Default UI font
        heading: ['Manrope', 'sans-serif'], // For titles
      },
      boxShadow: {
        'card': '0 4px 12px rgba(0, 0, 0, 0.08)', // Custom card shadow
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Optional: Better form styles
    require('@tailwindcss/typography'), // Optional: Prose content
  ],
}
